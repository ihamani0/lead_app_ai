// Type definitions for Reports feature

export interface SummaryData {
    total: number;
    last7days?: number;
    last30days?: number;
    avgPerDay?: number;
    connected?: number;
    disconnected?: number;
    active?: number;
    inactive?: number;
}

export interface LeadsSummary extends SummaryData {
    last7days: number;
    last30days: number;
    avgPerDay: number;
}

export interface InstancesSummary extends SummaryData {
    connected: number;
    disconnected: number;
}

export interface AgentsSummary extends SummaryData {
    active: number;
    inactive: number;
}

export interface LeadTimeData {
    date: string;
    count: number;
}

export interface LeadsReportData {
    reportType?: string;
    summary: LeadsSummary;
    byAiQualification: Record<string, number>;
    byQualificationResult: Record<string, number>;
    byTreatmentStatus: Record<string, number>;
    byInstance: Record<string, number>;
    leadsOverTime: LeadTimeData[];
}

export interface InstanceData {
    id: string;
    name: string;
    phone: string;
    status: string;
    connected_at: string | null;
}

export interface InstancesReportData {
    summary: InstancesSummary;
    byStatus: Record<string, number>;
    leadsByInstance: Record<string, number>;
    instances: InstanceData[];
}

export interface AgentData {
    id: string;
    name: string;
    instance: string | null;
    instance_name?: string;
    display_name?: string | null;
    is_active: boolean;
    created_at: string;
    total_tokens: number;
    total_cost: number;
    transaction_count: number;
}

export interface AgentsReportData {
    summary: AgentsSummary;
    byStatus: Record<string, number>;
    agents: AgentData[];
}

export type ReportTab = 'leads' | 'instances' | 'agents' | 'tokens';

export interface TokenDayData {
    date: string;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    input_cost: number;
    output_cost: number;
    total_cost: number;
    transaction_count: number;
}

export interface TokenMonthData {
    month: string;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    input_cost: number;
    output_cost: number;
    total_cost: number;
    transaction_count: number;
}

export interface TokenTransactionsReportData {
    summary: {
        total_tokens: number;
        total_cost: number;
        input_tokens: number;
        output_tokens: number;
        transaction_count: number;
    };
    daily: TokenDayData[];
    monthly: TokenMonthData[];
    byAgent: TokenAgentData[];
}

export interface TokenAgentData {
    agent_name: string;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    total_cost: number;
    transaction_count: number;
}

export interface ReportApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}
