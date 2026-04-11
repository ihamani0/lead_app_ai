import { Users, Flame, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface LeadsByStatusListProps {
    byAiQualification: Record<string, number>;
    byQualificationResult: Record<string, number>;
    byTreatmentStatus: Record<string, number>;
    className?: string;
}

const aiQualificationConfig: Record<string, { label: string; color: string }> =
    {
        QUALIFIE: {
            label: 'Qualifié',
            color: 'bg-green-500 dark:bg-green-600',
        },
        NON_QUALIFIE: {
            label: 'Non qualifié',
            color: 'bg-slate-400 dark:bg-slate-600',
        },
    };

const qualificationResultConfig: Record<
    string,
    { label: string; color: string }
> = {
    HOT: { label: 'Hot', color: 'bg-red-500 dark:bg-red-600' },
    WARM: { label: 'Warm', color: 'bg-orange-500 dark:bg-orange-600' },
    COLD: { label: 'Cold', color: 'bg-blue-500 dark:bg-blue-600' },
};

const treatmentStatusConfig: Record<string, { label: string; color: string }> =
    {
        TRAITE: {
            label: 'Traité',
            color: 'bg-emerald-500 dark:bg-emerald-600',
        },
        NON_TRAITE: {
            label: 'Non traité',
            color: 'bg-amber-500 dark:bg-amber-600',
        },
    };

function StatusBar({
    data,
    config,
    total,
    label,
}: {
    data: Record<string, number>;
    config: Record<string, { label: string; color: string }>;
    total: number;
    label: string;
}) {
    const entries = Object.entries(data).filter(([, count]) => count > 0);

    if (entries.length === 0) {
        return (
            <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <p className="text-center text-sm text-muted-foreground">
                    Aucune donnée
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map(([key, count]) => {
                const itemConfig = config[key] || {
                    label: key,
                    color: 'bg-slate-500',
                };
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                    <div
                        key={key}
                        className="group relative"
                        title={`${itemConfig.label}: ${count} (${percentage.toFixed(1)}%)`}
                    >
                        <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'h-2 w-2 rounded-full',
                                        itemConfig.color,
                                    )}
                                />
                                <span className="text-xs font-medium text-foreground">
                                    {itemConfig.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground">
                                    {count}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className={cn(
                                    'absolute top-0 left-0 h-full rounded-full',
                                    itemConfig.color,
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function LeadsByStatusChart({
    byAiQualification,
    byQualificationResult,
    byTreatmentStatus,
    className,
}: LeadsByStatusListProps) {
    const { t } = useTranslation();

    const totalAiQual = useMemo(
        () =>
            Object.values(byAiQualification).reduce((sum, val) => sum + val, 0),
        [byAiQualification],
    );
    const totalQualResult = useMemo(
        () =>
            Object.values(byQualificationResult).reduce(
                (sum, val) => sum + val,
                0,
            ),
        [byQualificationResult],
    );
    const totalTreatStatus = useMemo(
        () =>
            Object.values(byTreatmentStatus).reduce((sum, val) => sum + val, 0),
        [byTreatmentStatus],
    );

    const hasAnyData =
        totalAiQual > 0 || totalQualResult > 0 || totalTreatStatus > 0;

    if (!hasAnyData) {
        return (
            <Card className={cn('col-span-full md:col-span-1', className)}>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold md:text-base lg:text-lg">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {t('dashboard.leadsByStatus')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                        <p className="px-4 text-center text-sm text-muted-foreground">
                            {t('dashboard.noLeads')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn('col-span-full md:col-span-1', className)}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold md:text-base lg:text-lg">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {t('dashboard.leadsByStatus')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="space-y-6">
                    {/* AI Qualification Status */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Flame className="h-3.5 w-3.5 text-purple-500" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                Statut qualification IA
                            </span>
                        </div>
                        <StatusBar
                            data={byAiQualification}
                            config={aiQualificationConfig}
                            total={totalAiQual}
                            label="IA"
                        />
                    </div>

                    {/* Qualification Result */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Flame className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                Résultat qualification
                            </span>
                        </div>
                        <StatusBar
                            data={byQualificationResult}
                            config={qualificationResultConfig}
                            total={totalQualResult}
                            label="Résultat"
                        />
                    </div>

                    {/* Treatment Status */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                Statut traitement
                            </span>
                        </div>
                        <StatusBar
                            data={byTreatmentStatus}
                            config={treatmentStatusConfig}
                            total={totalTreatStatus}
                            label="Traitement"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
