import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';

interface NotificationData {
    type: string;
    lead_id?: string;
    lead_name?: string;
    lead_phone?: string;
    reason?: string;
    severity?: string;
    agent_name?: string;
    message?: string;
}

interface DatabaseNotification {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface LeadFlaggedEvent {
    lead_id: string;
    lead_name: string;
    lead_phone: string;
    reason: string;
    severity: string;
    agent_name: string | null;
    team_id: string;
    flagged_at: string;
}

interface NotificationsState {
    data: DatabaseNotification[];
    unread_count: number;
}

export function useNotifications() {
    const page = usePage<{ notifications?: NotificationsState }>();
    const activeWorkspace = useActiveWorkspace();

    const [notifications, setNotifications] = useState<DatabaseNotification[]>(
        page.props.notifications?.data ?? [],
    );
    const [unreadCount, setUnreadCount] = useState(
        page.props.notifications?.unread_count ?? 0,
    );

    useEffect(() => {
        setNotifications(page.props.notifications?.data ?? []);
        setUnreadCount(page.props.notifications?.unread_count ?? 0);
    }, [page.props.notifications]);

    const addNotification = useCallback((event: LeadFlaggedEvent) => {
        const newNotification: DatabaseNotification = {
            id: `broadcast-${Date.now()}`,
            type: 'App\\Notifications\\LeadFlaggedNotification',
            data: {
                type: 'lead_flagged',
                lead_id: event.lead_id,
                lead_name: event.lead_name,
                lead_phone: event.lead_phone,
                reason: event.reason,
                severity: event.severity,
                agent_name: event.agent_name ?? undefined,
                message: `Lead ${event.lead_name} (${event.lead_phone}) flagged: ${event.reason}`,
            },
            read_at: null,
            created_at: event.flagged_at,
            updated_at: event.flagged_at,
        };

        setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
        setUnreadCount((prev) => prev + 1);

        toast(`Lead "${event.lead_name}" flagged`, {
            description: event.agent_name
                ? `${event.reason} — by ${event.agent_name}`
                : event.reason,
            duration: 8000,
        });
    }, []);

    const channel = activeWorkspace
        ? `notifications.team.${activeWorkspace.id}`
        : '';

    useEcho(channel, ['LeadFlagged'], addNotification);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await axios.post(`/api/notifications/${id}/read`);
        } catch {
            // silent
        }

        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
            ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await axios.post('/api/notifications/read-all');
        } catch {
            // silent
        }

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
        );
        setUnreadCount(0);
    }, []);

    return { notifications, unreadCount, markAsRead, markAllAsRead };
}
