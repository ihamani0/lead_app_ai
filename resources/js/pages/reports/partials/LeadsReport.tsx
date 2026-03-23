import { Users, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';
import {
    getStatusColor,
    calculatePercentage,
    getChartColor,
} from '@/lib/utils';
import type { LeadsReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface LeadsReportProps {
    data: LeadsReportData | null;
}

export function LeadsReport({ data }: LeadsReportProps) {
    const { t } = useTranslation();

    if (!data || !data.byStatus) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">
                    {t('reports.noData')}
                </div>
            </div>
        );
    }

    const { summary, byStatus, byTemperature, bySource, byInstance } = data;
    const total = Object.values(byStatus).reduce((acc, val) => acc + val, 0);

    const statusData = Object.entries(byStatus).map(([name, value], index) => ({
        name,
        value,
        color: getChartColor(index + 1),
    }));

    const temperatureData = Object.entries(byTemperature).map(
        ([name, value], index) => ({
            name,
            value,
            color: getChartColor(index + 1),
        }),
    );

    const instanceData = Object.entries(byInstance).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <SummaryCard
                    title={t('reports.leads.summary.totalLeads')}
                    value={summary.total}
                    icon={Users}
                    description={t('reports.leads.summary.allTime')}
                />
                <SummaryCard
                    title={t('reports.leads.summary.last7Days')}
                    value={summary.last7days}
                    icon={Clock}
                    description={t('reports.leads.summary.newLeads')}
                />
                <SummaryCard
                    title={t('reports.leads.summary.last30Days')}
                    value={summary.last30days}
                    icon={TrendingUp}
                    description={t('reports.leads.summary.newLeads')}
                />
                <SummaryCard
                    title={t('reports.leads.summary.avgPerDay')}
                    value={summary.avgPerDay}
                    icon={BarChart3}
                    description={t('reports.leads.summary.last30DaysDesc')}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart - By Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('reports.leads.charts.byStatus')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }: any) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted-foreground">
                                {t('reports.noData')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Pie Chart - By Temperature */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('reports.leads.charts.byTemperature')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {temperatureData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={temperatureData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }: any) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                    >
                                        {temperatureData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted-foreground">
                                {t('reports.noData')}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bar Chart - By Instance */}
            {instanceData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('reports.leads.charts.leadsByInstance')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={instanceData} layout="vertical">
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-muted"
                                />
                                <XAxis type="number" />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={120}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill={getChartColor(1)}
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Detail Cards Grid - Progress Bars */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* By Status Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('reports.leads.charts.byStatus')}
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
                                            className={`h-3 w-3 rounded-full ${getStatusColor(
                                                status,
                                            )}`}
                                        />
                                        <span className="font-medium">
                                            {status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Progress
                                            value={calculatePercentage(
                                                count,
                                                total,
                                            )}
                                            className="w-24"
                                        />
                                        <span className="w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(byStatus).length === 0 && (
                                <p className="text-muted-foreground">
                                    {t('reports.noData')}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* By Source */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('reports.leads.charts.bySource')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(bySource).map(([source, count]) => (
                                <div
                                    key={source}
                                    className="flex items-center justify-between"
                                >
                                    <span className="font-medium">
                                        {source || t('reports.leads.unknown')}
                                    </span>
                                    <span className="font-medium">{count}</span>
                                </div>
                            ))}
                            {Object.keys(bySource).length === 0 && (
                                <p className="text-muted-foreground">
                                    {t('reports.noData')}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default LeadsReport;
