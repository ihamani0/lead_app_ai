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
    totalSize?: number;
    avgSize?: number;
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

export interface MediaSummary extends SummaryData {
    totalSize: number;
    avgSize: number;
}

export interface LeadsReportData {
    reportType?: string;
    summary: LeadsSummary;
    byStatus: Record<string, number>;
    byTemperature: Record<string, number>;
    bySource: Record<string, number>;
    byInstance: Record<string, number>;
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
    is_active: boolean;
    created_at: string;
}

export interface AgentsReportData {
    summary: AgentsSummary;
    byStatus: Record<string, number>;
    agents: AgentData[];
}

export interface MediaReportData {
    summary: MediaSummary;
    byType: Record<string, number>;
    recentMedia?: Array<{
        id: number;
        filename: string;
        mime_type: string;
        created_at: string;
    }>;
}

export type ReportTab = 'leads' | 'instances' | 'agents' | 'media';

export interface ReportApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}
