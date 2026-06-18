import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    Check,
    CheckCheck,
    ExternalLink,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';
import workspaces from '@/routes/workspaces';

const severityColor = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
};

function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export function NotificationBell() {
    const activeWorkspace = useActiveWorkspace();
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();
    const [open, setOpen] = useState(false);

    const [loadingReadId, setLoadingReadId] = useState<string | null>(null);

    const handleMarkRead = async (id: string) => {
        setLoadingReadId(id);
        await markAsRead(id);
        setLoadingReadId(null);
    };

    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted focus:outline-none"
                        data-test="notification-bell"
                    >
                        <Bell className="size-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-sidebar">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-80 rounded-lg p-0"
                    align="end"
                    side="bottom"
                >
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <span className="text-sm font-semibold">
                            Notifications
                        </span>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                                <Bell className="h-8 w-8 opacity-30" />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const isRead = n.read_at !== null;
                                const severity = n.data
                                    .severity as keyof typeof severityColor;
                                const isFromFlag =
                                    n.data.type === 'lead_flagged';

                                return (
                                    <div
                                        key={n.id}
                                        className={cn(
                                            'flex items-start gap-3 border-b px-4 py-3 transition-colors last:border-b-0',
                                            isRead
                                                ? 'opacity-60'
                                                : 'bg-purple-50/50 dark:bg-purple-950/10',
                                        )}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {isFromFlag && severity ? (
                                                <span
                                                    className={cn(
                                                        'flex h-2.5 w-2.5 rounded-full',
                                                        isRead && 'opacity-40',
                                                        severityColor[
                                                            severity
                                                        ] ?? 'bg-slate-400',
                                                    )}
                                                />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={cn(
                                                    'text-sm leading-tight',
                                                    isRead
                                                        ? 'text-muted-foreground'
                                                        : 'font-medium text-foreground',
                                                )}
                                            >
                                                {isFromFlag
                                                    ? `"${n.data.lead_name ?? 'Unknown'}" flagged`
                                                    : (n.data.message ??
                                                      'Notification')}
                                            </p>
                                            {isFromFlag && n.data.reason && (
                                                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                    {n.data.reason}
                                                </p>
                                            )}
                                            {isFromFlag && n.data.agent_name && (
                                                <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                                                    by {n.data.agent_name}
                                                </p>
                                            )}
                                            <p className="mt-1 text-[10px] text-muted-foreground/60">
                                                {relativeTime(n.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1">
                                            {isFromFlag &&
                                                activeWorkspace &&
                                                n.data.lead_id && (
                                                    <Link
                                                        href={workspaces.leads
                                                            .show({
                                                                slug: activeWorkspace.slug,
                                                                lead: n.data.lead_id,
                                                            })
                                                            .url}
                                                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                            {!isRead && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMarkRead(n.id)
                                                    }
                                                    disabled={
                                                        loadingReadId === n.id
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
                                                >
                                                    {loadingReadId === n.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Check className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
