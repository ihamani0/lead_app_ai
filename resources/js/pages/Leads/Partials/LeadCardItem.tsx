import { Link } from '@inertiajs/react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { getHeatBadge } from '@/lib/leadHelper';
import { cn } from '@/lib/utils';
import { show } from '@/routes/workspaces/leads';
import type { Lead } from '@/types';
import { AvatarInitials } from './AvatarInitials';

interface LeadCardItemProps {
    lead: Lead;
    isSelected?: boolean;
    onSelect?: () => void;
}

export const LeadCardItem: FC<LeadCardItemProps> = ({
    lead,
    isSelected = false,
}) => {
    const activeWorkspace = useActiveWorkspace();

    const lastMessage =
        lead.recent_messages && lead.recent_messages.length > 0
            ? lead.recent_messages[lead.recent_messages.length - 1].message
            : null;

    const lastTime =
        lead.recent_messages && lead.recent_messages.length > 0
            ? lead.recent_messages[lead.recent_messages.length - 1].timestamp
            : lead.last_activity_at || lead.updated_at;

    const getTimeLabel = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) {
            return date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }
        if (days === 1) return 'Hier';
        if (days < 7) return `J-${days}`;
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
        });
    };

    const unreadCount = lead.is_new
        ? (lead.recent_messages?.filter((m) => m.direction === 'client')
              .length ?? 0)
        : 0;

    const isHot = lead.qualification_result === 'HOT';

    return (
        <Link
            href={show({ slug: activeWorkspace!.slug, lead: lead.id }).url}
            className={cn(
                'flex cursor-pointer items-start gap-3 border-b px-4 py-3 transition-colors hover:bg-accent/50',
                isSelected && 'border-l-[3px] border-l-purple-500 bg-[#F5F3FF]',
            )}
        >
            <div className="relative shrink-0">
                <AvatarInitials name={lead.name} id={lead.id} size="sm" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium text-foreground">
                        {lead.name}
                        {isHot && <span className="ml-1">🔥</span>}
                    </span>
                    {lastTime && (
                        <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
                            {getTimeLabel(lastTime)}
                        </span>
                    )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                    {lastMessage || lead.phone}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {lead.qualification_result &&
                        getHeatBadge(lead.qualification_result)}
                    {lead.is_new && (
                        <Badge
                            variant="secondary"
                            className="border-0 bg-blue-100 text-[11px] font-medium text-blue-800"
                        >
                            Nouveau
                        </Badge>
                    )}
                </div>
            </div>
        </Link>
    );
};
