// src/pages/dashboard/index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Phone, Bot, Image, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { formatBytes } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as indexAgent } from '@/routes/agents';
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
    token_stats: {
        credit: number;
        is_low_credit: boolean;
        threshold: number;
        model: string;
    };
    token_daily_usage: Array<{
        date: string;
        total_tokens_used: number;
        input_tokens_used: number;
        output_tokens_used: number;
        total_cost_millicents: number;
    }>;
    token_transactions: Array<{
        id: string;
        date: string;
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
        total_cost_millicents: number;
        type: string;
        reference_type: string | null;
        created_at: string;
    }>;
}

export default function Dashboard({ stats, recentLeads, token_stats, token_daily_usage, token_transactions }: DashboardProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const user = auth.user;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.title'), href: dashboard().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />

            <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
                {/* Header with greeting and AI status */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bonjour {(user.name.split(' ')[0]).toUpperCase()}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Votre IA a traité {stats.leads.today} conversations aujourd'hui.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={indexAgent().url} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                            Voir mon IA
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div data-tour="stats-leads">
                        <SummaryCard
                            title={t('dashboard.stats.totalLeads')}
                            value={stats.leads.total}
                            icon={Users}
                            description={`${stats.leads.today} ${t('dashboard.stats.newToday')}`}
                            color="blue"
                        />
                    </div>
                    <div data-tour="stats-instances">
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
                    </div>
                    <div data-tour="stats-agents">
                        <SummaryCard
                            title={t('dashboard.stats.activeAgents')}
                            value={`${stats.agents.active}/${stats.agents.total}`}
                            icon={Bot}
                            color="emerald"
                        />
                    </div>
                    <div data-tour="stats-media">
                        <SummaryCard
                            title={t('dashboard.stats.mediaFiles')}
                            value={stats.media.total}
                            icon={Image}
                            description={`${formatBytes(stats.media.totalSize || 0)}`}
                            color="purple"
                        />
                    </div>
                </div>

                

                {/* Daily Token Usage – grouped bar chart (full width) */}
                <Card>
                <CardHeader>
                    <CardTitle>Daily Token Usage (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    {token_daily_usage && token_daily_usage.length > 0 ? (
                    <Chart
                        options={{
                        chart: {
                            type: 'bar',
                            stacked: false,            // ← grouped, not stacked
                            toolbar: { show: false },
                        },
                        plotOptions: {
                            bar: {
                            horizontal: false,
                            columnWidth: '50%',
                            // enough space for two bars per day
                            },
                        },
                        xaxis: {
                            categories: token_daily_usage.map((d) =>
                            new Date(d.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                            }),
                            ),
                        },
                         yaxis: {
                            title: { text: 'Tokens' },
                            labels: {
                            formatter: (val: number) =>
                                val >= 1000
                                ? (val / 1000).toFixed(0) + 'k'
                                : val.toString(),  // ← now returns string
                            },
                        },
                        colors: ['#3b82f6', '#10b981'],
                        legend: { position: 'top' },
                        dataLabels: { enabled: false },
                        tooltip: {
                            y: { formatter: (val: number) => val.toLocaleString() },
                        },
                        }}
                        series={[
                        {
                            name: 'Input Tokens',
                            data: token_daily_usage.map((d) => d.input_tokens_used),
                        },
                        {
                            name: 'Output Tokens',
                            data: token_daily_usage.map((d) => d.output_tokens_used),
                        },
                        ]}
                        type="bar"
                        height={300}
                    />
                    ) : (
                    <p className="text-muted-foreground">No usage data yet.</p>
                    )}
                </CardContent>
                </Card>



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
                <div className="grid gap-4 lg:grid-cols-4" data-tour="recent-leads">
                    <div className="lg:col-span-3">
                        <RecentLeadsList leads={recentLeads} />
                    </div>
                    <div className="lg:col-span-1">                {/* Recent Token Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Token Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {token_transactions && token_transactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Cost</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {token_transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell>
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {tx.total_tokens.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                ${(tx.total_cost_millicents / 100_000).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-muted-foreground">No transactions yet.</p>
                        )}
                    </CardContent>
                </Card>

                    </div>


                </div>
            </div>
        </AppLayout>
    );
}