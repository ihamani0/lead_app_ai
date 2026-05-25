import { Link } from '@inertiajs/react';
import { ArrowRight, MoreVertical, Settings, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import type { Workspace } from '@/types';
import { WorkspaceDeleteDialog } from './WorkspaceDeleteDialog';
import { WorkspaceSettingsDialog } from './WorkspaceSettingsDialog';

interface WorkspaceCardProps {
    workspace: Workspace;
    stats?: {
        leads_count: number;
        qualified_count: number;
        qualification_rate: number;
        team_count: number;
    };
    statsLoading?: boolean;
}

const avatarColors = [
    'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400',
    'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
];

function getAvatarColor(name: string): string {
    const index =
        name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        avatarColors.length;
    return avatarColors[index];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatTimeAgo(date: string): string {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
        return `${diffMins} min`;
    }
    if (diffHours < 24) {
        return `${diffHours}h`;
    }
    return `${diffDays}j`;
}

export function WorkspaceCard({
    workspace,
    stats,
    statsLoading,
}: WorkspaceCardProps) {
    const { t } = useTranslation();
    const initials = getInitials(workspace.name);
    const avatarColor = getAvatarColor(workspace.name);
    const timeAgo = formatTimeAgo(workspace.updated_at);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const isLoading = statsLoading && !stats;

    return (
        <>
            <div className="group relative flex flex-col rounded-xl border bg-card transition-all hover:border-primary/50 hover:shadow-md">
                <div className="flex items-start justify-between p-5 pb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-11">
                            <AvatarFallback
                                className={cn(
                                    'text-sm font-bold',
                                    avatarColor,
                                )}
                            >
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-foreground">
                                {workspace.name}
                            </h3>
                            {workspace.description && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {workspace.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => setSettingsOpen(true)}
                            >
                                <Settings className="mr-2 size-4" />
                                {t('workspace.settings')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeleteOpen(true)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 size-4" />
                                {t('workspace.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Link
                    href={`/workspaces/${workspace.slug}/dashboard`}
                    className="flex-1 px-5 pb-4"
                >
                    <div className="grid grid-cols-4 gap-3 py-3">
                        {isLoading ? (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                                        <div className="h-5 w-8 animate-pulse rounded bg-muted" />
                                    </div>
                                ))}
                            </>
                        ) : stats ? (
                            <>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.leads')}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {stats.leads_count}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.qualified')}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {stats.qualified_count}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.rate')}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {stats.qualification_rate}%
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.team')}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {stats.team_count}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.leads')}
                                    </p>
                                    <p className="text-sm font-semibold">0</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.qualified')}
                                    </p>
                                    <p className="text-sm font-semibold">0</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.rate')}
                                    </p>
                                    <p className="text-sm font-semibold">0%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {t('workspace.stats.team')}
                                    </p>
                                    <p className="text-sm font-semibold">0</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="size-3.5" />
                            <span>{timeAgo}</span>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                </Link>
            </div>

            <WorkspaceSettingsDialog
                workspace={workspace}
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
            />
            <WorkspaceDeleteDialog
                workspace={workspace}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
