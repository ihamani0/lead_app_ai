import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
    direction: 'client' | 'ai';
    message: string;
    timestamp: string;
    isConsecutive?: boolean;
    type?: string;
    mediaUrl?: string | null;
    metadata?: Record<string, unknown> | null;
    children?: ReactNode;
}

export const ChatBubble: FC<ChatBubbleProps> = ({
    direction,
    message,
    timestamp,
    isConsecutive = false,
    type,
    mediaUrl,
    metadata,
    children,
}) => {
    const isClient = direction === 'client';

    const formatTime = (ts: string) => {
        return new Date(ts).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderMedia = () => {
        if (!mediaUrl) return null;

        switch (type) {
            case 'image':
                return (
                    <img
                        src={mediaUrl}
                        alt="image"
                        className="mb-1 max-w-full rounded-lg"
                        loading="lazy"
                    />
                );
            case 'video':
                return (
                    <video
                        src={mediaUrl}
                        controls
                        className="mb-1 max-w-full rounded-lg"
                    />
                );
            case 'audio':
                return (
                    <audio
                        src={mediaUrl}
                        controls
                        className="mb-1 w-full"
                    />
                );
            case 'document':
                return (
                    <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-1 flex items-center gap-2 rounded-lg border p-2 text-sm text-blue-600 hover:underline"
                    >
                        <svg
                            className="h-5 w-5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <span className="truncate">
                            {typeof metadata?.fileName === 'string'
                                ? metadata.fileName
                                : mediaUrl.split('/').pop() || 'Document'}
                        </span>
                    </a>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={cn(
                'flex',
                isClient ? 'justify-end' : 'justify-start',
                !isConsecutive && 'mt-2',
            )}
        >
            <div
                className={cn(
                    'relative max-w-[75%] px-3 py-2 text-sm shadow-sm',
                    isClient
                        ? 'rounded-[12px_0_12px_12px] bg-[#DCF8C6] dark:bg-[#005C4B]'
                        : 'rounded-[0_12px_12px_12px] bg-white dark:bg-gray-800',
                    (children || mediaUrl) && 'pb-1',
                )}
            >
                {renderMedia()}
                {message && <p className="whitespace-pre-wrap">{message}</p>}
                {children}
                <div
                    className={cn(
                        'mt-1 flex items-center justify-end gap-1',
                        isClient
                            ? 'text-[10px] text-gray-500 dark:text-gray-400'
                            : 'text-[10px] text-gray-400 dark:text-gray-500',
                    )}
                >
                    <span>{formatTime(timestamp)}</span>
                    {isClient && (
                        <svg
                            viewBox="0 0 16 11"
                            className="h-3 w-4 fill-current text-blue-500 dark:text-blue-400"
                        >
                            <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.667a.463.463 0 0 0-.366-.2.457.457 0 0 0-.394.228.527.527 0 0 0 .062.578l2.4 3.18c.1.133.241.2.422.2a.498.498 0 0 0 .382-.178l6.38-7.88a.535.535 0 0 0 .076-.569.472.472 0 0 0-.076-.404z" />
                            <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.667a.463.463 0 0 0-.366-.2.457.457 0 0 0-.394.228.527.527 0 0 0 .062.578l2.4 3.18c.1.133.241.2.422.2a.498.498 0 0 0 .382-.178l6.38-7.88a.535.535 0 0 0 .076-.569.472.472 0 0 0-.076-.404z" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};
