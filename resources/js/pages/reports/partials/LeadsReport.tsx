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
    } = data;

    const aiQualData = Object.entries(byAiQualification).map(
        ([name, value]) => ({
            name:
                name === 'QUALIFIE'
                    ? 'Qualifié'
                    : name === 'NON_QUALIFIE'
                      ? 'Non qualifié'
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
                    ? 'Traité'
                    : name === 'NON_TRAITE'
                      ? 'Non traité'
                      : name,
            value,
            color: treatmentStatusColors[name] || getChartColor(1),
        }),
    );

    const instanceData = Object.entries(byInstance).map(([name, value]) => ({
        name,
        value,
    }));

    const totalAiQual = Object.values(byAiQualification).reduce(
        (acc, val) => acc + val,
        0,
    );
    const totalQualResult = Object.values(byQualificationResult).reduce(
        (acc, val) => acc + val,
        0,
    );
    const totalTreatment = Object.values(byTreatmentStatus).reduce(
        (acc, val) => acc + val,
        0,
    );

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

            {/* Charts Row - 3 Pie Charts */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Pie Chart - AI Qualification Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <Flame className="h-4 w-4 text-purple-500" />
                            Statut Qualification IA
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
                                        label={({ name, percent }: any) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
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
                                Aucune donnée
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pie Chart - Qualification Result */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <Flame className="h-4 w-4 text-red-500" />
                            Résultat Qualification
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
                                        label={({ name, percent }: any) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
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
                                Aucune donnée
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pie Chart - Treatment Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Statut Traitement
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
                                        label={({ name, percent }: any) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
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
                                Aucune donnée
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

            {/* Detail Cards Grid - Progress Bars */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* AI Qualification Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm md:text-base">
                            Qualification IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(byAiQualification).map(
                                ([status, count]) => (
                                    <div
                                        key={status}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-3 w-3 rounded-full ${
                                                    status === 'QUALIFIE'
                                                        ? 'bg-green-500'
                                                        : 'bg-slate-400'
                                                }`}
                                            />
                                            <span className="font-medium">
                                                {status === 'QUALIFIE'
                                                    ? 'Qualifié'
                                                    : status === 'NON_QUALIFIE'
                                                      ? 'Non qualifié'
                                                      : status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress
                                                value={calculatePercentage(
                                                    count,
                                                    totalAiQual,
                                                )}
                                                className="w-24"
                                            />
                                            <span className="w-12 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Qualification Result Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm md:text-base">
                            Résultat Qualification
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(byQualificationResult).map(
                                ([status, count]) => (
                                    <div
                                        key={status}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-3 w-3 rounded-full ${
                                                    status === 'HOT'
                                                        ? 'bg-red-500'
                                                        : status === 'WARM'
                                                          ? 'bg-orange-500'
                                                          : 'bg-blue-500'
                                                }`}
                                            />
                                            <span className="font-medium">
                                                {status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress
                                                value={calculatePercentage(
                                                    count,
                                                    totalQualResult,
                                                )}
                                                className="w-24"
                                            />
                                            <span className="w-12 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Treatment Status Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm md:text-base">
                            Statut Traitement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(byTreatmentStatus).map(
                                ([status, count]) => (
                                    <div
                                        key={status}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-3 w-3 rounded-full ${
                                                    status === 'TRAITE'
                                                        ? 'bg-emerald-500'
                                                        : 'bg-amber-500'
                                                }`}
                                            />
                                            <span className="font-medium">
                                                {status === 'TRAITE'
                                                    ? 'Traité'
                                                    : status === 'NON_TRAITE'
                                                      ? 'Non traité'
                                                      : status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress
                                                value={calculatePercentage(
                                                    count,
                                                    totalTreatment,
                                                )}
                                                className="w-24"
                                            />
                                            <span className="w-12 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
