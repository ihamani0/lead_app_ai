// src/components/dashboard/instance-status-chart.tsx
import type { ApexOptions } from 'apexcharts';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { getBaseChartOptions } from '@/lib/chart-theme';

interface InstanceStatusChartProps {
    connected: number;
    disconnected: number;
    total: number;
}

export function InstanceStatusChart({
    connected,
    disconnected,
    total,
}: InstanceStatusChartProps) {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const chartOptions: ApexOptions = {
        ...getBaseChartOptions(isDark, t('dashboard.instances')),
        chart: {
            ...getBaseChartOptions(isDark).chart,
            type: 'donut',
            height: 200,
        },
        labels: [t('dashboard.connected'), t('dashboard.disconnected')],
        stroke: { colors: [isDark ? '#0f172a' : '#ffffff'], width: 2 },
        plotOptions: {
            pie: {
                ...getBaseChartOptions(isDark).plotOptions!.pie,
                expandOnClick: false,
            },
        },
    };

    const series = [connected, disconnected];

    const connectedPercent =
        total > 0 ? Math.round((connected / total) * 100) : 0;

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold md:text-base lg:text-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {t('dashboard.instanceStatus')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-full">
                        <Chart
                            options={chartOptions}
                            series={series}
                            type="donut"
                            height={200}
                        />
                    </div>

                    <div className="grid w-full grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2.5 dark:bg-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <div>
                                <p className="text-xs text-muted-foreground md:text-sm">
                                    {t('dashboard.connected')}
                                </p>
                                <p className="text-base font-bold text-emerald-600 md:text-lg dark:text-emerald-400">
                                    {connected}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-2.5 dark:bg-rose-500/20">
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                            <div>
                                <p className="text-xs text-muted-foreground md:text-sm">
                                    {t('dashboard.disconnected')}
                                </p>
                                <p className="text-base font-bold text-rose-600 md:text-lg dark:text-rose-400">
                                    {disconnected}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                style={{ width: `${connectedPercent}%` }}
                            />
                        </div>
                        <p className="mt-2 text-center text-xs text-muted-foreground md:text-sm">
                            {connectedPercent}% {t('dashboard.uptime')}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
