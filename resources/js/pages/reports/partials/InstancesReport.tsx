import { Phone, TrendingUp, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { calculatePercentage } from '@/lib/utils';
import type { InstancesReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface InstancesReportProps {
    data: InstancesReportData | null;
}

export function InstancesReport({ data }: InstancesReportProps) {
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

    const { summary, leadsByInstance, instances } = data;
    const connectedPercent = calculatePercentage(
        summary.connected,
        summary.total,
    );

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title={t('reports.instances.summary.totalInstances')}
                    value={summary.total}
                    icon={Phone}
                />
                <SummaryCard
                    title={t('reports.instances.summary.connected')}
                    value={summary.connected}
                    icon={TrendingUp}
                    description={`${connectedPercent}${t('reports.instances.summary.uptime')}`}
                />
                <SummaryCard
                    title={t('reports.instances.summary.disconnected')}
                    value={summary.disconnected}
                    icon={BarChart3}
                />
            </div>

            {/* Instances Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm md:text-base">
                        {t('reports.instances.table.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {instances.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 text-left font-medium text-muted-foreground">
                                            {t('reports.instances.table.name')}
                                        </th>
                                        <th className="pb-3 text-left font-medium text-muted-foreground">
                                            {t('reports.instances.table.phone')}
                                        </th>
                                        <th className="pb-3 text-left font-medium text-muted-foreground">
                                            {t('reports.instances.table.status')}
                                        </th>
                                        <th className="pb-3 text-right font-medium text-muted-foreground">
                                            {t('reports.instances.table.leads')}
                                        </th>
                                        <th className="pb-3 text-right font-medium text-muted-foreground">
                                            {t('reports.instances.table.connectedAt')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instances.map((instance) => (
                                        <tr
                                            key={instance.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 font-medium">
                                                {instance.name}
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {instance.phone || '-'}
                                            </td>
                                            <td className="py-3">
                                                <Badge
                                                    variant={
                                                        instance.status === 'connected'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {instance.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 text-right">
                                                {leadsByInstance[instance.name] ?? 0}
                                            </td>
                                            <td className="py-3 text-right text-muted-foreground">
                                                {instance.connected_at
                                                    ? new Date(
                                                          instance.connected_at,
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            {t('reports.instances.noInstances')}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default InstancesReport;
