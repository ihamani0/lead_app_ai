export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type InstanceStatus = 'connecting' | 'connected' | 'disconnected';

export interface EvolutionInstance {
    id: string; // ULID
    tenant_id: string;

    instance_name: string; // e.g., "tenant-slug-name-xyz"
    phone_number: string | null; // e.g., "551199999999"

    status: InstanceStatus;

    qr_code: string | null; // Base64 string if stored, otherwise null
    webhook_url: string | null;

    settings: Record<string, unknown> | null; // JSONB column

    agent_config: AgentConfig | null;
    connected_at: string | null; // ISO Date String
    created_at: string; // ISO Date String
    updated_at: string; // ISO Date String
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
    [key: string]: unknown; // Allow future evolution-specific fields
}

export interface AgentConfig {
    id: string; // ULID primary key (if using Laravel default)
    evolution_instance_id: string; // FK to EvolutionInstance
    instance_name: string; // Unique name for the instance

    // Connection Settings
    is_active: boolean; // Bot on/off
    webhook_url?: string | null; // URL for Evolution messages

    config_webhook_url:string | null;

    // Provider Settings
    provider: EvolutionProvider; // Provider type
    provider_id?: string | null; // Workflow/ID for the provider

    // Evolution API integration
    evo_integration_id?: string | null; // ID returned by API

    // AI Brain
    system_prompt?: string | null; // Optional AI system prompt

    // Evolution-specific settings
    settings?: EvolutionSettings | null;

    instance?:EvolutionInstance | null

    // Timestamps (if you want to include Laravel timestamps)
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
    created_at:string;
    ai_summary:string;
    custom_data:string;
    instance ?:EvolutionInstance
}