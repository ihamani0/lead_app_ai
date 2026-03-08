// resources/js/Pages/Instances/Partials/InstanceStats.tsx
import { motion } from 'framer-motion';
import { Activity, Server, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    status: string;
    provider: string;
    platform: string;
    lastSynced?: string;
}

export function InstanceStats({
    status,
    provider,
    platform,
}: Props) {
    const stats = [
        {
            icon: Activity,
            label: 'Status',
            value: status.charAt(0).toUpperCase() + status.slice(1),
            color:
                status === 'connected'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400',
            bgColor:
                status === 'connected'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30'
                    : 'bg-amber-50 dark:bg-amber-950/30',
        },
        {
            icon: Server,
            label: 'Provider',
            value: provider,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            icon: MessageCircle,
            label: 'Platform',
            value: platform,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="group overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-slate-900/80">
                        <CardHeader className="pb-3">
                            <div
                                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}
                            >
                                <stat.icon
                                    className={`h-5 w-5 ${stat.color}`}
                                />
                            </div>
                            <CardTitle className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
