import { motion } from 'framer-motion';
import { MessageCircle, Users, Signal, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InstanceStatsGridProps {
    messagesToday: number;
    leadsCount: number;
    connectionQuality: string;
    connectedAt?: string | null;
}

function formatUptime(connectedAt: string | null | undefined): string {
    if (!connectedAt) return '—';
    const diff = Date.now() - new Date(connectedAt).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}j ${hours}h`;
    const mins = Math.floor(diff / 60000);
    if (hours > 0)
        return `${hours}h ${Math.floor((diff % 3600000) / 60000)}min`;
    return `${mins}min`;
}

const qualityConfig: Record<string, { label: string; color: string }> = {
    excellente: {
        label: 'Excellente',
        color: 'text-emerald-600 dark:text-emerald-400',
    },
    bonne: { label: 'Bonne', color: 'text-blue-600 dark:text-blue-400' },
    moyenne: { label: 'Moyenne', color: 'text-amber-600 dark:text-amber-400' },
    faible: { label: 'Faible', color: 'text-red-600 dark:text-red-400' },
};

const stats = [
    {
        key: 'messages',
        icon: MessageCircle,
        label: "Messages aujourd'hui",
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400',
    },
    {
        key: 'leads',
        icon: Users,
        label: 'Leads générés',
        color: 'text-purple-600 bg-purple-100 dark:bg-purple-950 dark:text-purple-400',
    },
    {
        key: 'quality',
        icon: Signal,
        label: 'Qualité connexion',
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
        key: 'uptime',
        icon: Clock,
        label: 'Temps de connexion',
        color: 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-400',
    },
];

export function InstanceStatsGrid({
    messagesToday,
    leadsCount,
    connectionQuality,
    connectedAt,
}: InstanceStatsGridProps) {
    const quality = qualityConfig[connectionQuality] ?? qualityConfig.faible;

    const values: Record<string, { value: string; extra?: string }> = {
        messages: { value: String(messagesToday) },
        leads: { value: String(leadsCount) },
        quality: { value: quality.label, extra: quality.color },
        uptime: { value: formatUptime(connectedAt) },
    };

    return (
        <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => {
                const val = values[stat.key];
                return (
                    <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Card className="border bg-card shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        <p
                                            className={cn(
                                                'text-xl font-bold text-foreground',
                                                val.extra,
                                            )}
                                        >
                                            {val.value}
                                        </p>
                                    </div>
                                    <div
                                        className={cn(
                                            'rounded-lg p-2',
                                            stat.color,
                                        )}
                                    >
                                        <stat.icon className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
