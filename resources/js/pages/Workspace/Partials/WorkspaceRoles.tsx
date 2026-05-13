import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { Workspace, WorkspaceRole } from '@/types';

interface WorkspaceRolesProps {
    workspace: Workspace;
    roles: WorkspaceRole[];
}

export function WorkspaceRoles({ roles }: WorkspaceRolesProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        {t('workspace.roles.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t('workspace.roles.description')}
                    </p>
                </div>

                <Button className="gap-2">
                    <Plus className="size-4" />
                    {t('workspace.roles.create')}
                </Button>
            </div>

            {/* Roles Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {roles.map((role) => (
                    <Card key={role.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <Shield className="size-5 text-primary" />
                                <CardTitle className="text-base">
                                    {role.name}
                                </CardTitle>
                                {role.is_default && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {t('workspace.roles.default')}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                >
                                    <Edit2 className="size-4" />
                                </Button>
                                {!role.is_default && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {role.description && (
                                <CardDescription className="mb-3">
                                    {role.description}
                                </CardDescription>
                            )}
                            <div className="flex flex-wrap gap-1">
                                {role.permissions.map((permission) => (
                                    <Badge key={permission.code} variant="outline">{permission.code}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {roles.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
                    <Shield className="mb-3 size-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        {t('workspace.roles.empty')}
                    </p>
                </div>
            )}
        </div>
    );
}
