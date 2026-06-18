import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Phone } from 'lucide-react';
import { useState } from 'react';
import { CreateInstanceDialog } from '@/components/Instances/CreateInstanceDialog';
import { DeletedInstanceCard } from '@/components/Instances/DeletedInstanceCard';
import InstanceCard from '@/components/Instances/InstanceCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import teams from '@/routes/teams';
import workspaces from '@/routes/workspaces';
import type { EvolutionInstance, BreadcrumbItem } from '@/types';

interface DeletedInstance {
    id: string;
    instance_name: string;
    display_name: string | null;
    phone_number: string | null;
    deleted_at: string | null;
    settings: Record<string, unknown> | null;
    created_at: string;
}

export default function InstanceIndex({
    instances,
    deletedInstances = [],
    canCreate,
    canManage,
}: {
    instances: EvolutionInstance[];
    deletedInstances?: DeletedInstance[];
    canCreate: boolean;
    canManage: boolean;
}) {
    const activeWorkspace = useActiveWorkspace();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: teams.index().url },
        {
            title: 'Dashboard',
            href: activeWorkspace
                ? workspaces.dashboard({ slug: activeWorkspace.slug }).url
                : '#',
        },
        { title: 'Profile', href: '' },
    ];

    const [grid, setGrid] = useState<1 | 3>(3);

    const { t } = useTranslation();

    const activeCount = instances.length;
    const deletedCount = deletedInstances?.length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('profil.title')} />

            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="space-y-5">
                    {/* Header - Orange/Amber Gradient */}
                    <div
                        className="relative mb-6 overflow-hidden rounded-2xl"
                        data-tour="instances-header"
                    >
                        {/* Glow (smaller + cleaner) */}
                        <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-emerald-300/20 blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-green-300/20 blur-2xl" />

                        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* LEFT */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md">
                                        <Phone className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                    </div>

                                    <h1 className="text-lg font-semibold text-white sm:text-xl md:text-3xl">
                                        {t('profil.title')}
                                    </h1>
                                </div>

                                <p className="max-w-xs text-xs text-white/80 sm:max-w-md sm:text-sm md:text-base">
                                    {t('profil.description')}
                                </p>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center justify-between gap-2 sm:justify-end">
                                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white sm:px-3 sm:text-xs">
                                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span>
                                        {activeCount}{' '}
                                        {t('profil.instancesCount')}
                                    </span>
                                </div>
                                {canCreate && (
                                    <div data-tour="create-instance">
                                        <CreateInstanceDialog
                                            t={t}
                                            slug={activeWorkspace?.slug}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}

                    {/* Tabs */}
                    <Tabs defaultValue="active" className="mt-5 w-full">
                        <TabsList className="mb-6 grid w-full grid-cols-2">
                            <TabsTrigger value="active" className="gap-2">
                                {t('profil.tabActive')} ({activeCount})
                            </TabsTrigger>
                            <TabsTrigger value="deleted" className="gap-2">
                                {t('profil.tabDeleted')} ({deletedCount})
                            </TabsTrigger>
                        </TabsList>

                        {/* Active Tab */}
                        <TabsContent value="active" className="space-y-4">
                            <div className="mb-5 hidden w-full justify-end gap-2 md:flex">
                                <Button
                                    size="icon"
                                    variant={grid === 3 ? 'default' : 'outline'}
                                    onClick={() => setGrid(3)}
                                >
                                    <LayoutGrid className="h-1 w-1" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={grid === 1 ? 'default' : 'outline'}
                                    onClick={() => setGrid(1)}
                                >
                                    <List className="h-1 w-1" />
                                </Button>
                            </div>

                            {instances.length > 0 ? (
                                <div
                                    className={cn(
                                        'grid gap-6',
                                        grid === 3
                                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                            : 'grid-cols-1',
                                    )}
                                >
                                    {instances.map(
                                        (instance: EvolutionInstance) => (
                                            <motion.div
                                                key={instance.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1,
                                                }}
                                                data-tour="instance-card"
                                            >
                                                <InstanceCard
                                                    instance={instance}
                                                    slug={activeWorkspace?.slug}
                                                    canManage={canManage}
                                                />
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed bg-card py-32 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                        <Phone className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {t('profil.emptyTitle')}
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {t('profil.emptyDescription')}
                                    </p>
                                    {canCreate && (
                                        <div className="mt-8 flex justify-center">
                                            <CreateInstanceDialog
                                                t={t}
                                                slug={activeWorkspace?.slug}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        {/* Deleted Tab */}
                        <TabsContent value="deleted" className="space-y-4">
                            {deletedCount > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {deletedInstances?.map((instance) => (
                                        <DeletedInstanceCard
                                            key={instance.id}
                                            instance={instance}
                                            slug={activeWorkspace?.slug}
                                            canManage={canManage}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed bg-card py-32 text-center">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                        <Phone className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {t('profil.noDeleted')}
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {t('profil.noDeletedDesc')}
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}

// <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
//     <div className="rounded-xl border bg-card p-6">
//         <p className="text-sm font-medium text-muted-foreground uppercase">
//             {t('profil.totalNodes')}
//         </p>
//         <p className="mt-2 text-3xl font-bold text-foreground">
//             {activeCount}
//         </p>
//     </div>

//     <div className="rounded-xl border bg-card p-6">
//         <p className="text-sm font-medium text-muted-foreground uppercase">
//             {t('profil.active')}
//         </p>
//         <p className="mt-2 text-3xl font-bold text-primary">
//             {connectedCount}
//         </p>
//     </div>

//     <div className="rounded-xl border bg-card p-6">
//         <p className="text-sm font-medium text-muted-foreground uppercase">
//             {t('profil.healthRating')}
//         </p>
//         <p className="mt-2 text-3xl font-bold text-foreground">
//             {healthPercentage}%
//         </p>
//     </div>
// </div>
