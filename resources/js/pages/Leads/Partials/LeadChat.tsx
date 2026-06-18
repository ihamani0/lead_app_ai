import { useEcho } from '@laravel/echo-react';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { fetchMessages, sendMessage } from '@/lib/api/leadMessages';
import { fetchLeadSession, changeSessionStatus } from '@/lib/api/session';
import { getDateSeparator, groupLeadMessagesByDate } from '@/lib/leadHelper';
import type { BotSession, Lead, LeadMessage } from '@/types';
import { BotSessionManager } from './BotSessionManager';
import { ChatBubble } from './ChatBubble';
import { LeadChatHeader } from './LeadChatHeader';
import { LeadChatInput } from './LeadChatInput';

interface LeadChatProps {
    lead: Lead;
}

export const LeadChat: FC<LeadChatProps> = ({ lead }) => {


    const activeWorkspace = useActiveWorkspace();
    const [messages, setMessages] = useState<LeadMessage[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [session, setSession] = useState<BotSession | null>(null);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const viewportRef = useRef<HTMLDivElement>(null);
    const prevHeightRef = useRef<number>(0);
    const initialLoadDone = useRef(false);
    const loadingOlderRef = useRef(false);
    const pageRef = useRef(1); // ← use ref instead of state for page

    const loadPage = useCallback(
        async (pageNum: number) => {
            setLoading(true);
            try {
                const result = await fetchMessages(
                    activeWorkspace!.slug,
                    lead.id,
                    pageNum,
                );
                if (pageNum === 1) {
                    setMessages(result.data.reverse());
                } else {
                    setMessages((prev) => [...result.data.reverse(), ...prev]);
                }
                setHasMore(result.current_page < result.last_page);
            } finally {
                setLoading(false);
            }
        },
        [activeWorkspace, lead.id],
    );

    // Reset and load first page when lead changes
    useEffect(() => {
        setMessages([]);
        pageRef.current = 1;
        setHasMore(true);
        initialLoadDone.current = false;
        loadingOlderRef.current = false;

        loadPage(1).then(() => {
            initialLoadDone.current = true;
            requestAnimationFrame(() => {
                if (viewportRef.current) {
                    viewportRef.current.scrollTop =
                        viewportRef.current.scrollHeight;
                }
            });
        });
    }, [lead.id, loadPage]);

    // Real-time new messages via Echo
    useEcho(`lead.${lead.id}`, ['LeadMessageUpdated'], (event) => {
        const msg = event.message as LeadMessage;
        if (msg && msg.id) {
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
            requestAnimationFrame(() => {
                if (viewportRef.current) {
                    viewportRef.current.scrollTop =
                        viewportRef.current.scrollHeight;
                }
            });
        }
    });

    // Fetch bot session for this lead
    useEffect(() => {
        setSession(null);
        fetchLeadSession(activeWorkspace!.slug, lead.id)
            .then(setSession)
            .catch(() => setSession(null));
    }, [lead.id, activeWorkspace]);

    const handlePauseBot = useCallback(async () => {
        setSessionLoading(true);
        try {
            await changeSessionStatus(activeWorkspace!.slug, lead.id, 'paused');
            setSession((prev) => prev ? { ...prev, status: 'paused' } : null);
        } finally {
            setSessionLoading(false);
        }
    }, [activeWorkspace, lead.id]);

    const handleResumeBot = useCallback(async () => {
        setSessionLoading(true);
        try {
            await changeSessionStatus(activeWorkspace!.slug, lead.id, 'opened');
            setSession((prev) => prev ? { ...prev, status: 'opened' } : null);
        } finally {
            setSessionLoading(false);
        }
    }, [activeWorkspace, lead.id]);

    const handleScroll = useCallback(() => {
        const el = viewportRef.current;
        if (!el || !hasMore || loading || loadingOlderRef.current) return;

        if (el.scrollTop < 150) {
            loadingOlderRef.current = true;
            prevHeightRef.current = el.scrollHeight;

            const nextPage = pageRef.current + 1; // ← read from ref, always current
            pageRef.current = nextPage;            // ← update ref immediately, sync

            loadPage(nextPage).then(() => {
                requestAnimationFrame(() => {
                    if (viewportRef.current) {
                        // Restore scroll position after prepending old messages
                        viewportRef.current.scrollTop =
                            viewportRef.current.scrollHeight -
                            prevHeightRef.current;
                    }
                    loadingOlderRef.current = false;
                });
            });
        }
    }, [hasMore, loading, loadPage]); // ← page removed from deps, no stale closure

    const grouped = groupLeadMessagesByDate(messages);

    const onSend = async (text: string) => {
        const optimistic: LeadMessage = {
            id: `opt-${Date.now()}`,
            lead_id: lead.id as string,
            remote_id: null,
            direction: 'from_agent',
            content: text,
            type: 'text',
            status: 'sent',
            metadata: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);
        requestAnimationFrame(() => {
            if (viewportRef.current) {
                viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
            }
        });
        try {
            await sendMessage(activeWorkspace!.slug, lead.id, text);
        } catch {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === optimistic.id ? { ...m, status: 'failed' } : m,
                ),
            );
        }
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <LeadChatHeader lead={lead} />
            <ScrollArea
                className="flex-1 min-h-0 bg-[#F0F2F5] dark:bg-gray-950 [&_*]:scrollbar-thin [&_*]:scrollbar-thumb-rounded-full [&_*]:scrollbar-thumb-gray-300 dark:[&_*]:scrollbar-thumb-gray-600"
                viewportRef={viewportRef}
                onScroll={handleScroll}
            >
                <div className="space-y-1 px-4 py-4">
                    {loading && messages.length === 0 && (
                        <div className="flex justify-center py-8">
                            <p className="text-xs text-muted-foreground">
                                Chargement...
                            </p>
                        </div>
                    )}

                    {/* Loading indicator at top when fetching older messages */}
                    {loading && messages.length > 0 && (
                        <div className="flex justify-center py-2">
                            <p className="text-xs text-muted-foreground">
                                Chargement des anciens messages...
                            </p>
                        </div>
                    )}


                    {grouped.map((group) => (
                        <div key={group.date}>
                            <div className="flex justify-center py-2">
                                <span className="rounded-full bg-gray-200/80 px-3 py-1 text-[11px] text-gray-500 backdrop-blur-sm">
                                    {getDateSeparator(group.date)}
                                </span>
                            </div>
                            {group.messages.map((msg, idx) => (
                                
                                <ChatBubble
                                    key={msg.id}
                                    direction={msg.direction === 'from_lead' ? 'client' : 'ai'}
                                    message={msg.content || ''}
                                    timestamp={msg.created_at}
                                    type={msg.type}
                                    mediaUrl={
                                        (msg.metadata as Record<string, unknown> | null)?.local_url as string | undefined
                                    }
                                    metadata={msg.metadata}
                                    isConsecutive={
                                        idx > 0 &&
                                        group.messages[idx - 1].direction === msg.direction
                                    }
                                />
                                
                            ))}
                        </div>
                    ))}
                    {!loading && messages.length === 0 && (
                        <div className="flex h-full items-center justify-center py-16">
                            <p className="text-sm text-muted-foreground">
                                Aucun message pour le moment
                            </p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <BotSessionManager
                session={session}
                onPause={handlePauseBot}
                onResume={handleResumeBot}
                loading={sessionLoading}
            />
            <LeadChatInput
                onSend={onSend}
                isBotActive={session?.status === 'opened'}
            />
        </div>
    );
};
