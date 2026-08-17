import { router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowUpDown,
    BadgeDollarSign,
    DollarSign,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import admin from '@/routes/admin';

type TenantRow = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    balance: number;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    total_cost: number;
    recharges: number;
};

type DailyRow = {
    date: string;
    total_tokens: number;
    total_cost: number;
    recharges: number;
};

type Props = {
    totals: {
        total_tokens: number;
        total_cost: number;
        total_recharges: number;
        low_credit_count: number;
    };
    dailyData: DailyRow[];
    tenants: TenantRow[];
    filters: {
        date_from: string;
        date_to: string;
        search: string;
    };
};

const formatTokens = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
};

const formatCost = (value: number) => `$${value.toFixed(2)}`;

type SortKey = 'name' | 'total_tokens' | 'total_cost' | 'recharges' | 'balance' | 'net';

export default function TokenUsage({ totals, dailyData, tenants, filters }: Props) {
    const { t } = useTranslation();

    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);
    const [search, setSearch] = useState(filters.search);
    const [sortKey, setSortKey] = useState<SortKey>('total_cost');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const setRange = (days: number) => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - days);
        setDateFrom(from.toISOString().slice(0, 10));
        setDateTo(to.toISOString().slice(0, 10));
    };

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (search) params.search = search;
        router.get(admin.tokenUsage.index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const sortedTenants = [...tenants].sort((a, b) => {
        let cmp = 0;
        switch (sortKey) {
            case 'name': cmp = a.name.localeCompare(b.name); break;
            case 'total_tokens': cmp = a.total_tokens - b.total_tokens; break;
            case 'total_cost': cmp = a.total_cost - b.total_cost; break;
            case 'recharges': cmp = a.recharges - b.recharges; break;
            case 'balance': cmp = a.balance - b.balance; break;
            case 'net': cmp = (a.total_cost - a.recharges) - (b.total_cost - b.recharges); break;
        }
        return sortDir === 'desc' ? -cmp : cmp;
    });

    const SortHeader = ({ sortKey: sk, label }: { sortKey: SortKey; label: string }) => (
        <TableHead
            className="cursor-pointer select-none text-right"
            onClick={() => toggleSort(sk)}
        >
            <div className="inline-flex items-center gap-1">
                {label}
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
            </div>
        </TableHead>
    );

    return (
        <SuperAdminLayout>
            <div className="container mx-auto py-6 space-y-6">
                <h1 className="text-2xl font-bold">{t('superAdmin.tokenUsage.title')}</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title={t('superAdmin.tokenUsage.summary.totalTokens')}
                        value={formatTokens(totals.total_tokens)}
                        icon={Activity}
                        color="blue"
                    />
                    <SummaryCard
                        title={t('superAdmin.tokenUsage.summary.totalCost')}
                        value={formatCost(totals.total_cost)}
                        icon={DollarSign}
                        color="orange"
                    />
                    <SummaryCard
                        title={t('superAdmin.tokenUsage.summary.totalRecharges')}
                        value={formatCost(totals.total_recharges)}
                        icon={BadgeDollarSign}
                        color="emerald"
                    />
                    <SummaryCard
                        title={t('superAdmin.tokenUsage.summary.lowCredit')}
                        value={totals.low_credit_count}
                        icon={AlertTriangle}
                        color="destructive"
                    />
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex gap-1">
                                <Button variant={dateFrom === filters.date_from ? 'default' : 'outline'} size="sm" onClick={() => { setRange(7); }}>
                                    {t('superAdmin.tokenUsage.filters.last7')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => { setRange(30); }}>
                                    {t('superAdmin.tokenUsage.filters.last30')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => { setRange(90); }}>
                                    {t('superAdmin.tokenUsage.filters.last90')}
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.tokenUsage.filters.dateFrom')}</p>
                                <Input
                                    type="date"
                                    className="w-36"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.tokenUsage.filters.dateTo')}</p>
                                <Input
                                    type="date"
                                    className="w-36"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.tokenUsage.filters.search')}</p>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="w-44 pl-8"
                                        placeholder={t('superAdmin.tokenUsage.filters.search')}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
                                    />
                                </div>
                            </div>
                            <Button onClick={applyFilters}>
                                {t('superAdmin.tokenUsage.filters.apply')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('superAdmin.tokenUsage.dailyChart.title')}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t('superAdmin.tokenUsage.dailyChart.description')}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyData}>
                                    <defs>
                                        <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="rechargeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
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
                                        tickFormatter={(val) => formatCost(val)}
                                    />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="total_cost"
                                        name={t('superAdmin.tokenUsage.dailyChart.cost')}
                                        stroke="var(--chart-1)"
                                        fill="url(#costGradient)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="recharges"
                                        name={t('superAdmin.tokenUsage.dailyChart.recharges')}
                                        stroke="var(--chart-2)"
                                        fill="url(#rechargeGradient)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Per-Tenant Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('superAdmin.tokenUsage.table.title')}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t('superAdmin.tokenUsage.table.description')}</p>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('name')}
                                    >
                                        <div className="inline-flex items-center gap-1">
                                            {t('superAdmin.tokenUsage.table.columns.tenant')}
                                            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                    </TableHead>
                                    <SortHeader sortKey="total_tokens" label={t('superAdmin.tokenUsage.table.columns.input')} />
                                    <SortHeader sortKey="total_tokens" label={t('superAdmin.tokenUsage.table.columns.output')} />
                                    <SortHeader sortKey="total_tokens" label={t('superAdmin.tokenUsage.table.columns.total')} />
                                    <SortHeader sortKey="total_cost" label={t('superAdmin.tokenUsage.table.columns.cost')} />
                                    <SortHeader sortKey="recharges" label={t('superAdmin.tokenUsage.table.columns.recharges')} />
                                    <SortHeader sortKey="net" label={t('superAdmin.tokenUsage.table.columns.net')} />
                                    <SortHeader sortKey="balance" label={t('superAdmin.tokenUsage.table.columns.balance')} />
                                    <TableHead className="text-center">{t('superAdmin.tokenUsage.table.columns.status')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTenants.map((row) => {
                                    const net = row.total_cost - row.recharges;
                                    return (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-medium">
                                                <a
                                                    href={admin.tenant.show({ tenant: row.slug }).url}
                                                    className="hover:underline"
                                                >
                                                    {row.name}
                                                </a>
                                            </TableCell>
                                            <TableCell className="font-mono text-right text-sm">
                                                {formatTokens(row.input_tokens)}
                                            </TableCell>
                                            <TableCell className="font-mono text-right text-sm">
                                                {formatTokens(row.output_tokens)}
                                            </TableCell>
                                            <TableCell className="font-mono text-right text-sm">
                                                {formatTokens(row.total_tokens)}
                                            </TableCell>
                                            <TableCell className="font-mono text-right">
                                                {formatCost(row.total_cost)}
                                            </TableCell>
                                            <TableCell className="font-mono text-right">
                                                {formatCost(row.recharges)}
                                            </TableCell>
                                            <TableCell className={`font-mono text-right ${net > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {formatCost(net)}
                                            </TableCell>
                                            <TableCell className="font-mono text-right">
                                                {formatCost(row.balance)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {row.balance < 0.1 ? (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {t('superAdmin.tokenUsage.table.statusLow')}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {t('superAdmin.tokenUsage.table.statusOk')}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {sortedTenants.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                                            {t('superAdmin.tokenUsage.table.empty')}
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
