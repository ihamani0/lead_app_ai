import { Bot, Pause, Play } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import type { BotSession } from '@/types';

interface BotSessionManagerProps {
    session: BotSession | null;
    onPause: () => void;
    onResume: () => void;
    loading?: boolean;
}

export const BotSessionManager: FC<BotSessionManagerProps> = ({
    session,
    onPause,
    onResume,
    loading,
}) => {
    const noSession = !session;
    const isOpened = session?.status === 'opened';
    const isPaused = session?.status === 'paused';

    return (
        <div
            className={`flex items-center justify-between border-b px-4 py-2 text-xs ${
                isOpened
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : isPaused
                      ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-400'
                      : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
            }`}
        >
            <div className="flex items-center gap-2">
                <Bot className="h-3.5 w-3.5" />
                <span>
                    {isOpened
                        ? 'Bot actif — Gère la conversation automatiquement'
                        : isPaused
                          ? 'Bot en pause — Vous répondez manuellement'
                          : 'Aucune session bot active'}
                </span>
            </div>
            <div className="flex items-center gap-1">
                {isOpened && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={onPause}
                        disabled={loading}
                    >
                        <Pause className="h-3 w-3" />
                        Pause
                    </Button>
                )}
                {isPaused && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={onResume}
                        disabled={loading}
                    >
                        <Play className="h-3 w-3" />
                        Reprendre
                    </Button>
                )}
                {noSession && (
                    <span className="text-[11px] italic opacity-60">Aucune action disponible</span>
                )}
            </div>
        </div>
    );
};
