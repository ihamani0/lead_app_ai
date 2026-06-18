import { Head } from '@inertiajs/react';
import { Activity, Bot, HardDrive, Users } from 'lucide-react';
import { DashboardWelcomeOverlay } from '@/components/dashboard/DashboardWelcomeOverlay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { formatBytes } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { LeadConversionFunnel } from './dashboard/lead-conversion-funnel';
import {
    RecentLeadsList,
    type RecentLead,
} from './dashboard/recent-leads-list';
import { TeamMembersCard } from './dashboard/team-members-card';
import { WhatsAppKpiCard } from './dashboard/whatsapp-kpi-card';
import { WorkspaceAboutCard } from './dashboard/workspace-about-card';
import { WorkspaceHeader } from './dashboard/workspace-header';

interface WorkspaceMember {
    id: number;
    name: string;
    initials: string;
    role: string;
    is_current_user: boolean;
    color: string;
}

interface DashboardProps {
    stats: {
        instances: { total: number; connected: number; disconnected: number };
        leads: {
            total: number;
            byAiQualification: Record<string, number>;
            byQualificationResult: Record<string, number>;
            byTreatmentStatus: Record<string, number>;
            recent: number;
            today: number;
        };
        media: { total: number; totalSize: number };
        agents: { total: number; active: number };
    };
    recentLeads: RecentLead[];
    workspace: {
        name: string;
        description: string;
        status: string;
        created_at: string;
        owner_name: string;
        usage: {
            leads_used: number;
            storage_used_bytes: number;
        };
        members: WorkspaceMember[];
    } | null;
}

export default function Dashboard({
    stats,
    recentLeads,
    workspace,
}: DashboardProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.title'), href: 'dashboard().url' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />

            <DashboardWelcomeOverlay />

            <div className="flex min-h-screen flex-col gap-6 p-6">
                {workspace && (
                    <WorkspaceHeader
                        name={workspace.name}
                        status={workspace.status}
                        description={workspace.description}
                    />
                )}

                <div
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    data-tour="stats-kpi"
                >
                    <WhatsAppKpiCard
                        connected={stats.instances.connected}
                        disconnected={stats.instances.disconnected}
                        total={stats.instances.total}
                    />

                    <Card className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-wide text-muted-foreground">
                                Agents IA
                            </h3>
                            <div className="flex items-center justify-center rounded-xl bg-violet-500/10 p-2 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                                <Bot className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-bold tracking-tight text-foreground">
                                {stats.agents.active}
                            </span>
                            <span className="text-xl text-muted-foreground">
                                / {stats.agents.total}
                            </span>
                            <span className="ml-1 text-sm text-muted-foreground">
                                actifs
                            </span>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-wide text-muted-foreground">
                                Total Leads
                            </h3>
                            <div className="flex items-center justify-center rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <Users className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-bold tracking-tight text-foreground">
                                {stats.leads.total}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {stats.leads.today} aujourd'hui
                        </p>
                    </Card>

                    <Card className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-wide text-muted-foreground">
                                Stockage
                            </h3>
                            <div className="flex items-center justify-center rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                <HardDrive className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-bold tracking-tight text-foreground">
                                {stats.media.total}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {formatBytes(stats.media.totalSize || 0)}
                        </p>
                    </Card>
                </div>

                <Separator className="my-2" />

                {workspace && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <TeamMembersCard members={workspace.members} />
                        <WorkspaceAboutCard
                            name={workspace.name}
                            description={workspace.description}
                            created_at={workspace.created_at}
                            owner_name={workspace.owner_name}
                            usage={workspace.usage}
                        />
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    <LeadConversionFunnel
                        byAiQualification={stats.leads.byAiQualification}
                        byQualificationResult={
                            stats.leads.byQualificationResult
                        }
                        byTreatmentStatus={stats.leads.byTreatmentStatus}
                        total={stats.leads.total}
                        recent={stats.leads.recent}
                        today={stats.leads.today}
                    />

                    <div className="flex flex-col gap-4 md:col-span-1">
                        <Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    Aujourd'hui
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Nouveaux leads
                                        </span>
                                        <span className="text-lg font-bold text-foreground">
                                            {stats.leads.today}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Cette semaine
                                        </span>
                                        <span className="text-lg font-bold text-foreground">
                                            {stats.leads.recent}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-foreground">
                                            {stats.leads.total}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Fichiers média
                                        </span>
                                        <span className="text-lg font-bold text-foreground">
                                            {stats.media.total}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            Stockage
                                        </span>
                                        <span className="text-sm font-medium text-foreground">
                                            {formatBytes(
                                                stats.media.totalSize || 0,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div
                    className="grid gap-4 lg:grid-cols-12"
                    data-tour="recent-leads"
                >
                    <div className="lg:col-span-12">
                        <RecentLeadsList leads={recentLeads} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
