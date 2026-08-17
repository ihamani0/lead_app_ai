<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip on non-PostgreSQL databases (e.g. SQLite for testing)
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('CREATE EXTENSION IF NOT EXISTS vector;');

        Schema::create('langchain_pg_collection', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->jsonb('cmetadata')->nullable();
        });

        Schema::create('langchain_pg_embedding', function (Blueprint $table) {
            $table->id(); // The auto-incrementing row ID
            $table->string('embedding_id'); // Renamed from 'id' to avoid conflict
            $table->uuid('collection_id');
            $table->vector('embedding', 3072);
            $table->text('document');
            $table->jsonb('cmetadata')->nullable();
        });

        Schema::table('langchain_pg_embedding', function (Blueprint $table) {
            $table->foreign('collection_id')->references('uuid')->on('langchain_pg_collection')->onDelete('cascade');
        });

        Schema::table('langchain_pg_embedding', function (Blueprint $table) {
            $table->index('cmetadata', 'ix_cmetadata_gin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('langchain_pg_embedding');
        Schema::dropIfExists('langchain_pg_collection');
    }
};
