// src/pages/dashboard/index.tsx
import { Head } from '@inertiajs/react';
import { Users, Phone, Bot, Image } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { formatBytes } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { InstanceStatusChart } from './dashboard/instance-status-chart';
import { LeadActivityTimeline } from './dashboard/lead-activity-timeline';
import { LeadsByStatusChart } from './dashboard/leads-by-status-chart';
import {
    RecentLeadsList,
    type RecentLead,
} from './dashboard/recent-leads-list';

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
}

export default function Dashboard({ stats, recentLeads }: DashboardProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.title'), href: dashboard().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />

            <div className="flex flex-col gap-6 p-6">
                {/* Primary Stats Grid */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold lg:text-4xl">
                        {t('dashboard.title')}
                    </h1>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title={t('dashboard.stats.totalLeads')}
                        value={stats.leads.total}
                        icon={Users}
                        description={`${stats.leads.today} ${t('dashboard.stats.newToday')}`}
                        color="blue"
                    />
                    <SummaryCard
                        title={t('dashboard.stats.instances')}
                        value={`${stats.instances.connected}/${stats.instances.total}`}
                        icon={Phone}
                        description={`${stats.instances.disconnected} ${t('dashboard.stats.disconnected')}`}
                        color={
                            stats.instances.disconnected > 0
                                ? 'destructive'
                                : 'emerald'
                        }
                    />
                    <SummaryCard
                        title={t('dashboard.stats.activeAgents')}
                        value={`${stats.agents.active}/${stats.agents.total}`}
                        icon={Bot}
                        color="emerald"
                    />
                    <SummaryCard
                        title={t('dashboard.stats.mediaFiles')}
                        value={stats.media.total}
                        icon={Image}
                        description={`${formatBytes(stats.media.totalSize || 0)}`}
                        color="purple"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-3">
                    <InstanceStatusChart
                        connected={stats.instances.connected}
                        disconnected={stats.instances.disconnected}
                        total={stats.instances.total}
                    />
                    <LeadsByStatusChart
                        byAiQualification={stats.leads.byAiQualification}
                        byQualificationResult={
                            stats.leads.byQualificationResult
                        }
                        byTreatmentStatus={stats.leads.byTreatmentStatus}
                    />
                    <LeadActivityTimeline
                        recent={stats.leads.recent}
                        today={stats.leads.today}
                        total={stats.leads.total}
                    />
                </div>

                {/* Recent Leads */}
                <div className="grid gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <RecentLeadsList leads={recentLeads} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
