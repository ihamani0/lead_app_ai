import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bot, Building2, CreditCard, Smartphone, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { useTranslation } from '@/hooks/use-translation';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { stats as workspacesStats } from '@/routes/workspaces';
import type { Workspace } from '@/types';
import { WorkspaceCard } from './Partials/WorkspaceCard';
import { WorkspaceCreateDialog } from './Partials/WorkspaceCreateDialog';


interface WorkspaceIndexProps {
    workspaces: Workspace[];
    canCreate: boolean;
    stats: {
        total_workspaces: number;
        total_leads: number;
        hot_leads: number;
        connected_instances: number;
        active_agents: number;
    };
}

interface WorkspaceStats {
    workspace_id: string;
    leads_count: number;
    qualified_count: number;
    qualification_rate: number;
    team_count: number;
}

export default function WorkspaceIndex({
    workspaces,
    canCreate,
    stats,
}: WorkspaceIndexProps) {

    const { t } = useTranslation();

    const { props } = usePage<SharedPageProps>();
    const userName = props.auth?.user?.name ?? '';
    const auth = props.auth;

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return t('workspace.morning');
        if (hour < 18) return t('workspace.afternoon');
        return t('workspace.evening');
    }, [t]);

    const [workspaceStats, setWorkspaceStats] = useState<
        Record<string, WorkspaceStats>
    >({});
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(workspacesStats().url)
            .then((response) => {
                const statsMap: Record<string, WorkspaceStats> = {};
                (response.data as { data: WorkspaceStats[] }).data.forEach(
                    (stat: WorkspaceStats) => {
                        statsMap[stat.workspace_id] = stat;
                    },
                );
                setWorkspaceStats(statsMap);
                setStatsLoading(false);
            })
            .catch(() => {
                setStatsLoading(false);
            });
    }, []);

    return (
        <WorkspaceLayout title="Workspaces">
            <Head title="Workspaces" />

            <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
                {/* Greeting Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        {greeting}, {userName}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('workspace.subtitle')}
                    </p>
                </div>

                {/* Stats Row - 3x2 Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <SummaryCard
                        title={t('workspace.stats.credit')}
                        value={`$${(auth.user.tenant.credit / 1000).toFixed(2)}`}
                        icon={CreditCard}
                        color="emerald"
                    />
                    <SummaryCard
                        title={t('workspace.stats.total_workspaces')}
                        value={stats.total_workspaces}
                        icon={Building2}
                        color="purple"
                    />
                    <SummaryCard
                        title={t('workspace.stats.total_leads')}
                        value={stats.total_leads.toLocaleString()}
                        icon={Users}
                        color="blue"
                    />

                    {/* <SummaryCard
                        title={t('workspace.stats.hot_leads')}
                        value={stats.hot_leads.toLocaleString()}
                        icon={Flame}
                        color="orange"
                    /> */}
                    <SummaryCard
                        title={t('workspace.stats.active_agents')}
                        value={stats.active_agents}
                        icon={Bot}
                        color="purple"
                    />
                    <SummaryCard
                        title={t('workspace.stats.connected_instances')}
                        value={stats.connected_instances}
                        icon={Smartphone}
                        color="blue"
                    />
                </div>

                {/* Workspaces Grid */}
                {workspaces.length === 0 ? (
                    <EmptyState canCreate={canCreate} />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {workspaces.length}{' '}
                                {workspaces.length === 1
                                    ? t('workspace.singular')
                                    : t('workspace.plural')}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {workspaces.map((workspace) => (
                                <WorkspaceCard
                                    key={workspace.id}
                                    workspace={workspace}
                                    stats={workspaceStats[workspace.id]}
                                    statsLoading={statsLoading}
                                />
                            ))}

                            {canCreate && (
                                <WorkspaceCreateDialog>
                                    <div className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 transition-colors hover:border-primary/50 hover:bg-muted/30">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                            <span className="text-2xl font-light text-muted-foreground">
                                                +
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {t('workspace.create_new')}
                                        </span>
                                    </div>
                                </WorkspaceCreateDialog>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </WorkspaceLayout>
    );
}

function EmptyState({ canCreate }: { canCreate: boolean }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Building2 className="size-8 text-muted-foreground" />
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
                        <span className="text-lg">+</span>
                        {t('workspace.create')}
                    </Button>
                </WorkspaceCreateDialog>
            )}
        </div>
    );
}
