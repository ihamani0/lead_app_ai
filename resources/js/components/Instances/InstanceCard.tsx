import { Link, router } from '@inertiajs/react';
import { Phone, PowerOff, Settings2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Make sure you have the shadcn utils
import { destroy } from '@/routes/instances';
import { show } from '@/routes/profile';
import type { EvolutionInstance } from '@/types';

interface InstanceCardProps {
    instance: EvolutionInstance;
}

export default function InstanceCard({ instance }: InstanceCardProps) {
    const displayName =
        instance.instance_name.split('-').slice(1, -1).join(' ') ||
        instance.instance_name;

    const isConnected = instance.status === 'connected';
    const isConnecting = instance.status === 'connecting';
    const isDisconnected = instance.status === 'disconnected'

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation(); // Stop event bubbling

        if (confirm('Are you sure you want to delete this instance?')) {
            router.delete(destroy({ id: instance.id }).url, {
                preserveScroll: true,
            });
        }
    };



    const statusStyles = {
        connected: {
            border: 'border-emerald-200 dark:border-emerald-900/30',
            gradient: 'from-emerald-500/0 to-teal-500/0 dark:from-emerald-400/5 dark:to-teal-400/5',
            bar: 'bg-emerald-500',
            glow: 'group-hover:bg-emerald-500/5 dark:group-hover:bg-emerald-400/10',
            indicator: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
            text: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        connecting: {
            border: 'border-amber-200 dark:border-amber-900/30',
            gradient: 'from-amber-500/0 to-orange-500/0 dark:from-amber-400/5 dark:to-orange-400/5',
            bar: 'bg-amber-500',
            glow: 'group-hover:bg-amber-500/5 dark:group-hover:bg-amber-400/10',
            indicator: 'animate-pulse bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
            text: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-50 dark:bg-amber-500/10',
            iconColor: 'text-amber-600 dark:text-amber-400',
        },
        disconnected: {
            border: 'border-red-200 dark:border-red-900/30',
            gradient: 'from-red-500/0 to-rose-500/0 dark:from-red-400/5 dark:to-rose-400/5',
            bar: 'bg-red-500',
            glow: 'group-hover:bg-red-500/5 dark:group-hover:bg-red-400/10',
            indicator: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
            text: 'text-red-600 dark:text-red-400',
            iconBg: 'bg-red-50 dark:bg-red-500/10',
            iconColor: 'text-red-600 dark:text-red-400',
        },
    };

    const currentStyle = isConnected 
        ? statusStyles.connected 
        : isConnecting 
        ? statusStyles.connecting 
        : statusStyles.disconnected;


    return (
        <Link href={show({ id: instance.id })}>
            <Card
                className={cn(
                    'group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl',
                    'bg-white dark:bg-linear-to-br dark:from-slate-900 dark:to-slate-800/90 dark:backdrop-blur-xl',
                    'border-2',
                    currentStyle.border
                )}
            >
                {/* Background gradient overlay */}
                <div className={cn(
                    'absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    currentStyle.gradient
                )} />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-100 hover:text-red-600 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
                        title="Delete instance"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Visual indicator bar */}
                <div className={cn('h-1.5 w-full', currentStyle.bar)} />

                <CardHeader className="relative flex flex-row items-start justify-between space-y-0 px-6 pt-6">
                    <div className="flex flex-col gap-1">
                        <CardTitle className={cn(
                            'text-xl font-black tracking-tight transition-colors',
                            isConnected 
                                ? 'text-slate-900 group-hover:text-emerald-600 dark:text-slate-50 dark:group-hover:text-emerald-400'
                                : isConnecting
                                ? 'text-slate-900 group-hover:text-amber-600 dark:text-slate-50 dark:group-hover:text-amber-400'
                                : 'text-slate-900 group-hover:text-red-600 dark:text-slate-50 dark:group-hover:text-red-400'
                        )}>
                            {displayName}
                        </CardTitle>
                        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                            Node
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <div className={cn('h-2.5 w-2.5 rounded-full', currentStyle.indicator)} />
                        <span className={cn('text-[10px] font-black tracking-widest uppercase', currentStyle.text)}>
                            {instance.status}
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="relative px-6 pb-6">
                    {/* Phone Number Section */}
                    <div className={cn(
                        'mt-4 flex items-center gap-4 rounded-xl p-4',
                        'bg-slate-50 dark:bg-slate-800/50',
                        isDisconnected && 'bg-red-50/50 dark:bg-red-950/20'
                    )}>
                        <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg shadow-sm',
                            'bg-white dark:bg-slate-700',
                            currentStyle.iconBg
                        )}>
                            {isDisconnected ? (
                                <PowerOff className={cn('h-5 w-5', currentStyle.iconColor)} />
                            ) : (
                                <Phone className={cn('h-5 w-5', currentStyle.iconColor)} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase dark:text-slate-500">
                                Linked Number
                            </span>
                            <span className={cn(
                                'text-lg font-black tracking-tight',
                                isDisconnected 
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-slate-700 dark:text-slate-200'
                            )}>
                                {instance.phone_number ? `+${instance.phone_number}` : '--- --- ---'}
                            </span>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase dark:text-slate-500">
                                Deployment
                            </span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                {new Date(instance.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Settings2 className="h-4 w-4" />
                        </div>
                    </div>
                </CardContent>

                {/* Subtle background glow on hover */}
                <div className={cn(
                    'absolute -right-20 -bottom-20 h-40 w-40 rounded-full blur-3xl transition-colors duration-500',
                    currentStyle.glow
                )} />
            </Card>
        </Link>
    );
}
