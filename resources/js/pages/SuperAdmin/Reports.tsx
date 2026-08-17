import {
    Activity,
    Building2,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCard } from '@/components/ui/SummaryCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import SuperAdminLayout from '@/layouts/super-admin-layout';

const PIE_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-6)',
];

type Summary = {
    total_tenants: number;
    active_tenants: number;
    total_leads: number;
    total_users: number;
};

type MonthCount = {
    month: string;
    count: number;
};

type PlanDist = {
    name: string;
    count: number;
};

type TopTenant = {
    tenant_name: string;
    total_cost: number;
    total_tokens: number;
};

type DailyCost = {
    date: string;
    total_cost: number;
    total_tokens: number;
};

type Props = {
    summary: Summary;
    tenantGrowth: MonthCount[];
    planDistribution: PlanDist[];
    leadGeneration: MonthCount[];
    topTenants: TopTenant[];
    dailyTokenCost: DailyCost[];
};

const formatTokens = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
};

const formatCost = (value: number) => `$${value.toFixed(2)}`;

export default function Reports({
    summary,
    tenantGrowth,
    planDistribution,
    leadGeneration,
    topTenants,
    dailyTokenCost,
}: Props) {
    const { t } = useTranslation();

    return (
        <SuperAdminLayout>
            <div className="container mx-auto py-6 space-y-6">
                <h1 className="text-2xl font-bold">{t('superAdmin.reports.title')}</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title={t('superAdmin.reports.summary.totalTenants')}
                        value={summary.total_tenants}
                        icon={Building2}
                        color="blue"
                    />
                    <SummaryCard
                        title={t('superAdmin.reports.summary.activeTenants')}
                        value={summary.active_tenants}
                        icon={Activity}
                        color="emerald"
                    />
                    <SummaryCard
                        title={t('superAdmin.reports.summary.totalLeads')}
                        value={summary.total_leads}
                        icon={Users}
                        color="orange"
                    />
                    <SummaryCard
                        title={t('superAdmin.reports.summary.totalUsers')}
                        value={summary.total_users}
                        icon={Users}
                        color="purple"
                    />
                </div>

                {/* Charts Row 1: Tenant Growth + Plan Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('superAdmin.reports.tenantGrowth.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">{t('superAdmin.reports.tenantGrowth.description')}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={tenantGrowth}>
                                        <defs>
                                            <linearGradient id="tenantGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis
                                            dataKey="month"
                                            className="text-xs text-muted-foreground"
                                            tickLine={false}
                                        />
                                        <YAxis
                                            className="text-xs text-muted-foreground"
                                            tickLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="var(--chart-1)"
                                            fill="url(#tenantGradient)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('superAdmin.reports.planDistribution.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">{t('superAdmin.reports.planDistribution.description')}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={planDistribution}
                                            dataKey="count"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={60}
                                            paddingAngle={2}
                                        >
                                            {planDistribution.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            formatter={(value) => (
                                                <span className="text-sm text-foreground">{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2: Lead Generation + Daily Token Cost */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('superAdmin.reports.leadGeneration.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">{t('superAdmin.reports.leadGeneration.description')}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={leadGeneration}>
                                        <defs>
                                            <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis
                                            dataKey="month"
                                            className="text-xs text-muted-foreground"
                                            tickLine={false}
                                        />
                                        <YAxis
                                            className="text-xs text-muted-foreground"
                                            tickLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="var(--chart-2)"
                                            fill="url(#leadGradient)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('superAdmin.reports.dailyTokenCost.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">{t('superAdmin.reports.dailyTokenCost.description')}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyTokenCost}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis
                                            dataKey="date"
                                            className="text-xs text-muted-foreground"
                                            tickLine={false}
                                            tickFormatter={(val) => {
                                                const d = new Date(val);
                                                return `${d.getMonth() + 1}/${d.getDate()}`;
                                            }}
                                        />
                                        <YAxis
                                            className="text-xs text-muted-foreground"
                                            tickLine={false}
                                            tickFormatter={(val) => `$${val}`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCost(value as number), 'Cost']}
                                        />
                                        <Bar dataKey="total_cost" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Tenants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('superAdmin.reports.topTenants.title')}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t('superAdmin.reports.topTenants.description')}</p>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('superAdmin.reports.topTenants.columns.tenant')}</TableHead>
                                    <TableHead className="text-right">{t('superAdmin.reports.topTenants.columns.cost')}</TableHead>
                                    <TableHead className="text-right">{t('superAdmin.reports.topTenants.columns.tokens')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topTenants.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{row.tenant_name}</TableCell>
                                        <TableCell className="text-right font-mono">{formatCost(row.total_cost)}</TableCell>
                                        <TableCell className="text-right font-mono">{formatTokens(row.total_tokens)}</TableCell>
                                    </TableRow>
                                ))}
                                {topTenants.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                                            No usage data yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
