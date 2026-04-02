import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Phone, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { CreateInstanceDialog } from '@/components/Instances/CreateInstanceDialog';
import { DeletedInstanceCard } from '@/components/Instances/DeletedInstanceCard';
import InstanceCard from '@/components/Instances/InstanceCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
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
}: {
    instances: EvolutionInstance[];
    deletedInstances?: DeletedInstance[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: dashboard().url },
        { title: 'Profile', href: '' },
    ];

    const [grid, setGrid] = useState<1 | 3>(3);

    const { t } = useTranslation();

    const activeCount = instances.length;
    const deletedCount = deletedInstances?.length || 0;

    // const connectedCount = instances.filter(
    //     (i) => i.status === 'connected',
    // ).length;
    // const healthPercentage =
    //     activeCount > 0 ? Math.round((connectedCount / activeCount) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('profil.title')} />

            <div className="min-h-screen py-12">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Header - Orange/Amber Gradient */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-amber-500 via-orange-600 to-red-600 p-8 shadow-2xl ring-1 ring-amber-400/30 md:p-12 dark:from-amber-900 dark:via-orange-900 dark:to-red-900 dark:ring-amber-700/50">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
                        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-md">
                                        <Smartphone className="h-8 w-8 text-white" />
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl">
                                        {t('profil.title')}
                                    </h1>
                                </div>
                                <p className="max-w-xl text-lg font-light text-white/90">
                                    {t('profil.description')}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
                                    <Phone className="h-4 w-4" />
                                    <span>
                                        {activeCount}{' '}
                                        {t('profil.instancesCount')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-4 flex w-full justify-end">
                        <CreateInstanceDialog t={t} />
                    </div>

                    {/* Stats */}


                    {/* Tabs */}
                    <Tabs defaultValue="active" className="w-full">
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
                            <div className="mb-5 flex w-full justify-end gap-2">
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
                                            >
                                                <InstanceCard
                                                    instance={instance}
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
                                    <div className="mt-8 flex justify-center">
                                        <CreateInstanceDialog t={t} />
                                    </div>
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