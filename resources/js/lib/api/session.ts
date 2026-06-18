import axios from 'axios';
import { session } from '@/routes/workspaces/leads';
import type { BotSession } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sr = session as any;

export async function fetchLeadSession(
    slug: string,
    leadId: string | number,
): Promise<BotSession | null> {
    const url = sr({ slug, lead: String(leadId) }).url;
    const { data } = await axios.get<{ session: BotSession | null }>(url);
    return data.session;
}

export async function changeSessionStatus(
    slug: string,
    leadId: string | number,
    status: 'opened' | 'paused' | 'closed',
): Promise<void> {
    const url = sr.status({ slug: String(slug), lead: String(leadId) }).url;
    await axios.post(url, { status });
}
