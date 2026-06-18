import {
    Users,
    Clock,
    TrendingUp,
    BarChart3,
    Flame,
    CheckCircle,
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { getChartColor } from '@/lib/utils';
import type { LeadsReportData } from '@/types/reports';
import { SummaryCard } from './SummaryCard';

interface LeadsReportProps {
    data: LeadsReportData | null;
}

const aiQualificationColors: Record<string, string> = {
    QUALIFIE: '#22c55e',
    NON_QUALIFIE: '#94a3b8',
};

const qualificationResultColors: Record<string, string> = {
    HOT: '#ef4444',
    WARM: '#f97316',
    COLD: '#3b82f6',
};

const treatmentStatusColors: Record<string, string> = {
    TRAITE: '#10b981',
    NON_TRAITE: '#f59e0b',
};

export function LeadsReport({ data }: LeadsReportProps) {
    const { t } = useTranslation();

    if (!data || !data.byAiQualification) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-muted-foreground">
                    {t('reports.noData')}
                </div>
            </div>
        );
    }

    const {
        summary,
        byAiQualification,
        byQualificationResult,
        byTreatmentStatus,
        byInstance,
        leadsOverTime,
    } = data;

    const aiQualData = Object.entries(byAiQualification).map(
        ([name, value]) => ({
            name:
                name === 'QUALIFIE'
                    ? t('reports.leads.status.qualified')
                    : name === 'NON_QUALIFIE'
                      ? t('reports.leads.status.notQualified')
                      : name,
            value,
            color: aiQualificationColors[name] || getChartColor(1),
        }),
    );

    const qualResultData = Object.entries(byQualificationResult).map(
        ([name, value]) => ({
            name,
            value,
            color: qualificationResultColors[name] || getChartColor(1),
        }),
    );

    const treatmentData = Object.entries(byTreatmentStatus).map(
        ([name, value]) => ({
            name:
                name === 'TRAITE'
                    ? t('reports.leads.status.treated')
                    : name === 'NON_TRAITE'
                      ? t('reports.leads.status.notTreated')
                      : name,
            value,
            color: treatmentStatusColors[name] || getChartColor(1),
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
                    color="orange"
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
                    color="purple"
                />
                <SummaryCard
                    title={t('reports.leads.summary.avgPerDay')}
                    value={summary.avgPerDay}
                    icon={BarChart3}
                    description={t('reports.leads.summary.last30DaysDesc')}
                    color="blue"
                />
            </div>

            {/* Leads Over Time - Area Chart */}
            {leadsOverTime.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm md:text-base">
                            {t('reports.leads.charts.leadsOverTime')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={leadsOverTime}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-muted"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#f97316"
                                    fill="#fed7aa"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Charts Row - 3 Pie Charts */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Pie Chart - AI Qualification Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <Flame className="h-4 w-4 text-purple-500" />
                            {t('reports.leads.charts.aiQualification')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {aiQualData.length > 0 &&
                        aiQualData.some((d) => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={aiQualData.filter(
                                            (d) => d.value > 0,
                                        )}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }: { name?: string; percent?: number }) =>
                                            `${name ?? ''} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                    >
                                        {aiQualData
                                            .filter((d) => d.value > 0)
                                            .map((entry, index) => (
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
                            <div className="flex h-48 items-center justify-center text-muted-foreground">
                                {t('reports.noData')}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pie Chart - Qualification Result */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <Flame className="h-4 w-4 text-red-500" />
                            {t('reports.leads.charts.qualificationResult')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {qualResultData.length > 0 &&
                        qualResultData.some((d) => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={qualResultData.filter(
                                            (d) => d.value > 0,
                                        )}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }: { name?: string; percent?: number }) =>
                                            `${name ?? ''} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                    >
                                        {qualResultData
                                            .filter((d) => d.value > 0)
                                            .map((entry, index) => (
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
                            <div className="flex h-48 items-center justify-center text-muted-foreground">
                                {t('reports.noData')}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pie Chart - Treatment Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            {t('reports.leads.charts.treatmentStatus')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {treatmentData.length > 0 &&
                        treatmentData.some((d) => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={treatmentData.filter(
                                            (d) => d.value > 0,
                                        )}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }: { name?: string; percent?: number }) =>
                                            `${name ?? ''} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                    >
                                        {treatmentData
                                            .filter((d) => d.value > 0)
                                            .map((entry, index) => (
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
                            <div className="flex h-48 items-center justify-center text-muted-foreground">
                                {t('reports.noData')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bar Chart - By Instance */}
            {instanceData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm md:text-base">
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

        </div>
    );
}
