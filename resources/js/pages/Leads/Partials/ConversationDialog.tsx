import { User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Lead } from '@/types';

interface ConversationDialogProps {
    lead: Lead;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ConversationDialog({
    lead,
    open,
    onOpenChange,
}: ConversationDialogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && scrollRef.current) {
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop =
                        scrollRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [open, lead.recent_messages?.length]);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateSeparator = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
        });
    };

    type MessageItem = {
        direction: 'client' | 'ai';
        message: string;
        timestamp: string;
    };

    const messages: MessageItem[] = lead.recent_messages || [];

    const getDateGroups = () => {
        const groups: { date: string; messages: MessageItem[] }[] = [];
        let currentDate = '';

        messages.forEach((msg) => {
            const msgDate = new Date(msg.timestamp).toDateString();
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({ date: msg.timestamp, messages: [] });
            }
            groups[groups.length - 1].messages.push(msg);
        });

        return groups;
    };

    const isConsecutive = (msgs: MessageItem[], index: number) => {
        if (index === 0) return false;
        return msgs[index].direction === msgs[index - 1].direction;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[85vh] max-w-lg flex-col overflow-hidden border-border p-0">
                <DialogHeader className="shrink-0 border-b bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-foreground">
                                {lead.name}
                            </p>
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Badge
                                    variant="secondary"
                                    className="h-5 px-1.5 text-[10px]"
                                >
                                    WhatsApp
                                </Badge>
                                +{lead.phone}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMGgyMHYxOWgtMjEiIGZpbGw9IiNlNWQ1ZDUiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] dark:bg-[#0b141a]">
                    <div ref={scrollRef} className="flex flex-col p-4">
                        {getDateGroups().map((group, groupIndex) => (
                            <div key={groupIndex} className="space-y-4">
                                <div className="sticky top-0 z-10 flex justify-center py-2">
                                    <span className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-medium backdrop-blur-sm dark:bg-white/10 dark:text-white/70">
                                        {formatDateSeparator(group.date)}
                                    </span>
                                </div>

                                {group.messages.map((msg, msgIndex) => {
                                    const consecutive = isConsecutive(
                                        group.messages,
                                        msgIndex,
                                    );

                                    return (
                                        <div
                                            key={msgIndex}
                                            className={`flex ${
                                                msg.direction === 'client'
                                                    ? 'justify-start'
                                                    : 'justify-end'
                                            } ${consecutive ? 'mt-1' : 'mt-4'}`}
                                        >
                                            <div
                                                className={`group relative max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm transition-all ${
                                                    msg.direction === 'client'
                                                        ? 'rounded-tl-md rounded-tr-xl rounded-br-md rounded-bl-sm bg-white text-foreground hover:shadow-md dark:bg-[#1f2c33] dark:text-[#e9edef]'
                                                        : 'rounded-tl-xl rounded-tr-md rounded-br-sm rounded-bl-md bg-[#d9fdd3] text-foreground hover:shadow-md dark:bg-[#005c4b] dark:text-[#e9edef]'
                                                }`}
                                            >
                                                {consecutive && (
                                                    <div
                                                        className={`absolute -top-3 h-3 w-4 ${
                                                            msg.direction ===
                                                            'client'
                                                                ? '-left-1'
                                                                : '-right-1'
                                                        }`}
                                                    >
                                                        <svg
                                                            viewBox="0 0 16 12"
                                                            className={`h-full w-full ${
                                                                msg.direction ===
                                                                'client'
                                                                    ? 'fill-white dark:fill-[#1f2c33]'
                                                                    : 'fill-[#d9fdd3] dark:fill-[#005c4b]'
                                                            }`}
                                                        >
                                                            <path d="M0 0h16v6c0 2-2 4-4 4H4c-2 0-4-2-4-4V0z" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <p className="text-[14px] leading-relaxed break-words">
                                                    {msg.message}
                                                </p>

                                                <div
                                                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                                        msg.direction ===
                                                        'client'
                                                            ? 'text-[#54656f]'
                                                            : 'text-[#547c58] dark:text-[#7fbc9b]'
                                                    }`}
                                                >
                                                    <span>
                                                        {formatTime(
                                                            msg.timestamp,
                                                        )}
                                                    </span>
                                                    {msg.direction === 'ai' && (
                                                        <span className="flex items-center">
                                                            <svg
                                                                className="h-3 w-3"
                                                                viewBox="0 0 16 11"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M1 1l4 4 4-4 2 2-6 6-6-6 2-2zM10 3l4 4-4 4 2 2 6-6-6-6-2 2z" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>

                                                {!consecutive && (
                                                    <div
                                                        className={`absolute -bottom-3 ${
                                                            msg.direction ===
                                                            'client'
                                                                ? '-left-1'
                                                                : '-right-1'
                                                        }`}
                                                    >
                                                        <svg
                                                            viewBox="0 0 16 12"
                                                            className={`h-3 w-4 ${
                                                                msg.direction ===
                                                                'client'
                                                                    ? 'fill-white dark:fill-[#1f2c33]'
                                                                    : 'fill-[#d9fdd3] dark:fill-[#005c4b]'
                                                            }`}
                                                        >
                                                            <path d="M0 0h16v6c0 2-2 4-4 4H4c-2 0-4-2-4-4V0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {messages.length === 0 && (
                            <div className="flex h-40 flex-col items-center justify-center gap-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    No messages yet
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
