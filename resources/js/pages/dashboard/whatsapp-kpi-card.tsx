import { Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WhatsAppKpiCardProps {
    connected: number;
    disconnected: number;
    total: number;
}

export function WhatsAppKpiCard({
    connected,
    disconnected,
    total,
}: WhatsAppKpiCardProps) {
    const connectedPercent =
        total > 0 ? Math.round((connected / total) * 100) : 0;

    return (
        <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-wide text-muted-foreground">
                    WhatsApp
                </h3>
                <div className="flex items-center justify-center rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Phone className="h-8 w-8" />
                </div>
            </div>

            <div className="mb-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                    {connected}
                </span>
                <span className="text-xl text-muted-foreground">/ {total}</span>
                <span className="ml-1 text-sm text-muted-foreground">
                    connectés
                </span>
            </div>

            <Progress
                value={connectedPercent}
                className="h-1.5 [&>div]:bg-emerald-500"
            />

            <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {connectedPercent}% en ligne
                </span>
                {disconnected > 0 && (
                    <span className="font-medium text-rose-600 dark:text-rose-400">
                        {disconnected} déconnecté{disconnected > 1 ? 's' : ''}
                    </span>
                )}
            </div>
        </Card>
    );
}
