<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ─── 1. Enable pgvector extension ────────────────────────────────────
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        // ─── 2. Main chunks table ─────────────────────────────────────────────
        // Schema matches what n8n's Postgres Vector Store node expects (id, text,
        // metadata, embedding). tenant_id, document_id, instance_name are stored
        // inside metadata JSONB — injected by the Data Loader node in n8n.
        // search_vector is a generated column for full-text / hybrid search.
        DB::statement("
            CREATE TABLE IF NOT EXISTS document_chunks (
                id            BIGSERIAL PRIMARY KEY,
                text          TEXT      NOT NULL DEFAULT '',
                metadata      JSONB     NOT NULL DEFAULT '{}',
                embedding     vector(3072),
                search_vector TSVECTOR  GENERATED ALWAYS AS (to_tsvector('english', coalesce(text, ''))) STORED
            )
        ");

        // ─── 3. Indexes ───────────────────────────────────────────────────────

        // Filter by tenant_id stored inside metadata JSONB
        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_chunks_tenant
            ON document_chunks ((metadata->>'tenant_id'))
        ");

        // Filter by tenant + document together (e.g. delete all chunks of a doc)
        DB::statement("
            CREATE INDEX IF NOT EXISTS idx_chunks_tenant_document
            ON document_chunks ((metadata->>'tenant_id'), (metadata->>'document_id'))
        ");

        // IVFFlat ANN index for fast vector similarity search.
        // ⚠️  Uncomment once you have ~3000+ rows — it errors on an empty table.
        // DB::statement("
        //     CREATE INDEX IF NOT EXISTS idx_chunks_embedding
        //     ON document_chunks
        //     USING ivfflat (embedding vector_cosine_ops)
        //     WITH (lists = 100)
        // ");

        // GIN index for full-text search used by hybrid_search
        DB::statement('
            CREATE INDEX IF NOT EXISTS idx_chunks_search_vector
            ON document_chunks
            USING GIN (search_vector)
        ');

        // ─── 4. Pure vector similarity search ────────────────────────────────
        // Used by n8n AI Agent / retrieval nodes.
        // tenant_id is matched against metadata JSONB (not a real column).
        DB::statement("
            CREATE OR REPLACE FUNCTION match_documents(
                query_embedding vector(3072),
                tenant_id_val   TEXT,
                match_count     INT  DEFAULT 5,
                filter          JSONB DEFAULT '{}'
            )
            RETURNS TABLE (
                id         BIGINT,
                text       TEXT,
                metadata   JSONB,
                similarity FLOAT
            )
            LANGUAGE plpgsql AS \$\$
            BEGIN
                RETURN QUERY
                SELECT
                    dc.id,
                    dc.text,
                    dc.metadata,
                    1 - (dc.embedding <=> query_embedding) AS similarity
                FROM document_chunks dc
                WHERE
                    dc.metadata->>'tenant_id' = tenant_id_val
                    AND (filter = '{}' OR dc.metadata @> filter)
                ORDER BY dc.embedding <=> query_embedding
                LIMIT match_count;
            END;
            \$\$
        ");

        // ─── 5. Hybrid search (70% vector + 30% full-text) ───────────────────
        // Better answer quality for keyword-heavy questions.
        // tenant_id matched via metadata JSONB — consistent with match_documents.
        DB::statement("
            CREATE OR REPLACE FUNCTION hybrid_search(
                tenant_id_val   TEXT,
                query_embedding vector(3072),
                query_text      TEXT,
                match_count     INT DEFAULT 5
            )
            RETURNS TABLE (
                id         BIGINT,
                text       TEXT,
                metadata   JSONB,
                similarity FLOAT,
                rank       FLOAT,
                score      FLOAT
            )
            LANGUAGE SQL AS \$\$
                SELECT
                    id,
                    text,
                    metadata,
                    1 - (embedding <=> query_embedding) AS similarity,
                    ts_rank(search_vector, plainto_tsquery('english', query_text)) AS rank,
                    -- Combined score: 70% semantic + 30% keyword
                    (
                        0.7 * (1 - (embedding <=> query_embedding))
                        +
                        0.3 * ts_rank(search_vector, plainto_tsquery('english', query_text))
                    ) AS score
                FROM document_chunks
                WHERE metadata->>'tenant_id' = tenant_id_val
                ORDER BY score DESC
                LIMIT match_count;
            \$\$
        ");
    }

    public function down(): void
    {
        DB::statement('DROP FUNCTION IF EXISTS hybrid_search');
        DB::statement('DROP FUNCTION IF EXISTS match_documents');
        DB::statement('DROP TABLE IF EXISTS document_chunks');
        // Extension is intentionally kept — other tables may depend on it
    }
};
