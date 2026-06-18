import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle } from 'lucide-react';

interface ConnectedBannerProps {
    phoneNumber?: string | null;
    messagesToday: number;
    lastConnectedAt?: string | null;
}

export function ConnectedBanner({
    phoneNumber,
    messagesToday,
    lastConnectedAt,
}: ConnectedBannerProps) {
    const formatDate = (date: string | null | undefined) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-linear-to-br from-emerald-50/80 to-white p-6 shadow-lg dark:border-emerald-500/20 dark:from-emerald-950/30 dark:to-background"
        >
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 shadow-inner ring-2 ring-emerald-200/50 dark:bg-emerald-900/30 dark:ring-emerald-700/30">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">
                            Connecté et prêt
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            {phoneNumber ? `+${phoneNumber}` : 'WhatsApp actif'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1.5 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium">
                            {messagesToday} aujourd'hui
                        </span>
                    </div>
                    {lastConnectedAt && (
                        <span className="text-xs text-emerald-600/70 dark:text-emerald-500/70">
                            Connecté le {formatDate(lastConnectedAt)}
                        </span>
                    )}
                </div>
            </div>

            <div className="absolute -top-8 -right-8 h-32 w-32 animate-pulse rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-emerald-400/5 blur-2xl" />
        </motion.div>
    );
}
