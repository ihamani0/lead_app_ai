// src/components/dashboard/leads-by-status-list.tsx
import { Users } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface LeadsByStatusListProps {
    byStatus: Record<string, number>;
    className?: string;
}

const statusConfig: Record<string, { labelKey: string; color: string }> = {
    NEW: {
        labelKey: 'dashboard.status.new',
        color: 'bg-blue-500 dark:bg-blue-600',
    },
    CONTACTED: {
        labelKey: 'dashboard.status.contacted',
        color: 'bg-amber-400 dark:bg-amber-500',
    },
    QUALIFIED: {
        labelKey: 'dashboard.status.qualified',
        color: 'bg-indigo-500 dark:bg-indigo-600',
    },
    CONVERTED: {
        labelKey: 'dashboard.status.converted',
        color: 'bg-emerald-500 dark:bg-emerald-600',
    },
    LOST: {
        labelKey: 'dashboard.status.lost',
        color: 'bg-rose-500 dark:bg-rose-600',
    },
    QUALIFYING: {
        labelKey: 'dashboard.status.qualifying',
        color: 'bg-purple-500 dark:bg-purple-600',
    },
    IN_PROGRESS: {
        labelKey: 'dashboard.status.inProgress',
        color: 'bg-orange-500 dark:bg-orange-600',
    },
};

export function LeadsByStatusChart({
    byStatus,
    className,
}: LeadsByStatusListProps) {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const total = useMemo(
        () => Object.values(byStatus).reduce((sum, val) => sum + val, 0),
        [byStatus],
    );

    if (Object.keys(byStatus).length === 0) {
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
                <CardTitle className="flex items-center justify-between text-sm font-semibold md:text-base lg:text-lg">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {t('dashboard.leadsByStatus')}
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-muted-foreground md:text-sm dark:bg-slate-800">
                        {total} {t('dashboard.totalLeads').toLowerCase()}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="space-y-3">
                    {Object.entries(byStatus).map(([status, count]) => {
                        const config = statusConfig[status] || {
                            labelKey: `dashboard.status.${status.toLowerCase()}`,
                            color: 'bg-slate-500 dark:bg-slate-600',
                        };
                        const percentage =
                            total > 0 ? (count / total) * 100 : 0;
                        const label = t(config.labelKey) || status;

                        return (
                            <div
                                key={status}
                                className="group relative"
                                // Native tooltip with perfect theme support
                                title={`${label}: ${count} (${percentage.toFixed(1)}%)`}
                            >
                                <div className="mb-1.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={cn(
                                                'h-2.5 w-2.5 rounded-full ring-2 ring-white transition-transform group-hover:scale-110 dark:ring-slate-950',
                                                config.color,
                                            )}
                                        />
                                        <span className="text-xs font-medium text-foreground transition-colors group-hover:text-primary md:text-sm">
                                            {label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 text-right text-sm font-bold text-foreground md:text-base">
                                            {count}
                                        </span>
                                        <span className="w-10 text-right text-xs text-muted-foreground">
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar with smooth animation */}
                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className={cn(
                                            'absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out',
                                            config.color,
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    />
                                    {/* Subtle shine effect on hover */}
                                    <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
