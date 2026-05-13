import { Link } from '@inertiajs/react';
import { Users, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { show as teamsShow } from '@/routes/teams';
import type { Workspace } from '@/types';

interface WorkspaceCardProps {
    workspace: Workspace;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
    const initials = getInitials(workspace.name);
    const memberCount = workspace.members_count ?? 0;
    const userRole = workspace.user_role;

    const roleColors: Record<string, string> = {
        owner: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
        admin: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        member: 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
        viewer: 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
    };

    const roleColorClass = userRole?.code
        ? roleColors[userRole.code] || roleColors.member
        : '';

    return (
        <Link href={teamsShow({ slug: workspace.slug })} className="block">
            <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold">
                                {workspace.name}
                            </h3>
                            {workspace.description && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {workspace.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                    >
                        <Settings className="size-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="size-4" />
                            <span>{memberCount} members</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {userRole && (
                            <Badge
                                variant="secondary"
                                className={roleColorClass}
                            >
                                {userRole.name}
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {new Date(
                                workspace.created_at,
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
