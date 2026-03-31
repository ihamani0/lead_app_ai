// src/components/dashboard/lead-activity-timeline.tsx
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

interface LeadActivityTimelineProps {
    recent: number;
    today: number;
    total: number;
}

export function LeadActivityTimeline({
    recent,
    today,
    total,
}: LeadActivityTimelineProps) {
    const { t } = useTranslation();

    const metrics = [
        { label: t('dashboard.newThisWeek'), value: recent, icon: TrendingUp },
        { label: t('dashboard.newToday'), value: today, icon: Clock },
        { label: t('dashboard.totalLeads'), value: total, icon: null },
    ];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {t('dashboard.leadActivity')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="space-y-3">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="flex items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <div className="flex items-center gap-3">
                                {metric.icon && (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-foreground">
                                    {metric.label}
                                </span>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                {metric.value}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
