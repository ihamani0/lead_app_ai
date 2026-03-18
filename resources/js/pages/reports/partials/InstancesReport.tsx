import { Phone, TrendingUp, BarChart3 } from 'lucide-react';
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculatePercentage, getChartColor } from '@/lib/utils';
import type { InstancesReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface InstancesReportProps {
    data: InstancesReportData | null;
}

export function InstancesReport({ data }: InstancesReportProps) {
    if (!data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
            </div>
        );
    }

    const { summary, leadsByInstance, byStatus } = data;
    const connectedPercent = calculatePercentage(
        summary.connected,
        summary.total,
    );
    const maxLeads = Math.max(...Object.values(leadsByInstance), 1);

    const statusData = Object.entries(byStatus || {}).map(
        ([name, value], index) => ({
            name,
            value,
            color: getChartColor(index + 1),
        }),
    );

    const leadsData = Object.entries(leadsByInstance).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title="Total Instances"
                    value={summary.total}
                    icon={Phone}
                />
                <SummaryCard
                    title="Connected"
                    value={summary.connected}
                    icon={TrendingUp}
                    description={`${connectedPercent}% uptime`}
                />
                <SummaryCard
                    title="Disconnected"
                    value={summary.disconnected}
                    icon={BarChart3}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart - By Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Instance Status
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
                                No data available
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Bar Chart - Leads by Instance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Leads per Instance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {leadsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={leadsData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        fill={getChartColor(1)}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted-foreground">
                                No data available
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bars - Leads per Instance */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Leads per Instance
                    </CardTitle>
                    <CardDescription>
                        Number of leads captured by each WhatsApp instance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(leadsByInstance).map(
                            ([instance, count]) => (
                                <div
                                    key={instance}
                                    className="flex items-center justify-between"
                                >
                                    <span className="truncate font-medium">
                                        {instance}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <Progress
                                            value={(count / maxLeads) * 100}
                                            className="w-32"
                                        />
                                        <span className="w-12 text-right font-medium">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            ),
                        )}
                        {Object.keys(leadsByInstance).length === 0 && (
                            <p className="text-muted-foreground">
                                No instances found
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default InstancesReport;
