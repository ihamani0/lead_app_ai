import { Users, Calendar, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { Workspace } from '@/types';

interface WorkspaceOverviewProps {
    workspace: Workspace;
}

export function WorkspaceOverview({ workspace }: WorkspaceOverviewProps) {
    const { t } = useTranslation();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Team Info */}
            <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>{t('workspace.overview.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Avatar className="size-16">
                            <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                                {workspace.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">
                                {workspace.name}
                            </h3>
                            {workspace.description && (
                                <p className="text-sm text-muted-foreground">
                                    {workspace.description}
                                </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    {t('workspace.overview.created', {
                                        date: new Date(
                                            workspace.created_at,
                                        ).toLocaleDateString(),
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {t('workspace.overview.members')}
                    </CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {workspace.members_count ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {t('workspace.overview.active_members')}
                    </p>
                </CardContent>
            </Card>

            {/* Role */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {t('workspace.overview.your_role')}
                    </CardTitle>
                    <Shield className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {workspace.user_role ? (
                        <Badge variant="secondary">
                            {workspace.user_role.name}
                        </Badge>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            {t('workspace.overview.no_role')}
                        </span>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
