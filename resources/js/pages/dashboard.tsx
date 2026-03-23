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
    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-500',
        CONTACTED: 'bg-yellow-500',
        QUALIFIED: 'bg-orange-500',
        CONVERTED: 'bg-green-500',
        LOST: 'bg-red-500',
        QUALIFYING: 'bg-purple-500',
        IN_PROGRESS: 'bg-amber-500',
    };

    const temperatureColors: Record<string, string> = {
        HOT: 'bg-red-500',
        WARM: 'bg-orange-400',
        COLD: 'bg-blue-400',
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
        <Card className="col-span-full md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4" />
                    {t('dashboard.leadsByStatus')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {Object.entries(byStatus).map(([status, count]) => (
                        <div
                            key={status}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-2 w-2 rounded-full ${
                                        statusColors[status] || 'bg-slate-500'
                                    }`}
                                />
                                <span className="text-sm">
                                    {getStatusLabel(status)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full ${
                                            statusColors[status] ||
                                            'bg-slate-500'
                                        }`}
                                        style={{
                                            width: `${total > 0 ? (count / total) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-sm font-medium">
                                    {count}
                                </span>
                            </div>
                        </div>
                    ))}
                    {Object.keys(byStatus).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {t('dashboard.noLeads')}
                        </p>
                    )}
                </div>

                {Object.keys(byTemperature).length > 0 && (
                    <>
                        <div className="my-4 border-t" />
                        <p className="mb-3 text-sm font-medium">
                            {t('dashboard.byTemperature')}
                        </p>
                        <div className="flex gap-2">
                            {Object.entries(byTemperature).map(
                                ([temp, count]) => (
                                    <div
                                        key={temp}
                                        className={`flex-1 rounded-lg p-2 text-center ${
                                            temperatureColors[temp] ||
                                            'bg-slate-500'
                                        } bg-opacity-20`}
                                    >
                                        <div
                                            className={`text-lg font-bold ${
                                                temperatureColors[
                                                    temp
                                                ]?.replace('bg-', 'text-') ||
                                                'text-slate-700'
                                            }`}
                                        >
                                            {count}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {temp}
                                        </div>
                                    </div>
                                ),
                            )}
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
