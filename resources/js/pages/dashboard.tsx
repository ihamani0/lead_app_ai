// src/pages/dashboard/index.tsx
import { Head } from '@inertiajs/react';
import { Users, Phone, Bot, Image } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { formatBytes } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { InstanceStatusChart } from './dashboard/instance-status-chart';
import { LeadActivityTimeline } from './dashboard/lead-activity-timeline';
import { LeadsByStatusChart } from './dashboard/leads-by-status-chart';
import { LeadsByTemperature } from './dashboard/leads-by-temperature';
import {
    RecentLeadsList,
    type RecentLead,
} from './dashboard/recent-leads-list';
import { StatCard } from './dashboard/stat-card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

interface DashboardProps {
    stats: {
        instances: { total: number; connected: number; disconnected: number };
        leads: {
            total: number;
            byStatus: Record<string, number>;
            byTemperature: Record<string, number>;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />

            <div className="flex flex-col gap-6 p-6">
                {/* Primary Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title={t('dashboard.stats.totalLeads')}
                        value={stats.leads.total}
                        icon={Users}
                        description={`${stats.leads.today} ${t('dashboard.stats.newToday')}`}
                        // trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title={t('dashboard.stats.instances')}
                        value={`${stats.instances.connected}/${stats.instances.total}`}
                        icon={Phone}
                        description={`${stats.instances.disconnected} ${t('dashboard.stats.disconnected')}`}
                    />
                    <StatCard
                        title={t('dashboard.stats.activeAgents')}
                        value={`${stats.agents.active}/${stats.agents.total}`}
                        icon={Bot}
                        // trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard
                        title={t('dashboard.stats.mediaFiles')}
                        value={stats.media.total}
                        icon={Image}
                        description={`${formatBytes(stats.media.totalSize || 0)}`}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-3">
                    <InstanceStatusChart
                        connected={stats.instances.connected}
                        disconnected={stats.instances.disconnected}
                        total={stats.instances.total}
                    />
                    <LeadsByStatusChart byStatus={stats.leads.byStatus} />
                    <LeadActivityTimeline
                        recent={stats.leads.recent}
                        today={stats.leads.today}
                        total={stats.leads.total}
                    />
                </div>

                {/* Temperature & Recent Leads */}
                <div className="grid gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <LeadsByTemperature
                            byTemperature={stats.leads.byTemperature}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <RecentLeadsList leads={recentLeads} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
