// src/components/dashboard/leads-by-temperature.tsx
import { Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface LeadsByTemperatureProps {
    byTemperature: Record<string, number>;
}

const temperatureConfig: Record<
    string,
    {
        bg: string;
        text: string;
        border: string;
        icon: React.ReactNode;
    }
> = {
    HOT: {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30 dark:border-rose-500/40',
        icon: <span className="text-lg">🔥</span>,
    },
    WARM: {
        bg: 'bg-orange-500/10 dark:bg-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/30 dark:border-orange-500/40',
        icon: <span className="text-lg">☀️</span>,
    },
    COLD: {
        bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
        text: 'text-cyan-600 dark:text-cyan-400',
        border: 'border-cyan-500/30 dark:border-cyan-500/40',
        icon: <span className="text-lg">❄️</span>,
    },
};

export function LeadsByTemperature({ byTemperature }: LeadsByTemperatureProps) {
    const { t } = useTranslation();

    if (Object.keys(byTemperature).length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    {t('dashboard.byTemperature')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="grid grid-cols-3 gap-3">
                    {Object.entries(byTemperature).map(([temp, count]) => {
                        const config = temperatureConfig[temp] || {
                            bg: 'bg-slate-500/10 dark:bg-slate-500/20',
                            text: 'text-slate-600 dark:text-slate-400',
                            border: 'border-slate-500/30',
                            icon: <span className="text-lg">📊</span>,
                        };

                        return (
                            <div
                                key={temp}
                                className={cn(
                                    'flex flex-col items-center justify-center rounded-xl border p-3 transition-all hover:shadow-md',
                                    config.bg,
                                    config.border,
                                )}
                            >
                                <div className="mb-1">{config.icon}</div>
                                <div
                                    className={cn(
                                        'text-xl font-bold',
                                        config.text,
                                    )}
                                >
                                    {count}
                                </div>
                                <div className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                    {t(
                                        `dashboard.temperature.${temp.toLowerCase()}`,
                                    ) || temp}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
