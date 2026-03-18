import { Image, HardDrive, BarChart3 } from 'lucide-react';
import {
    LazyChart,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from '@/components/lazy-recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes } from '@/lib/utils';
import type { MediaReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface MediaReportProps {
    data: MediaReportData | null;
}

const TYPE_COLORS: Record<string, string> = {
    image: '#3b82f6',
    video: '#8b5cf6',
    document: '#f59e0b',
    audio: '#22c55e',
};

export function MediaReport({ data }: MediaReportProps) {
    if (!data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">No data available</div>
            </div>
        );
    }

    const { summary, byType } = data;

    const typeData = Object.entries(byType || {}).map(([name, value]) => ({
        name,
        value,
        color: TYPE_COLORS[name.toLowerCase()] || '#6b7280',
    }));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title="Total Files"
                    value={summary.total}
                    icon={Image}
                />
                <SummaryCard
                    title="Total Storage"
                    value={formatBytes(summary.totalSize || 0)}
                    icon={HardDrive}
                />
                <SummaryCard
                    title="Average File Size"
                    value={formatBytes(summary.avgSize || 0)}
                    icon={BarChart3}
                />
            </div>

            {/* Charts */}
            {typeData.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                By File Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LazyChart>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={typeData}
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
                                            {typeData.map((entry, index) => (
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                File Type Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(byType).map(([type, count]) => (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="truncate font-medium">
                                            {type}
                                        </span>
                                        <span className="font-medium">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                                {Object.keys(byType).length === 0 && (
                                    <p className="text-muted-foreground">
                                        No media files found
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Fallback if no data */}
            {typeData.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            By File Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            No media files found
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default MediaReport;
