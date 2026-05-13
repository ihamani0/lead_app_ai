import { Head } from '@inertiajs/react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { Workspace } from '@/types';
import { WorkspaceCard } from './Partials/WorkspaceCard';
import { WorkspaceCreateDialog } from './Partials/WorkspaceCreateDialog';

interface WorkspaceIndexProps {
    workspaces: Workspace[];
    canCreate: boolean;
}

export default function WorkspaceIndex({
    workspaces,
    canCreate,
}: WorkspaceIndexProps) {
    const { t } = useTranslation();

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: t('workspace.title'),
                    href: '#',
                },
            ]}
        >
            <Head title={t('workspace.title')} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">
                            {t('workspace.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground md:text-base">
                            {t('workspace.description')}
                        </p>
                    </div>

                    {canCreate && (
                        <WorkspaceCreateDialog>
                            <Button className="w-full gap-2 sm:w-auto">
                                <Plus className="size-4" />
                                {t('workspace.create')}
                            </Button>
                        </WorkspaceCreateDialog>
                    )}
                </div>

                <Separator className="my-4" />

                {/* Workspace Grid */}
                {workspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <Users className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                {t('workspace.empty.title')}
                            </h3>
                            <p className="max-w-sm text-sm text-muted-foreground">
                                {t('workspace.empty.description')}
                            </p>
                        </div>
                        {canCreate && (
                            <WorkspaceCreateDialog>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="size-4" />
                                    {t('workspace.create')}
                                </Button>
                            </WorkspaceCreateDialog>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {workspaces.map((workspace) => (
                            <WorkspaceCard
                                key={workspace.id}
                                workspace={workspace}
                            />
                        ))}

                        {canCreate && (
                            <WorkspaceCreateDialog>
                                <div className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/20 p-4 transition-colors hover:border-primary/50">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                        <Plus className="size-6 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {t('workspace.create')}
                                    </span>
                                </div>
                            </WorkspaceCreateDialog>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
