export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type InstanceStatus = 'connecting' | 'connected' | 'disconnected';

export interface EvolutionInstance {
    id: string;
    tenant_id: string;

    instance_name: string;
    display_name: string | null;
    phone_number: string | null;

    status: InstanceStatus;

    qr_code: string | null;
    webhook_url: string | null;

    settings: Record<string, unknown> | null;

    deleted_at: string | null;

    agent_config: AgentConfig | null;
    connected_at: string | null;
    created_at: string;
    updated_at: string;
}

// Optional: If you pass paginated data from Laravel
export interface PaginatedInstances {
    data: EvolutionInstance[];
    links: unknown[];
    meta: unknown;
}

export type EvolutionProvider = 'n8n' | 'typebot' | 'dify';

export interface EvolutionSettings {
    delayMessage?: number; // Delay before sending a new message (ms)
    keywordFinish?: string; // Keyword to finish the conversation
    unknownMessage?: string; // Message when the bot doesn't recognize input
    listeningFromMe?: boolean; // Should bot listen to messages sent by self
    stopBotFromMe?: boolean; // Stop bot when it receives self messages
    keepOpen?: boolean; // Keep the conversation open after response
    debounceTime?: number; // Debounce time in ms
    ignoreJids?: string[]; // JIDs to ignore
    blocklist?: string[]; // Blocked JIDs
    [key: string]: unknown; // Allow future evolution-specific fields
}

export interface AgentConfig {
    id: string;
    name: string;
    evolution_instance_id: string | null;
    instance_name: string | null;

    is_active: boolean;
    webhook_url?: string | null;

    config_webhook_url: string | null;

    provider: EvolutionProvider;
    provider_id?: string | null;

    evo_integration_id?: string | null;

    system_prompt?: string | null;
    default_system_prompt?: string | null;

    settings?: EvolutionSettings | null;

    instance?: EvolutionInstance | null;

    knowledge_bases_count?: number;

    created_at?: string;
    updated_at?: string;
}

export interface Asset {
    id: string;
    category: string;
    type: 'image' | 'video' | 'document' | string;
    external_url: string;
    caption: string;
    url: string;
    created_at?: string;
    updated_at?: string;
    name?: string;
    size?: string;
}

export interface MediaFormData {
    category: string;
    type: string;
    upload_method: string;
    file: File | null;
    external_url: string;
    caption: string;
}

export interface PresignResponse {
    url: string;
    headers: Record<string, string>;
    key: string;
}

export type LeadStatus =
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'unqualified'
    | 'converted';

export type LeadTemperature = 'cold' | 'warm' | 'hot';

export interface Lead {
    id: string | number;
    name: string;
    phone: string;
    status: LeadStatus;
    temperature: LeadTemperature;
    qualification_score: number | null;
    updated_at: string;
    created_at: string;
    ai_summary: string;
    custom_data: string;
    instance?: EvolutionInstance;
}
