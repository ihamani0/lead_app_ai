import { Coins, ArrowDownCircle, ArrowUpCircle, Activity, Calendar, Bot } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { TokenTransactionsReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface TokenTransactionsReportProps {
    data: TokenTransactionsReportData | null;
}

interface ChartRow {
    label: string;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    input_cost: number;
    output_cost: number;
    total_cost: number;
    transaction_count: number;
}

const formatTokens = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
};

const formatCost = (value: number) => `$${value.toFixed(2)}`;

export function TokenTransactionsReport({ data }: TokenTransactionsReportProps) {
    const { t } = useTranslation();
    const [view, setView] = useState<'daily' | 'monthly'>('daily');

    const summary = data?.summary;
    const daily = data?.daily ?? [];
    const monthly = data?.monthly ?? [];
    const byAgent = data?.byAgent ?? [];

    const chartData: ChartRow[] = useMemo(() => {
        if (view === 'daily') {
            return daily.map((d) => ({
                label: d.date,
                input_tokens: d.input_tokens,
                output_tokens: d.output_tokens,
                total_tokens: d.total_tokens,
                input_cost: d.input_cost,
                output_cost: d.output_cost,
                total_cost: d.total_cost,
                transaction_count: d.transaction_count,
            }));
        }
        return monthly.map((m) => ({
            label: m.month,
            input_tokens: m.input_tokens,
            output_tokens: m.output_tokens,
            total_tokens: m.total_tokens,
            input_cost: m.input_cost,
            output_cost: m.output_cost,
            total_cost: m.total_cost,
            transaction_count: m.transaction_count,
        }));
    }, [view, daily, monthly]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tooltipFormatter = (value: any, name: any) => {
        const numValue = typeof value === 'number' ? value : 0;
        if (typeof name === 'string' && name.includes('cost')) return formatCost(numValue);
        return formatTokens(numValue);
    };

    if (!data || !summary) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">
                    {t('reports.noData')}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    title={t('reports.tokens.summary.totalTokens')}
                    value={formatTokens(summary.total_tokens)}
                    icon={Coins}
                    color="blue"
                />
                <SummaryCard
                    title={t('reports.tokens.summary.totalCost')}
                    value={formatCost(summary.total_cost)}
                    icon={Activity}
                    color="emerald"
                />
                <SummaryCard
                    title={t('reports.tokens.summary.inputTokens')}
                    value={formatTokens(summary.input_tokens)}
                    icon={ArrowDownCircle}
                    color="purple"
                />
                <SummaryCard
                    title={t('reports.tokens.summary.outputTokens')}
                    value={formatTokens(summary.output_tokens)}
                    icon={ArrowUpCircle}
                    color="orange"
                />
            </div>

            {/* Chart with Toggle */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <Calendar className="h-4 w-4" />
                            {t('reports.tokens.charts.tokenUsage')}
                        </CardTitle>
                        <div className="flex gap-1 rounded-lg bg-muted p-1">
                            <button
                                onClick={() => setView('daily')}
                                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                    view === 'daily'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {t('reports.tokens.toggle.daily')}
                            </button>
                            <button
                                onClick={() => setView('monthly')}
                                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                    view === 'monthly'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {t('reports.tokens.toggle.monthly')}
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData as unknown as Record<string, unknown>[]}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 12 }}
                                    angle={view === 'daily' ? -45 : 0}
                                    textAnchor={view === 'daily' ? 'end' : 'middle'}
                                    height={view === 'daily' ? 80 : 40}
                                />
                                <YAxis tickFormatter={formatTokens} />
                                <Tooltip formatter={tooltipFormatter} />
                                <Legend />
                                <Bar
                                    dataKey="input_tokens"
                                    name={t('reports.tokens.legend.inputTokens')}
                                    fill="#8b5cf6"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="output_tokens"
                                    name={t('reports.tokens.legend.outputTokens')}
                                    fill="#10b981"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-64 items-center justify-center text-muted-foreground">
                            {t('reports.noData')}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Per-Agent Breakdown */}
            {byAgent.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <Bot className="h-4 w-4" />
                            {t('reports.tokens.byAgent.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={Math.max(200, byAgent.length * 60)}>
                            <BarChart data={byAgent as unknown as Record<string, unknown>[]} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis type="number" tickFormatter={formatTokens} />
                                <YAxis
                                    dataKey="agent_name"
                                    type="category"
                                    width={120}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip formatter={tooltipFormatter} />
                                <Legend />
                                <Bar
                                    dataKey="input_tokens"
                                    name={t('reports.tokens.legend.inputTokens')}
                                    fill="#8b5cf6"
                                    radius={[0, 4, 4, 0]}
                                />
                                <Bar
                                    dataKey="output_tokens"
                                    name={t('reports.tokens.legend.outputTokens')}
                                    fill="#10b981"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Monthly Summary Table */}
            {monthly.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm md:text-base">
                            {t('reports.tokens.monthly.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-2 text-left font-medium">{t('reports.tokens.table.month')}</th>
                                        <th className="pb-2 text-right font-medium">{t('reports.tokens.table.inputTokens')}</th>
                                        <th className="pb-2 text-right font-medium">{t('reports.tokens.table.outputTokens')}</th>
                                        <th className="pb-2 text-right font-medium">{t('reports.tokens.table.totalTokens')}</th>
                                        <th className="pb-2 text-right font-medium">{t('reports.tokens.table.cost')}</th>
                                        <th className="pb-2 text-right font-medium">{t('reports.tokens.table.transactions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthly.map((row) => (
                                        <tr key={row.month} className="border-b last:border-0">
                                            <td className="py-2 font-medium">{row.month}</td>
                                            <td className="py-2 text-right">{formatTokens(row.input_tokens)}</td>
                                            <td className="py-2 text-right">{formatTokens(row.output_tokens)}</td>
                                            <td className="py-2 text-right">{formatTokens(row.total_tokens)}</td>
                                            <td className="py-2 text-right">{formatCost(row.total_cost)}</td>
                                            <td className="py-2 text-right">{row.transaction_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default TokenTransactionsReport;
