import { Head } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { CreateInstanceDialog } from '@/components/Instances/CreateInstanceDialog';
import InstanceCard from '@/components/Instances/InstanceCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { EvolutionInstance, BreadcrumbItem } from '@/types';

export default function InstanceIndex({
    instances,
}: {
    instances: EvolutionInstance[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: dashboard().url },
        { title: 'Profile', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="WhatsApp Clusters" />

            <div className="min-h-screen py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl dark:bg-slate-900">
                                <Phone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                                    WhatsApp Clusters
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Manage your connected numbers and automation
                                    fleets.
                                </p>
                            </div>
                        </div>
                        <CreateInstanceDialog />
                    </div>

                    {/* Stats or Quick Info (Optional but adds premium feel) */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                                Total Nodes
                            </p>
                            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                                {instances.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                                Active
                            </p>
                            <p className="mt-2 text-3xl font-black text-emerald-500">
                                {
                                    instances.filter(
                                        (i) => i.status === 'connected',
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                                Health Rating
                            </p>
                            <p className="mt-2 text-3xl font-black text-indigo-500 dark:text-white">
                                {instances.length > 0
                                    ? (
                                          (instances.filter(
                                              (i) => i.status === 'connected',
                                          ).length /
                                              instances.length) *
                                          100
                                      ).toFixed(0)
                                    : 0}
                                %
                            </p>
                        </div>
                    </div>

                    {/* Instance Grid */}
                    {instances.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {instances.map((instance: EvolutionInstance) => (
                                <InstanceCard
                                    instance={instance}
                                    key={instance.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white/50 py-32 text-center dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Phone className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                                    No Clusters Found
                                </h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">
                                    Start by creating your first WhatsApp
                                    instance to begin automating.
                                </p>
                                <div className="mt-8 flex justify-center">
                                    <CreateInstanceDialog />
                                </div>
                            </div>
                            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
