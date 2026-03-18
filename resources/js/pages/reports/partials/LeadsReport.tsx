import { Users, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    LazyChart,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from '@/components/lazy-recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getStatusColor, calculatePercentage } from '@/lib/utils';
import type { LeadsReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface LeadsReportProps {
    data: LeadsReportData | null;
}

const STATUS_COLORS: Record<string, string> = {
    NEW: '#3b82f6',
    IN_PROGRESS: '#f59e0b',
    CLOSED: '#22c55e',
    CONTACTED: '#8b5cf6',
    QUALIFIED: '#06b6d4',
    HOT: '#ef4444',
    WARM: '#f97316',
    COLD: '#6b7280',
};

const TEMP_COLORS: Record<string, string> = {
    HOT: '#ef4444',
    WARM: '#f97316',
    COLD: '#6b7280',
};

export function LeadsReport({ data }: LeadsReportProps) {
    if (!data || !data.byStatus) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
            </div>
        );
    }

    const { summary, byStatus, byTemperature, bySource, byInstance } = data;
    const total = Object.values(byStatus).reduce((acc, val) => acc + val, 0);

    const statusData = Object.entries(byStatus).map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name] || '#6b7280',
    }));

    const temperatureData = Object.entries(byTemperature).map(
        ([name, value]) => ({
            name,
            value,
            color: TEMP_COLORS[name] || '#6b7280',
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
                    title="Total Leads"
                    value={summary.total}
                    icon={Users}
                    description="All time"
                />
                <SummaryCard
                    title="Last 7 Days"
                    value={summary.last7days}
                    icon={Clock}
                    description="New leads"
                />
                <SummaryCard
                    title="Last 30 Days"
                    value={summary.last30days}
                    icon={TrendingUp}
                    description="New leads"
                />
                <SummaryCard
                    title="Avg per Day"
                    value={summary.avgPerDay}
                    icon={BarChart3}
                    description="Last 30 days"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart - By Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">By Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {statusData.length > 0 ? (
                            <LazyChart>
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
                                            label={({ name, percent }) =>
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
                            </LazyChart>
                        ) : (
                            <p className="text-muted-foreground">
                                No data available
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Pie Chart - By Temperature */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            By Temperature
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {temperatureData.length > 0 ? (
                            <LazyChart>
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
                                            label={({ name, percent }) =>
                                                `${name} ${((percent || 0) * 100).toFixed(0)}%`
                                            }
                                        >
                                            {temperatureData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </LazyChart>
                        ) : (
                            <p className="text-muted-foreground">
                                No data available
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
                            Leads by Instance
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
                                    fill="#3b82f6"
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
                        <CardTitle className="text-base">By Status</CardTitle>
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
                                    No data available
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* By Source */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">By Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(bySource).map(([source, count]) => (
                                <div
                                    key={source}
                                    className="flex items-center justify-between"
                                >
                                    <span className="font-medium">
                                        {source || 'Unknown'}
                                    </span>
                                    <span className="font-medium">{count}</span>
                                </div>
                            ))}
                            {Object.keys(bySource).length === 0 && (
                                <p className="text-muted-foreground">
                                    No data available
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
