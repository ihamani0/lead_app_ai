import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { ArrowUp, Bot, Brain, Check, Loader2, MessageSquare, RefreshCw, Search, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import workspaces from '@/routes/workspaces';
import type { AgentConfig } from '@/types';

interface TestAsset {
    url: string;
    type: 'image' | 'video';
    caption?: string;
}

interface TestMessage {
    role: 'user' | 'assistant';
    content: string;
    assets?: TestAsset[];
    timestamp: string;
}

interface TestConversation {
    messages: TestMessage[];
}

interface Props {
    agent: AgentConfig;
    testConversation: TestConversation | null;
}

type TypingStage = 'starting' | 'thinking' | 'searching' | 'parsing' | 'completed';

const STAGE_CONFIG: Record<TypingStage, { icon: LucideIcon; label: string; animation: string; color: string }> = {
    starting: { icon: Zap, label: 'Démarrage...', animation: 'animate-pulse', color: 'text-yellow-500' },
    thinking: { icon: Brain, label: 'Réflexion en cours...', animation: 'animate-pulse', color: 'text-purple-500' },
    searching: { icon: Search, label: 'Recherche dans la base...', animation: 'animate-spin', color: 'text-blue-500' },
    parsing: { icon: Loader2, label: 'Finalisation de la réponse...', animation: 'animate-spin', color: 'text-green-500' },
    completed: { icon: Check, label: 'Terminé', animation: '', color: 'text-green-500' },
};

function MediaViewer({ asset }: { asset: TestAsset }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground dark:bg-muted/80">
                Échec du chargement
            </div>
        );
    }

    if (asset.type === 'video') {
        return (
            <video
                src={asset.url}
                controls
                className="w-full rounded-lg"
                preload="metadata"
                onError={() => setError(true)}
            />
        );
    }

    return (
        <img
            src={asset.url}
            alt={asset.caption || ''}
            className="w-full rounded-lg object-cover"
            loading="lazy"
            onError={() => setError(true)}
        />
    );
}

export default function TestChat({ agent, testConversation }: Props) {
    const { slug } = useActiveWorkspace()!;
    const [messages, setMessages] = useState<TestMessage[]>(
        testConversation?.messages ?? [],
    );
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [typingStage, setTypingStage] = useState<{ isTyping: boolean; stage: TypingStage | null }>({
        isTyping: false,
        stage: null,
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const channel = agent.id ? `test-conversation.${agent.id}` : '';

    useEcho(channel, ['TestMessageUpdated'], (e) => {
        setMessages(e.conversation.messages as TestMessage[]);
        setSending(false);
        setTypingStage({ isTyping: false, stage: null });
    });

    useEcho(channel, ['TestAgentTyping'], (e) => {
        setTypingStage({ isTyping: e.is_typing as boolean, stage: e.stage as TypingStage });
    });

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingStage, scrollToBottom]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        const msg = input.trim();
        setInput('');
        setSending(true);

        // Ajout optimiste
        setMessages((prev) => [
            ...prev,
            { role: 'user', content: msg, timestamp: new Date().toISOString() },
        ]);

        try {
            await axios.post(
                workspaces.agents.test.send({ slug, agent: agent.id }).url,
                { message: msg },
            );
        } catch {
            // Optionnel: retirer le message optimiste en cas d'échec
        }
    };

    const handleClear = async () => {
        try {
            const message = await axios.post(
                workspaces.agents.test.clear({ slug, agent: agent.id }).url,
            );
            if (message.status === 200) {
                toast.success('Conversation cleared successfully');
                setMessages([]);
            }
        } catch (e) {
            console.error('Failed to clear conversation', e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className="flex flex-col gap-6"
            style={{ maxWidth: '1520px', margin: '0 auto', width: '100%' }}
        >
            <div className="flex w-full items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Testez votre IA</h1>
                    <p className="text-sm text-muted-foreground">
                        Discutez avec votre IA pour voir comment elle répond en
                        conditions réelles.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={handleClear}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Réinitialiser
                    </Button>
                </div>
            </div>

            {/* Full-width chat panel */}
            <div className="flex w-full flex-col overflow-hidden rounded-xl border-border bg-card shadow-sm">
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">{agent.name}</p>
                        <div className="flex items-center gap-1.5">
                            {agent.is_active ? (
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    ● En ligne
                                </span>
                            ) : (
                                <span className="text-xs text-red-600 dark:text-red-400">
                                    ● Hors ligne
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Message Thread */}
                <ScrollArea className="flex-1 px-5 py-4">
                    <div className="flex flex-col gap-4">
                        {messages.length === 0 && !sending && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-3 rounded-full bg-purple-100 p-3">
                                    <MessageSquare className="h-6 w-6 text-purple-400 dark:text-purple-500" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Commencez une conversation avec votre IA
                                </p>
                            </div>
                        )}

                        {messages.map((msg, i) =>
                            msg.role === 'user' ? (
                                <UserMessage key={i} message={msg} />
                            ) : (
                                <BotMessage key={i} message={msg} />
                            ),
                        )}

                        {typingStage.isTyping && typingStage.stage && (
                            <TypingSkeleton stage={typingStage.stage} />
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t px-4 py-3">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            disabled={sending}
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim() || sending}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                        Ceci est un test. Les réponses peuvent varier en
                        conditions réelles.
                    </p>
                    {typingStage.isTyping && typingStage.stage && typingStage.stage !== 'completed' && (
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <div className="h-0.5 w-16 overflow-hidden rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <div className="h-full w-full animate-pulse bg-purple-400 dark:bg-purple-500" />
                            </div>
                            <span className="text-xs text-purple-500 dark:text-purple-400">
                                L'IA génère votre réponse...
                            </span>
                            <div className="h-0.5 w-16 overflow-hidden rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <div className="h-full w-full animate-pulse bg-purple-400 dark:bg-purple-500" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── User Message (memoized) ─── */
const UserMessage = memo(function UserMessage({
    message,
}: {
    message: TestMessage;
}) {
    const time = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-green-500 px-4 py-2.5 text-sm text-white">
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="mt-1 text-right text-[10px] text-green-100">
                    {time} ✓✓
                </p>
            </div>
        </div>
    );
});

/* ─── Bot Message (memoized) ─── */
const BotMessage = memo(function BotMessage({
    message,
}: {
    message: TestMessage;
}) {
    const time = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm shadow-sm">
                <BotHeader />
                <div className="mt-1 border-border bg-background whitespace-pre-wrap text-foreground">
                    {message.content}
                </div>

                {message.assets && message.assets.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {message.assets.map((asset, i) => (
                            <MediaViewer key={i} asset={asset} />
                        ))}
                    </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                        {time}
                    </span>
                    {/* <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <Share2 className="h-3.5 w-3.5" />
                    </button> */}
                </div>
            </div>
        </div>
    );
});

/* ─── Typing Skeleton (stage-driven) ─── */
function TypingSkeleton({ stage }: { stage: TypingStage }) {
    const config = STAGE_CONFIG[stage];
    const StageIcon = config.icon;

    return (
        <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm border px-4 py-3 text-sm shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <StageIcon className={`h-3.5 w-3.5 ${config.color} ${config.animation}`} />
                        <span className="text-xs font-medium text-muted-foreground">
                            {config.label}
                        </span>
                    </div>
                </div>
                <div className="mt-2.5 space-y-2">
                    <div className="h-2.5 w-48 animate-pulse rounded-full bg-muted" />
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-muted" style={{ animationDelay: '0.15s' }} />
                    <div className="h-2.5 w-40 animate-pulse rounded-full bg-muted" style={{ animationDelay: '0.3s' }} />
                </div>
            </div>
        </div>
    );
}

function BotHeader() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Bot className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            </div>
        </div>
    );
}
