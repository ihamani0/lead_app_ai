import type { Auth } from '@/types/auth';

declare global {
    type SharedPageProps = {
        name: string;
        auth: Auth;
        sidebarOpen: boolean;
        [key: string]: unknown;
    };

    type FalshProps = {
        flash: { success?: string; error?: string; [key: string]: unknown };
        [key: string]: unknown;
    };
    type PaginationLink = {
        url: string | null;
        label: string;
        active: boolean;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: SharedPageProps;
        FlashProps: FlashProps;
        PaginationLink: PaginationLink;
    }
}