import { Head } from '@inertiajs/react';
import {
    Phone,
    Users,
    Image,
    Bot,
    TrendingUp,
    TrendingDown,
    MessageCircle,
    AlertCircle,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
}

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
}: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <div
                        className={`flex items-center text-xs ${
                            trend.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {trend.isPositive ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {trend.value}% from last week
                    </div>
                )}
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

interface InstanceStatusProps {
    connected: number;
    disconnected: number;
    total: number;
}

function InstanceStatus({
    connected,
    disconnected,
    total,
}: InstanceStatusProps) {
    const { t } = useTranslation();
    const connectedPercent =
        total > 0 ? Math.round((connected / total) * 100) : 0;

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4" />
                    {t('dashboard.instanceStatus')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                                {t('dashboard.connected')}
                            </span>
                        </div>
                        <span className="font-semibold">{connected}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">
                                {t('dashboard.disconnected')}
                            </span>
                        </div>
                        <span className="font-semibold">{disconnected}</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${connectedPercent}%` }}
                        />
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        {connectedPercent}% {t('dashboard.uptime')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

interface LeadsByStatusProps {
    byStatus: Record<string, number>;
    byTemperature: Record<string, number>;
}

function LeadsByStatus({ byStatus, byTemperature }: LeadsByStatusProps) {
    const { t } = useTranslation();

    // Enhanced colors with dark mode variants for better vibrancy
    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-500 dark:bg-blue-600',
        CONTACTED: 'bg-amber-400 dark:bg-amber-500', // Amber reads better than yellow
        QUALIFIED: 'bg-indigo-500 dark:bg-indigo-600',
        CONVERTED: 'bg-emerald-500 dark:bg-emerald-600', // Emerald looks more professional
        LOST: 'bg-rose-500 dark:bg-rose-600',
        QUALIFYING: 'bg-purple-500 dark:bg-purple-600',
        IN_PROGRESS: 'bg-orange-500 dark:bg-orange-600',
    };

    // Temperature colors with alpha variants for backgrounds
    const temperatureConfig: Record<string, { bg: string; text: string; border: string }> = {
        HOT: { 
            bg: 'bg-rose-500/10 dark:bg-rose-500/20', 
            text: 'text-rose-600 dark:text-rose-400', 
            border: 'border-rose-500/20 dark:border-rose-500/30'
        },
        WARM: { 
            bg: 'bg-orange-500/10 dark:bg-orange-500/20', 
            text: 'text-orange-600 dark:text-orange-400', 
            border: 'border-orange-500/20 dark:border-orange-500/30'
        },
        COLD: { 
            bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', 
            text: 'text-cyan-600 dark:text-cyan-400', 
            border: 'border-cyan-500/20 dark:border-cyan-500/30'
        },
    };

    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            NEW: t('dashboard.status.new'),
            CONTACTED: t('dashboard.status.contacted'),
            QUALIFIED: t('dashboard.status.qualified'),
            CONVERTED: t('dashboard.status.converted'),
            LOST: t('dashboard.status.lost'),
            QUALIFYING: t('dashboard.status.qualifying'),
            IN_PROGRESS: t('dashboard.status.inProgress'),
        };
        return labels[status] || status;
    };

    return (
        <Card className="col-span-full md:col-span-1 shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    {t('dashboard.leadsByStatus')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-4">
                    {Object.entries(byStatus).map(([status, count]) => {
                        const colorClass = statusColors[status] || 'bg-slate-500 dark:bg-slate-600';
                        const percentage = total > 0 ? (count / total) * 100 : 0;

                        return (
                            <div key={status} className="group flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`h-2.5 w-2.5 rounded-full shadow-sm ${colorClass} ring-2 ring-white dark:ring-slate-950`}
                                    />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                        {getStatusLabel(status)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {Object.keys(byStatus).length === 0 && (
                        <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <p className="text-sm text-muted-foreground">
                                {t('dashboard.noLeads')}
                            </p>
                        </div>
                    )}
                </div>

                {Object.keys(byTemperature).length > 0 && (
                    <>
                        <div className="my-5 border-t border-slate-100 dark:border-slate-800" />
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t('dashboard.byTemperature')}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(byTemperature).map(([temp, count]) => {
                                const config = temperatureConfig[temp] || {
                                    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
                                    text: 'text-slate-600 dark:text-slate-400',
                                    border: 'border-slate-500/20'
                                };

                                return (
                                    <div
                                        key={temp}
                                        className={`flex flex-col items-center justify-center rounded-xl border ${config.border} ${config.bg} p-3 transition-all hover:shadow-md`}
                                    >
                                        <div className={`text-xl font-bold ${config.text}`}>
                                            {count}
                                        </div>
                                        <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {t(`dashboard.temperature.${temp.toLowerCase()}`) || temp}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

interface RecentLead {
    id: string;
    name: string;
    phone: string;
    status: string;
    temperature: string;
    created_at: string;
    instance?: {
        instance_name: string;
    };
}

interface DashboardProps {
    stats: {
        instances: {
            total: number;
            connected: number;
            disconnected: number;
        };
        leads: {
            total: number;
            byStatus: Record<string, number>;
            byTemperature: Record<string, number>;
            recent: number;
            today: number;
        };
        media: {
            total: number;
            size: number;
        };
        agents: {
            total: number;
            active: number;
        };
    };
    recentLeads: RecentLead[];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(dateString: string, t: (key: string) => string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('dashboard.time.justNow');
    if (hours < 24) return `${hours}${t('dashboard.time.hoursAgo')}`;
    if (days < 7) return `${days}${t('dashboard.time.daysAgo')}`;
    return date.toLocaleDateString();
}

function getStatusLabel(status: string, t: (key: string) => string): string {
    const labels: Record<string, string> = {
        NEW: t('dashboard.status.new'),
        CONTACTED: t('dashboard.status.contacted'),
        QUALIFIED: t('dashboard.status.qualified'),
        CONVERTED: t('dashboard.status.converted'),
        LOST: t('dashboard.status.lost'),
        QUALIFYING: t('dashboard.status.qualifying'),
        IN_PROGRESS: t('dashboard.status.inProgress'),
    };
    return labels[status] || status;
}

export default function Dashboard({ stats, recentLeads }: DashboardProps) {
    const { t } = useTranslation();
    const { t: td } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex flex-col gap-6 p-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title={t('dashboard.stats.totalLeads')}
                        value={stats.leads.total}
                        icon={Users}
                        description={`${stats.leads.today} ${t('dashboard.stats.newToday')}`}
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
                    />
                    <StatCard
                        title={t('dashboard.stats.mediaFiles')}
                        value={stats.media.total}
                        icon={Image}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <InstanceStatus
                        connected={stats.instances.connected}
                        disconnected={stats.instances.disconnected}
                        total={stats.instances.total}
                    />
                    <LeadsByStatus
                        byStatus={stats.leads.byStatus}
                        byTemperature={stats.leads.byTemperature}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="h-4 w-4" />
                                {t('dashboard.leadActivity')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('dashboard.newThisWeek')}
                                    </span>
                                    <span className="font-semibold">
                                        {stats.leads.recent}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('dashboard.newToday')}
                                    </span>
                                    <span className="font-semibold">
                                        {stats.leads.today}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('dashboard.totalLeads')}
                                    </span>
                                    <span className="font-semibold">
                                        {stats.leads.total}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Leads */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MessageCircle className="h-4 w-4" />
                            {t('dashboard.recentLeads')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentLeads.length > 0 ? (
                            <div className="space-y-4">
                                {recentLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>
                                                    {getInitials(
                                                        lead.name ||
                                                            td(
                                                                'dashboard.unknown',
                                                            ),
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {lead.name ||
                                                        td('dashboard.unknown')}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {lead.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {lead.instance && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {
                                                        lead.instance
                                                            .instance_name
                                                    }
                                                </Badge>
                                            )}
                                            <Badge
                                                variant={
                                                    lead.status === 'NEW'
                                                        ? 'default'
                                                        : lead.status ===
                                                            'CONVERTED'
                                                          ? 'secondary'
                                                          : 'outline'
                                                }
                                                className="text-xs"
                                            >
                                                {getStatusLabel(lead.status, t)}
                                            </Badge>
                                            {lead.temperature && (
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        lead.temperature ===
                                                        'HOT'
                                                            ? 'border-red-500 text-red-500'
                                                            : lead.temperature ===
                                                                'WARM'
                                                              ? 'border-orange-500 text-orange-500'
                                                              : 'border-blue-500 text-blue-500'
                                                    }`}
                                                >
                                                    {lead.temperature}
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(lead.created_at, t)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Users className="mb-2 h-10 w-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    {t('dashboard.noLeads')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('dashboard.noLeadsDescription')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
