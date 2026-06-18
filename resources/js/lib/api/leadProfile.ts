import axios from 'axios';
import type { Lead } from '@/types';

export interface ContactProfile {
    name: string;
    phone: string;
    about: string | null;
    picture: string | null;
    isBusiness: boolean;
    verified: string | null;
    lid: string | null;
}

export async function fetchContactProfile(
    slug: string,
    leadId: string | number,
): Promise<ContactProfile | null> {
    try {
        const { data } = await axios.get<{
            profile: ContactProfile | null;
            error?: string;
        }>(`/workspaces/${slug}/leads/${leadId}/profile`);
        return data.profile;
    } catch {
        return null;
    }
}

export async function blockContact(
    slug: string,
    leadId: string | number,
): Promise<boolean> {
    try {
        await axios.post(`/workspaces/${slug}/leads/${leadId}/block`);
        return true;
    } catch {
        return false;
    }
}
