import axios from 'axios';
import { messages as messagesRoute, send as sendRoute } from '@/routes/workspaces/leads';
import type { LeadMessage } from '@/types';

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export async function fetchMessages(
    slug: string,
    leadId: string | number,
    page = 1,
): Promise<PaginatedResponse<LeadMessage>> {
    const url = messagesRoute({ slug, lead: String(leadId) }).url;
    const { data } = await axios.get<PaginatedResponse<LeadMessage>>(url, {
        params: { page },
    });
    return data;
}

export async function sendMessage(
    slug: string,
    leadId: string | number,
    message: string,
): Promise<void> {
    const url = sendRoute({ slug, lead: String(leadId) }).url;
    await axios.post(url, { message });
}
