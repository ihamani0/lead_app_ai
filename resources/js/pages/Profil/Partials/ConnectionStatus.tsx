// resources/js/Pages/Instances/Partials/ConnectionStatus.tsx
import { motion } from 'framer-motion';
import { CheckCircle, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    phoneNumber?: string | null;
    onDisconnect: () => void;
}

export function ConnectionStatus({ phoneNumber, onDisconnect }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-lg transition-all hover:shadow-xl dark:border-emerald-500/20 dark:from-emerald-950/30 dark:to-background"
        >
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 shadow-inner ring-2 ring-emerald-200/50 dark:bg-emerald-900/30 dark:ring-emerald-700/30">
                        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
                            Connected & Ready
                        </h3>
                        <p className="mt-1 text-emerald-700/80 dark:text-emerald-400/80">
                            {phoneNumber ? (
                                <span className="flex items-center gap-2">
                                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                    Linked to +{phoneNumber}
                                </span>
                            ) : (
                                'WhatsApp is active and ready for automation'
                            )}
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={onDisconnect}
                    className="h-11 w-full border-red-200 bg-white/80 text-red-600 backdrop-blur-sm transition-all hover:scale-105 hover:bg-red-50 hover:text-red-700 hover:shadow-lg md:w-auto dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                    <Power className="mr-2 h-4 w-4" />
                    Disconnect
                </Button>
            </div>

            {/* Animated background elements */}
            <div className="absolute -top-8 -right-8 h-32 w-32 animate-pulse rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-emerald-400/5 blur-2xl" />
        </motion.div>
    );
}
