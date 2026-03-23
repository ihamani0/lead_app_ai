import { Image, HardDrive, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { formatBytes, getChartColor } from '@/lib/utils';
import type { MediaReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface MediaReportProps {
    data: MediaReportData | null;
}

export function MediaReport({ data }: MediaReportProps) {
    const { t } = useTranslation();

    if (!data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">
                    {t('reports.noData')}
                </div>
            </div>
        );
    }

    const { summary, byType } = data;

    const typeData = Object.entries(byType || {}).map(
        ([name, value], index) => ({
            name,
            value,
            color: getChartColor(index + 1),
        }),
    );

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title={t('reports.media.summary.totalFiles')}
                    value={summary.total}
                    icon={Image}
                />
                <SummaryCard
                    title={t('reports.media.summary.totalStorage')}
                    value={formatBytes(summary.totalSize || 0)}
                    icon={HardDrive}
                />
                <SummaryCard
                    title={t('reports.media.summary.averageFileSize')}
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
                                {t('reports.media.charts.byFileType')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                        label={({ name, percent }: any) =>
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {t('reports.media.charts.fileTypeDistribution')}
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
                                        {t('reports.media.noMedia')}
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
                            {t('reports.media.charts.byFileType')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t('reports.media.noMedia')}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default MediaReport;
