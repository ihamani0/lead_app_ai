import { useState } from 'react';

const sprints = [
    {
        id: 1,
        title: 'Sprint 1 — Foundation',
        subtitle: 'Infrastructure + Laravel Core',
        duration: 'Week 1–2 · 10 days',
        color: '#6366F1',
        bg: '#EEF2FF',
        border: '#C7D2FE',
        icon: '🏗️',
        stories: [
            {
                id: 'S1-1',
                points: 3,
                priority: 'critical',
                title: 'Docker Compose setup',
                tasks: [
                    'docker-compose.yml with all 7 services (postgres, redis, evolution, n8n, app, nginx, reverb)',
                    'Nginx config: route /api → Laravel, /n8n → n8n, /evolution → Evolution API',
                    "Shared internal network 'saas', named volumes for postgres + n8n data",
                    'Health checks for all containers',
                ],
            },
            {
                id: 'S1-2',
                points: 5,
                priority: 'critical',
                title: 'Laravel project bootstrap',
                tasks: [
                    'laravel new app --jet (or breeze) with Inertia + React',
                    'Install: inertiajs, sanctum, reverb, phpoffice/phpword, phpoffice/phpspreadsheet',
                    'Configure .env: DB_*, REDIS_*, EVOLUTION_API_*, OPENAI_*, QUEUE_CONNECTION=redis',
                    'Dockerfile for Laravel (php 8.3-fpm + pdftotext + pgvector deps)',
                ],
            },
            {
                id: 'S1-3',
                points: 8,
                priority: 'critical',
                title: 'All database migrations',
                tasks: [
                    'enable_pgvector migration (CREATE EXTENSION vector)',
                    'tenants table (uuid PK, slug, plan, is_active, settings jsonb)',
                    'users table with tenant_id FK and role column',
                    'evolution_instances table (instance_name unique, status, qr_code, webhook_url)',
                    'leads table (phone, status, score, source, budget, quartier, metadata jsonb)',
                    'conversations + messages tables (direction, type, is_from_ai)',
                    'agent_configs table (system_prompt, llm_provider, llm_model, temperature, version)',
                    'knowledge_documents + document_chunks (vector(1536) column via raw SQL)',
                    'follow_up_sequences, appointments, notifications, media_assets, rag_queries',
                ],
            },
            {
                id: 'S1-4',
                points: 3,
                priority: 'high',
                title: 'Models + Tenant middleware',
                tasks: [
                    'All 12 Eloquent models with casts, relations, scopes',
                    'TenantScope global scope → auto-filter by tenant_id',
                    'ResolveTenant middleware → sets app tenant from auth user',
                    'Helper: tenant() → returns current tenant',
                ],
            },
            {
                id: 'S1-5',
                points: 2,
                priority: 'high',
                title: 'Auth + Sanctum',
                tasks: [
                    'Laravel Sanctum SPA authentication',
                    'Login / logout / me endpoints',
                    'Register tenant + first admin user seeder',
                    'Role middleware: admin, manager, agent',
                ],
            },
        ],
    },
    {
        id: 2,
        title: 'Sprint 2 — Evolution API',
        subtitle: 'WhatsApp Integration Layer',
        duration: 'Week 3 · 5 days',
        color: '#10B981',
        bg: '#ECFDF5',
        border: '#A7F3D0',
        icon: '📱',
        stories: [
            {
                id: 'S2-1',
                points: 5,
                priority: 'critical',
                title: 'EvolutionApiService',
                tasks: [
                    'createInstance(), getQrCode(), getInstanceStatus(), deleteInstance()',
                    'sendText(), sendMedia() [image/video/document], sendAudio()',
                    'uploadMedia(), setWebhook(), fetchMessages(), markAsRead()',
                    'Error handling: retry on 429, throw on 4xx, log all calls',
                ],
            },
            {
                id: 'S2-2',
                points: 3,
                priority: 'critical',
                title: 'EvolutionInstanceController',
                tasks: [
                    'POST /api/instances → create instance in Evolution + save to DB',
                    'GET /api/instances/{id}/qr → fetch QR from Evolution, return base64',
                    'GET /api/instances/{id}/status → sync status from Evolution to DB',
                    'DELETE /api/instances/{id} → delete from Evolution + DB',
                ],
            },
            {
                id: 'S2-3',
                points: 5,
                priority: 'critical',
                title: 'Webhook receiver + ProcessInboundMessage job',
                tasks: [
                    'POST /api/webhook/evolution/{instance} (public, verified by secret header)',
                    'Route events: messages.upsert → ProcessInboundMessage::dispatch()',
                    'Route events: connection.update → UpdateInstanceStatus::dispatch()',
                    'ProcessInboundMessage: find/create Lead + Conversation, store Message',
                    'Broadcast NewMessageEvent to Reverb channel tenant.{id}',
                    'Create Notification record for agents',
                ],
            },
            {
                id: 'S2-4',
                points: 3,
                priority: 'high',
                title: 'MessageController (outbound)',
                tasks: [
                    'POST /api/messages/send → validate, call EvolutionApiService, store outbound Message',
                    'Support: text, image, video, audio, document',
                    'Broadcast sent message to dashboard in real-time',
                    'Mark conversation as agent_handled if sent by human',
                ],
            },
            {
                id: 'S2-5',
                points: 2,
                priority: 'medium',
                title: 'N8nBridgeController',
                tasks: [
                    'POST /api/n8n/send-message (server-to-server, n8n token auth)',
                    'POST /api/n8n/update-lead (status, score, notes from AI agent)',
                    'POST /api/n8n/create-rdv (create Appointment record)',
                    'GET /api/n8n/agent-config/{type} (return system prompt for n8n)',
                ],
            },
        ],
    },
    {
        id: 3,
        title: 'Sprint 3 — RAG System',
        subtitle: 'Per-Tenant Vector Knowledge Base',
        duration: 'Week 4 · 5 days',
        color: '#8B5CF6',
        bg: '#F5F3FF',
        border: '#DDD6FE',
        icon: '🧠',
        stories: [
            {
                id: 'S3-1',
                points: 3,
                priority: 'critical',
                title: 'TextExtractorService',
                tasks: [
                    'PDF → pdftotext (poppler-utils in Docker)',
                    'DOCX → phpoffice/phpword',
                    'XLSX → phpoffice/phpspreadsheet',
                    'TXT/HTML → file_get_contents + strip_tags',
                    'URL → Http::get() + strip_tags',
                ],
            },
            {
                id: 'S3-2',
                points: 3,
                priority: 'critical',
                title: 'TextChunkerService',
                tasks: [
                    'Recursive splitter: paragraph → sentence → word fallback',
                    '800 token chunks, 150 token overlap',
                    'Preserve page_number + section_title metadata per chunk',
                    'Return array of {content, chunk_index, token_count, metadata}',
                ],
            },
            {
                id: 'S3-3',
                points: 5,
                priority: 'critical',
                title: 'EmbeddingService + ProcessDocumentJob',
                tasks: [
                    'EmbeddingService: OpenAI text-embedding-3-small batch (20/call) + Gemini fallback',
                    'ProcessDocumentJob: extract → chunk → embed → bulk INSERT document_chunks',
                    'Use raw SQL for vector(1536) column: INSERT ... ?::vector',
                    'Retry 3x with 60s backoff, markFailed() on error',
                    'markIndexed(chunkCount) on success, broadcast status update',
                ],
            },
            {
                id: 'S3-4',
                points: 3,
                priority: 'critical',
                title: 'RagSearchService + search endpoint',
                tasks: [
                    'embed query → pgvector cosine similarity search scoped by tenant_id',
                    'WHERE tenant_id = ? AND 1-(embedding <=> ?::vector) >= 0.70 LIMIT 5',
                    'buildContext() → formatted string for LLM prompt injection',
                    'POST /api/n8n/rag-search → used by n8n HTTP Request node',
                    'Log every query to rag_queries table',
                ],
            },
            {
                id: 'S3-5',
                points: 3,
                priority: 'high',
                title: 'KnowledgeBaseController',
                tasks: [
                    'POST /api/knowledge-documents → upload file, dispatch ProcessDocumentJob',
                    'GET /api/knowledge-documents → paginated list with status',
                    'GET /api/knowledge-documents/{id}/chunks → preview chunks',
                    'POST /api/knowledge-documents/{id}/reindex → re-run job',
                    'DELETE /api/knowledge-documents/{id} → remove file + cascade delete chunks',
                ],
            },
        ],
    },
    {
        id: 4,
        title: 'Sprint 4 — Dashboard UI',
        subtitle: 'React + Inertia + shadcn/ui',
        duration: 'Week 5–6 · 8 days',
        color: '#F59E0B',
        bg: '#FFFBEB',
        border: '#FDE68A',
        icon: '🎨',
        stories: [
            {
                id: 'S4-1',
                points: 3,
                priority: 'critical',
                title: 'Layout + shadcn setup',
                tasks: [
                    'npx shadcn@latest init (Zinc color, CSS variables)',
                    'Install: sidebar, card, badge, button, table, dialog, toast, sheet, tabs, progress',
                    'AppLayout.jsx: collapsible Sidebar + TopBar + NotificationBell',
                    'Sidebar links: Dashboard, Leads, Inbox, Instances, Agents, Knowledge, Reports',
                    'Laravel Reverb + Echo setup in app.js for real-time',
                ],
            },
            {
                id: 'S4-2',
                points: 5,
                priority: 'critical',
                title: 'Dashboard page — KPI overview',
                tasks: [
                    '4 KPI cards: Total Leads, Hot Leads, RDV booked, Conversion %',
                    'Leads by status bar chart (recharts)',
                    'Leads by source pie chart (recharts)',
                    'Leads per day line chart — last 30 days (recharts)',
                    'Live Activity feed: last 10 events (new lead, message, status change)',
                ],
            },
            {
                id: 'S4-3',
                points: 5,
                priority: 'critical',
                title: 'Leads page (CRM table)',
                tasks: [
                    'DataTable with: name, phone, source, status badge, score bar, assigned, last activity',
                    'Filter by: status, source, date range, assigned agent',
                    'Click row → Lead Detail sheet/drawer',
                    'Lead Detail: info card + conversation timeline + score + appointments + follow-up status',
                    'Inline status change dropdown + assign agent',
                ],
            },
            {
                id: 'S4-4',
                points: 8,
                priority: 'critical',
                title: 'Inbox — Real-time chat',
                tasks: [
                    '2-panel layout: conversation list (left) + chat window (right)',
                    'Conversation list: avatar, name, last message, time, unread badge',
                    'Chat window: message bubbles (inbound=left, outbound=right, AI=purple tint)',
                    'Message types: text, image preview, video player, audio player, document link',
                    'Send bar: text input + media upload button + type selector',
                    'Real-time: new messages via Reverb without refresh',
                    'Typing indicator when AI agent is responding',
                ],
            },
            {
                id: 'S4-5',
                points: 3,
                priority: 'high',
                title: 'Evolution Instances page',
                tasks: [
                    'Instance cards: name, phone number, status badge (green/red/yellow), connected_at',
                    'Create Instance modal: name input → POST → show QR code dialog',
                    'QR code display with auto-refresh every 30s until connected',
                    'Delete instance with confirmation dialog',
                    'Status sync button (manual refresh from Evolution API)',
                ],
            },
        ],
    },
    {
        id: 5,
        title: 'Sprint 5 — AI Control + Knowledge UI',
        subtitle: 'Agent Config + Knowledge Base Management',
        duration: 'Week 7 · 5 days',
        color: '#EC4899',
        bg: '#FDF2F8',
        border: '#FBCFE8',
        icon: '🤖',
        stories: [
            {
                id: 'S5-1',
                points: 5,
                priority: 'critical',
                title: 'Agent Config editor',
                tasks: [
                    'List 2 agents: Assistant Commercial + Prediction Agent',
                    'Click agent → full-page prompt editor (Monaco or CodeMirror for syntax highlight)',
                    'Fields: system_prompt (textarea), llm_provider (select), llm_model (select), temperature (slider 0–2)',
                    'Save → PATCH /api/agent-configs/{id} → version increments',
                    'Version history: dropdown to view previous prompts (read-only)',
                    'Test button: opens dialog, type a test message, see AI response preview',
                ],
            },
            {
                id: 'S5-2',
                points: 5,
                priority: 'critical',
                title: 'Knowledge Base page',
                tasks: [
                    'Document grid: name, type icon (PDF/DOCX/XLSX/URL), status badge, chunk count, uploaded by',
                    'Drag-drop upload zone (react-dropzone) + URL import tab',
                    'Upload progress bar → status polling every 3s (pending→processing→indexed)',
                    'Animated status pill: spinning loader while processing, green check when indexed',
                    'Click document → chunks preview modal (paginated list of chunk text + similarity score tester)',
                    'Re-index button + delete with confirmation',
                ],
            },
            {
                id: 'S5-3',
                points: 3,
                priority: 'high',
                title: 'Follow-up Sequences manager',
                tasks: [
                    'Table: lead name, step (H+24/H+48/Final), status, scheduled_at, message preview',
                    'Skip follow-up button per row',
                    'Global sequence config: enable/disable each step, edit delay hours, edit message templates',
                    'Variables helper: show available {{variables}} for templates',
                ],
            },
            {
                id: 'S5-4',
                points: 2,
                priority: 'medium',
                title: 'Media Assets manager',
                tasks: [
                    'Grid view: thumbnail for images, video preview, document icon',
                    "Upload asset + tag it (e.g. 'brochure', 'floor-plan', 'video-tour')",
                    'Name field = identifier used in n8n get_media_asset tool',
                    'Delete asset',
                ],
            },
        ],
    },
    {
        id: 6,
        title: 'Sprint 6 — Reports + Notifications',
        subtitle: 'Analytics, KPIs, Real-time Alerts',
        duration: 'Week 8 · 5 days',
        color: '#14B8A6',
        bg: '#F0FDFA',
        border: '#99F6E4',
        icon: '📊',
        stories: [
            {
                id: 'S6-1',
                points: 5,
                priority: 'critical',
                title: 'Reports page',
                tasks: [
                    'Date range picker (last 7 / 30 / 90 days or custom)',
                    'KPI summary row: leads, hot leads, RDV, conversion %, avg score',
                    'Lead Funnel chart: new → contacted → qualified → hot → RDV (recharts funnel)',
                    'Leads by source bar chart',
                    'Leads by day area chart',
                    'RAG stats: docs indexed, searches today, avg latency ms',
                    'Export to CSV button for leads table',
                ],
            },
            {
                id: 'S6-2',
                points: 3,
                priority: 'critical',
                title: 'Real-time notification system',
                tasks: [
                    'NotificationBell in TopBar: unread count badge',
                    'Dropdown panel: list of notifications with type icon, title, time ago',
                    'Mark as read on click, Mark all read button',
                    'Real-time: Reverb pushes new notification → bell animates + count increments',
                    'Notification types: new_lead (blue), hot_lead (red pulse), rdv (green), message (gray)',
                ],
            },
            {
                id: 'S6-3',
                points: 3,
                priority: 'high',
                title: 'Appointments (RDV) page',
                tasks: [
                    'Calendar view (react-big-calendar or simple week grid)',
                    'Appointment cards: lead name, type (physical/phone), status badge, notes',
                    'Status update: pending → confirmed → done / cancelled',
                    'Filter by: status, type, date',
                    'Link to Lead Detail from appointment card',
                ],
            },
            {
                id: 'S6-4',
                points: 2,
                priority: 'medium',
                title: 'Tenant Settings page',
                tasks: [
                    'Branding: company name, logo upload',
                    'AI settings: default language, response delay, typing simulation toggle',
                    'Notification settings: email recipients for hot_lead alerts',
                    'RAG settings: top_k slider, min_similarity slider',
                    'Save → PATCH /api/tenant/settings',
                ],
            },
        ],
    },
    {
        id: 7,
        title: 'Sprint 7 — n8n Reconnect + QA',
        subtitle: 'Wire n8n to Laravel + Testing',
        duration: 'Week 9 · 5 days',
        color: '#EF4444',
        bg: '#FEF2F2',
        border: '#FECACA',
        icon: '🔗',
        stories: [
            {
                id: 'S7-1',
                points: 5,
                priority: 'critical',
                title: 'Replace n8n WhatsApp nodes',
                tasks: [
                    "Replace all 'whatsApp' send nodes → HTTP Request → POST /api/n8n/send-message",
                    'Replace WhatsApp Trigger → keep as webhook, normalize payload in Laravel first',
                    'Replace Supabase Vector Store → HTTP Request → POST /api/n8n/rag-search',
                    'Add HTTP Request node to fetch agent config: GET /api/n8n/agent-config/commercial',
                    "Update Postgres Chat Memory connection to use app's Postgres container",
                    'Add HTTP Request node to update lead: POST /api/n8n/update-lead',
                ],
            },
            {
                id: 'S7-2',
                points: 3,
                priority: 'critical',
                title: 'End-to-end flow test',
                tasks: [
                    'Test: lead submits form → webhook → Lead created → WhatsApp welcome sent',
                    'Test: lead replies → message stored → AI responds → message stored',
                    'Test: follow-up H+24 scheduled → sent at right time',
                    "Test: Prediction agent scores lead → status updated to 'hot' → notification fired",
                    'Test: document uploaded → indexed → RAG search returns relevant chunks',
                ],
            },
            {
                id: 'S7-3',
                points: 3,
                priority: 'high',
                title: 'Security hardening',
                tasks: [
                    'Webhook secret header validation (X-Evolution-Secret)',
                    'n8n internal token middleware (not sanctum — server-to-server)',
                    'Tenant isolation test: user from Tenant A cannot access Tenant B data',
                    'Rate limiting on API routes (throttle middleware)',
                    'File upload validation: mime sniffing, max size, extension whitelist',
                ],
            },
            {
                id: 'S7-4',
                points: 2,
                priority: 'medium',
                title: 'Performance + Deploy',
                tasks: [
                    'php artisan optimize, route:cache, config:cache, view:cache',
                    'Queue worker supervisor config (queue: rag,default)',
                    'Nginx SSL (certbot) + HTTP→HTTPS redirect',
                    'Postgres connection pooling (PgBouncer) if needed',
                    'Set up basic monitoring: failed jobs alert, queue depth alert',
                ],
            },
        ],
    },
];

const priorityConfig = {
    critical: { label: 'Critical', color: '#EF4444', bg: '#FEF2F2' },
    high: { label: 'High', color: '#F59E0B', bg: '#FFFBEB' },
    medium: { label: 'Medium', color: '#3B82F6', bg: '#EFF6FF' },
};

export default function ScrumBoard() {
    const [openSprint, setOpenSprint] = useState(1);
    const [openStory, setOpenStory] = useState(null);
    const [done, setDone] = useState({});

    const toggleTask = (key) => setDone((p) => ({ ...p, [key]: !p[key] }));

    const totalPoints = sprints.reduce(
        (a, s) => a + s.stories.reduce((b, st) => b + st.points, 0),
        0,
    );
    const totalDone = Object.values(done).filter(Boolean).length;
    const totalTasks = sprints.reduce(
        (a, s) => a + s.stories.reduce((b, st) => b + st.tasks.length, 0),
        0,
    );

    const sprint = sprints.find((s) => s.id === openSprint);

    const sprintDoneCount = (s) =>
        s.stories.reduce(
            (a, st) =>
                a + st.tasks.filter((_, i) => done[`${st.id}-${i}`]).length,
            0,
        );
    const sprintTotalTasks = (s) =>
        s.stories.reduce((a, st) => a + st.tasks.length, 0);

    return (
        <div
            style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                background: '#0F0F13',
                minHeight: '100vh',
                color: '#E2E8F0',
            }}
        >
            {/* Top bar */}
            <div
                style={{
                    background: '#18181F',
                    borderBottom: '1px solid #2D2D3A',
                    padding: '16px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background:
                                'linear-gradient(135deg,#6366F1,#8B5CF6)',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                        }}
                    >
                        ⚡
                    </div>
                    <div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: '-0.3px',
                            }}
                        >
                            WhatsApp AI SaaS
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                            Scrum Build Plan — 7 Sprints · 9 Weeks
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        gap: 24,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                            Story Points
                        </div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: '#A78BFA',
                            }}
                        >
                            {totalPoints} pts
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                            Tasks Done
                        </div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: '#34D399',
                            }}
                        >
                            {totalDone} / {totalTasks}
                        </div>
                    </div>
                    <div
                        style={{
                            width: 120,
                            height: 6,
                            background: '#2D2D3A',
                            borderRadius: 99,
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${totalTasks ? (totalDone / totalTasks) * 100 : 0}%`,
                                background:
                                    'linear-gradient(90deg,#6366F1,#34D399)',
                                borderRadius: 99,
                                transition: 'width 0.4s',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
                {/* Sprint sidebar */}
                <div
                    style={{
                        width: 270,
                        background: '#13131A',
                        borderRight: '1px solid #2D2D3A',
                        overflowY: 'auto',
                        padding: '16px 0',
                    }}
                >
                    {sprints.map((s) => {
                        const done_ = sprintDoneCount(s);
                        const total_ = sprintTotalTasks(s);
                        const pct = total_
                            ? Math.round((done_ / total_) * 100)
                            : 0;
                        const pts = s.stories.reduce(
                            (a, st) => a + st.points,
                            0,
                        );
                        return (
                            <div
                                key={s.id}
                                onClick={() => {
                                    setOpenSprint(s.id);
                                    setOpenStory(null);
                                }}
                                style={{
                                    padding: '12px 20px',
                                    cursor: 'pointer',
                                    borderLeft:
                                        openSprint === s.id
                                            ? `3px solid ${s.color}`
                                            : '3px solid transparent',
                                    background:
                                        openSprint === s.id
                                            ? `${s.color}10`
                                            : 'transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 4,
                                    }}
                                >
                                    <span style={{ fontSize: 18 }}>
                                        {s.icon}
                                    </span>
                                    <div>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 12.5,
                                                color:
                                                    openSprint === s.id
                                                        ? '#F1F5F9'
                                                        : '#94A3B8',
                                            }}
                                        >
                                            {s.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 10.5,
                                                color: '#475569',
                                            }}
                                        >
                                            {s.duration}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            marginLeft: 'auto',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: s.color,
                                        }}
                                    >
                                        {pts}pt
                                    </div>
                                </div>
                                <div
                                    style={{
                                        height: 3,
                                        background: '#2D2D3A',
                                        borderRadius: 99,
                                        marginTop: 6,
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${pct}%`,
                                            background: s.color,
                                            borderRadius: 99,
                                            transition: 'width 0.4s',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontSize: 10,
                                        color: '#475569',
                                        marginTop: 3,
                                    }}
                                >
                                    {done_}/{total_} tasks · {pct}%
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stories panel */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px 28px',
                        background: '#0F0F13',
                    }}
                >
                    {sprint && (
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            background: `${sprint.color}20`,
                                            border: `2px solid ${sprint.color}40`,
                                            borderRadius: 10,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 20,
                                        }}
                                    >
                                        {sprint.icon}
                                    </div>
                                    <div>
                                        <h2
                                            style={{
                                                margin: 0,
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: '#F1F5F9',
                                            }}
                                        >
                                            {sprint.title}
                                        </h2>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: '#64748B',
                                            }}
                                        >
                                            {sprint.subtitle} ·{' '}
                                            {sprint.duration}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: 14 }}>
                                {sprint.stories.map((st) => {
                                    const stDone = st.tasks.filter(
                                        (_, i) => done[`${st.id}-${i}`],
                                    ).length;
                                    const stPct = Math.round(
                                        (stDone / st.tasks.length) * 100,
                                    );
                                    const isOpen = openStory === st.id;
                                    const pri = priorityConfig[st.priority];

                                    return (
                                        <div
                                            key={st.id}
                                            style={{
                                                background: '#18181F',
                                                border: `1px solid ${isOpen ? sprint.color + '60' : '#2D2D3A'}`,
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                transition: 'border 0.2s',
                                            }}
                                        >
                                            {/* Story header */}
                                            <div
                                                onClick={() =>
                                                    setOpenStory(
                                                        isOpen ? null : st.id,
                                                    )
                                                }
                                                style={{
                                                    padding: '14px 18px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: 6,
                                                        background: `${sprint.color}15`,
                                                        border: `1.5px solid ${sprint.color}30`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: 99,
                                                            background:
                                                                stPct === 100
                                                                    ? sprint.color
                                                                    : '#2D2D3A',
                                                            transition:
                                                                'background 0.3s',
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: 10,
                                                                color: '#475569',
                                                                fontWeight: 600,
                                                                fontFamily:
                                                                    'monospace',
                                                            }}
                                                        >
                                                            {st.id}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: 13.5,
                                                                fontWeight: 600,
                                                                color: '#E2E8F0',
                                                            }}
                                                        >
                                                            {st.title}
                                                        </span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: 8,
                                                            marginTop: 5,
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: 10,
                                                                fontWeight: 700,
                                                                color: pri.color,
                                                                background:
                                                                    pri.bg +
                                                                    '22',
                                                                padding:
                                                                    '1px 7px',
                                                                borderRadius: 99,
                                                                border: `1px solid ${pri.color}33`,
                                                            }}
                                                        >
                                                            {pri.label}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: 10,
                                                                color: '#64748B',
                                                            }}
                                                        >
                                                            {st.tasks.length}{' '}
                                                            tasks
                                                        </span>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                height: 3,
                                                                background:
                                                                    '#2D2D3A',
                                                                borderRadius: 99,
                                                                maxWidth: 80,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    height: '100%',
                                                                    width: `${stPct}%`,
                                                                    background:
                                                                        sprint.color,
                                                                    borderRadius: 99,
                                                                    transition:
                                                                        'width 0.4s',
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            style={{
                                                                fontSize: 10,
                                                                color: '#64748B',
                                                            }}
                                                        >
                                                            {stDone}/
                                                            {st.tasks.length}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 10,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            color: sprint.color,
                                                            background: `${sprint.color}15`,
                                                            padding: '3px 9px',
                                                            borderRadius: 99,
                                                        }}
                                                    >
                                                        {st.points} pts
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: 16,
                                                            color: '#475569',
                                                            transform: isOpen
                                                                ? 'rotate(90deg)'
                                                                : 'none',
                                                            transition:
                                                                'transform 0.2s',
                                                        }}
                                                    >
                                                        ›
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tasks list */}
                                            {isOpen && (
                                                <div
                                                    style={{
                                                        borderTop:
                                                            '1px solid #2D2D3A',
                                                        padding: '12px 18px',
                                                        display: 'grid',
                                                        gap: 8,
                                                    }}
                                                >
                                                    {st.tasks.map((task, i) => {
                                                        const key = `${st.id}-${i}`;
                                                        const isDone =
                                                            !!done[key];
                                                        return (
                                                            <div
                                                                key={i}
                                                                onClick={() =>
                                                                    toggleTask(
                                                                        key,
                                                                    )
                                                                }
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    gap: 10,
                                                                    alignItems:
                                                                        'flex-start',
                                                                    cursor: 'pointer',
                                                                    padding:
                                                                        '6px 8px',
                                                                    borderRadius: 7,
                                                                    background:
                                                                        isDone
                                                                            ? `${sprint.color}08`
                                                                            : 'transparent',
                                                                    transition:
                                                                        'background 0.15s',
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: 18,
                                                                        height: 18,
                                                                        borderRadius: 4,
                                                                        border: `2px solid ${isDone ? sprint.color : '#3D3D4D'}`,
                                                                        background:
                                                                            isDone
                                                                                ? sprint.color
                                                                                : 'transparent',
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        justifyContent:
                                                                            'center',
                                                                        flexShrink: 0,
                                                                        marginTop: 1,
                                                                        transition:
                                                                            'all 0.2s',
                                                                    }}
                                                                >
                                                                    {isDone && (
                                                                        <span
                                                                            style={{
                                                                                fontSize: 11,
                                                                                color: '#fff',
                                                                            }}
                                                                        >
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span
                                                                    style={{
                                                                        fontSize: 12.5,
                                                                        lineHeight: 1.5,
                                                                        color: isDone
                                                                            ? '#475569'
                                                                            : '#CBD5E1',
                                                                        textDecoration:
                                                                            isDone
                                                                                ? 'line-through'
                                                                                : 'none',
                                                                        transition:
                                                                            'all 0.2s',
                                                                    }}
                                                                >
                                                                    {task}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Right legend panel */}
                <div
                    style={{
                        width: 220,
                        background: '#13131A',
                        borderLeft: '1px solid #2D2D3A',
                        padding: '20px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: 10,
                            }}
                        >
                            All Sprints
                        </div>
                        {sprints.map((s) => {
                            const pts = s.stories.reduce(
                                (a, st) => a + st.points,
                                0,
                            );
                            return (
                                <div
                                    key={s.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span style={{ fontSize: 14 }}>
                                        {s.icon}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: '#94A3B8',
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            S{s.id} · {s.subtitle.split(' ')[0]}
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: s.color,
                                        }}
                                    >
                                        {pts}pt
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        style={{
                            borderTop: '1px solid #2D2D3A',
                            paddingTop: 16,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: 10,
                            }}
                        >
                            Priority
                        </div>
                        {Object.entries(priorityConfig).map(([k, v]) => (
                            <div
                                key={k}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 7,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 99,
                                        background: v.color,
                                    }}
                                />
                                <span
                                    style={{ fontSize: 12, color: '#94A3B8' }}
                                >
                                    {v.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            borderTop: '1px solid #2D2D3A',
                            paddingTop: 16,
                            marginTop: 'auto',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: 10,
                            }}
                        >
                            Stack
                        </div>
                        {[
                            ['⚙️', 'Laravel 11 + Sanctum'],
                            ['⚛️', 'React + Inertia'],
                            ['🐘', 'PostgreSQL + pgvector'],
                            ['📦', 'Redis + Queues'],
                            ['📱', 'Evolution API'],
                            ['🤖', 'n8n Workflows'],
                            ['🔌', 'Laravel Reverb'],
                            ['🐳', 'Docker'],
                        ].map(([i, l]) => (
                            <div
                                key={l}
                                style={{
                                    display: 'flex',
                                    gap: 8,
                                    marginBottom: 6,
                                    alignItems: 'center',
                                }}
                            >
                                <span style={{ fontSize: 12 }}>{i}</span>
                                <span
                                    style={{ fontSize: 11, color: '#64748B' }}
                                >
                                    {l}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
