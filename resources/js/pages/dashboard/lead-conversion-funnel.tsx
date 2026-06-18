import { ArrowDown, Users, Sparkles, Flame, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LeadConversionFunnelProps {
    byAiQualification: Record<string, number>;
    byQualificationResult: Record<string, number>;
    byTreatmentStatus: Record<string, number>;
    total: number;
    recent: number;
    today: number;
}

function FunnelStage({
    icon: Icon,
    label,
    current,
    previous,
    color,
}: {
    icon: typeof Users;
    label: string;
    current: number;
    previous: number;
    color: string;
}) {
    const pct = previous > 0 ? Math.round((current / previous) * 100) : 0;
    const dropOff = previous - current;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <Icon className={cn('h-3.5 w-3.5', color)} />
                <span className="text-xs font-medium text-foreground">
                    {label}
                </span>
            </div>

            <div className="relative">
                <div
                    className={cn(
                        'flex h-8 items-center justify-between rounded-lg px-3 text-sm font-semibold',
                        color.includes('text-emerald')
                            ? 'bg-emerald-100 dark:bg-emerald-900/40'
                            : color.includes('text-violet')
                              ? 'bg-violet-100 dark:bg-violet-900/40'
                              : color.includes('text-orange')
                                ? 'bg-orange-100 dark:bg-orange-900/40'
                                : color.includes('text-rose')
                                  ? 'bg-rose-100 dark:bg-rose-900/40'
                                  : color.includes('text-blue')
                                    ? 'bg-blue-100 dark:bg-blue-900/40'
                                    : 'bg-slate-100 dark:bg-slate-800',
                    )}
                >
                    <span>{current}</span>
                    <span className={cn('text-xs font-normal', color)}>
                        {pct}%
                    </span>
                </div>
            </div>

            {dropOff > 0 && (
                <p className="pl-1 text-[10px] text-muted-foreground">
                    -{dropOff} perdu{dropOff > 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
}

export function LeadConversionFunnel({
    byAiQualification,
    byQualificationResult,
    byTreatmentStatus,
    total,
    recent,
    today,
}: LeadConversionFunnelProps) {
    const qualified = byAiQualification['QUALIFIE'] ?? 0;
    const hot = byQualificationResult['HOT'] ?? 0;
    const warm = byQualificationResult['WARM'] ?? 0;
    const cold = byQualificationResult['COLD'] ?? 0;
    const treated = byTreatmentStatus['TRAITE'] ?? 0;

    const hasData = total > 0;

    return (
        <Card className="col-span-full md:col-span-2">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Flame className="h-4 w-4 text-muted-foreground" />
                    Entonnoir de qualification
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
                {!hasData ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">
                            Aucune donnée de qualification
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                {today} aujourd'hui
                            </span>
                            <span>{recent} cette semaine</span>
                        </div>

                        <div className="space-y-3">
                            <FunnelStage
                                icon={Users}
                                label="Total leads"
                                current={total}
                                previous={total}
                                color="text-slate-600 dark:text-slate-400"
                            />

                            <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground" />

                            <FunnelStage
                                icon={Sparkles}
                                label="Qualifiés IA"
                                current={qualified}
                                previous={total}
                                color="text-violet-600 dark:text-violet-400"
                            />

                            <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground" />

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                                    <span className="text-xs font-medium text-foreground">
                                        Résultat qualification
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {
                                            key: 'HOT',
                                            value: hot,
                                            color: 'text-rose-600 dark:text-rose-400',
                                        },
                                        {
                                            key: 'WARM',
                                            value: warm,
                                            color: 'text-orange-600 dark:text-orange-400',
                                        },
                                        {
                                            key: 'COLD',
                                            value: cold,
                                            color: 'text-blue-600 dark:text-blue-400',
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.key}
                                            className={cn(
                                                'flex flex-col items-center rounded-lg px-1 py-2',
                                                item.key === 'HOT'
                                                    ? 'bg-rose-50 dark:bg-rose-950/30'
                                                    : item.key === 'WARM'
                                                      ? 'bg-orange-50 dark:bg-orange-950/30'
                                                      : 'bg-blue-50 dark:bg-blue-950/30',
                                            )}
                                        >
                                            <span className="text-lg font-bold text-foreground">
                                                {item.value}
                                            </span>
                                            <span
                                                className={cn(
                                                    'text-xs font-medium',
                                                    item.color,
                                                )}
                                            >
                                                {item.key}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground" />

                            <FunnelStage
                                icon={CheckCircle}
                                label="Traités"
                                current={treated}
                                previous={qualified || total}
                                color="text-emerald-600 dark:text-emerald-400"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
