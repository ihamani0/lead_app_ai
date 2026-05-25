import { usePage } from '@inertiajs/react';

export type ActiveWorkspace = {
    id: string;
    name: string;
    slug: string;
};

export function useActiveWorkspace(): ActiveWorkspace | null {
    const page = usePage<{
        activeWorkspace?: ActiveWorkspace | null;
    }>();

    return page.props.activeWorkspace ?? null;
}
