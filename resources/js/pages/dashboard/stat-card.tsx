// src/components/dashboard/stat-card.tsx
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: { value: number; isPositive: boolean };
    description?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    className,
}: StatCardProps) {
    return (
        <Card className={cn('transition-all hover:shadow-md', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground md:text-lg">
                    {title}
                </CardTitle>
                <Icon className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold tracking-tight text-foreground md:text-2xl lg:text-3xl">
                    {value}
                </div>
                {trend && (
                    <div
                        className={cn(
                            'mt-2 flex items-center text-xs font-medium md:text-sm',
                            trend.isPositive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400',
                        )}
                    >
                        {trend.isPositive ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(trend.value)}%
                    </div>
                )}
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground md:text-base">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
