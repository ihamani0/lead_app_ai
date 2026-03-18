import { useForm } from '@inertiajs/react';
import {
    Bot,
    Loader2,
    Save,
    Unlink,
    Zap,
    Activity,
    Settings,
} from 'lucide-react';
import { useState } from 'react';
import { AlertDestructive } from '@/components/alert-destructive';
import { HelpTooltip } from '@/components/help-tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { destroy, store, toggle, update } from '@/routes/bot';
import { type EvolutionInstance } from '@/types';

export default function AgentManager({
    instance,
}: {
    instance: EvolutionInstance;
}) {
    const { t } = useTranslation();
    const agent = instance.agent_config;
    const isConnected = !!agent?.evo_integration_id;
    const isActive = agent?.is_active;

    const connectForm = useForm({ webhook_url: agent?.webhook_url || '' });

    const settingsForm = useForm({
        config_webhook_url: agent?.config_webhook_url || '',
        system_prompt: agent?.system_prompt || '',
        settings: {
            delayMessage: agent?.settings?.delayMessage || 1200,
            keywordFinish: agent?.settings?.keywordFinish || '#STOP',
            blacklist: agent?.settings?.blacklist || [],
        },
    });

    const [blacklistInput, setBlacklistInput] = useState(
        (agent?.settings?.blacklist as string[])?.join(', ') || '',
    );

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        connectForm.post(store({ id: instance.id }).url, {
            preserveScroll: true,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.put(update(instance.id).url, {
            preserveScroll: true,
        });
    };

    const handleToggle = () => {
        connectForm.patch(toggle(instance.id).url, {
            preserveScroll: true,
        });
    };

    const handleDisconnect = () => {
        if (
            confirm(
                'Disconnect AI? Your settings will be saved but the bot will stop working.',
            )
        ) {
            connectForm.delete(destroy(instance.id).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* CONNECTION CARD */}
            <Card className="overflow-hidden border-border/50 shadow-sm">
                <div
                    className={`h-1 w-full ${
                        isConnected
                            ? isActive
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            : 'bg-muted'
                    }`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${
                                isConnected
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                                    : 'border-muted bg-muted text-muted-foreground'
                            }`}
                        >
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">
                                AI Agent
                            </CardTitle>
                            <CardDescription>
                                {isConnected
                                    ? 'Your WhatsApp assistant is configured'
                                    : 'Connect an AI brain to automate responses'}
                            </CardDescription>
                        </div>
                    </div>
                    {isConnected && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`relative flex h-2.5 w-2.5 ${
                                        isActive
                                            ? 'text-emerald-500'
                                            : 'text-amber-500'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    )}
                                    <span
                                        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                                            isActive
                                                ? 'bg-emerald-500'
                                                : 'bg-amber-500'
                                        }`}
                                    />
                                </span>
                                <span
                                    className={`text-sm font-medium ${
                                        isActive
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-amber-600 dark:text-amber-400'
                                    }`}
                                >
                                    {isActive ? 'Active' : 'Paused'}
                                </span>
                            </div>
                            <Switch
                                checked={isActive}
                                onCheckedChange={handleToggle}
                                className="data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {!isConnected ? (
                        <form
                            onSubmit={handleConnect}
                            className="flex flex-col gap-4 sm:flex-row sm:items-end"
                        >
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="webhook">
                                        {t('instance.webhookUrl')}
                                    </Label>
                                    <HelpTooltip
                                        content={t('instance.webhookUrlHelp')}
                                    />
                                </div>
                                <div className="relative">
                                    <Zap className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="webhook"
                                        placeholder="https://n8n.example.com/webhook/..."
                                        className="pl-10"
                                        value={connectForm.data.webhook_url}
                                        onChange={(e) =>
                                            connectForm.setData(
                                                'webhook_url',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                {connectForm.errors.webhook_url && (
                                    <AlertDestructive
                                        title={connectForm.errors.webhook_url}
                                    />
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={connectForm.processing}
                                className="w-full sm:w-auto"
                            >
                                {connectForm.processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Zap className="mr-2 h-4 w-4" />
                                )}
                                Initialize
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Activity className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Webhook Endpoint
                                    </p>
                                    <p className="truncate font-mono text-sm">
                                        {agent.webhook_url}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={connectForm.processing}
                                className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Unlink className="mr-2 h-4 w-4" />
                                Disconnect
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SETTINGS CARD */}
            {agent && (
                <Card className="overflow-hidden border-border/50 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Settings className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">
                                    Configuration
                                </CardTitle>
                                <CardDescription>
                                    Customize your AI agent behavior
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Quick Settings Row */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="delay">
                                            {t('instance.typingDelay')} (
                                            {t('instance.typingDelayMs')})
                                        </Label>
                                        <HelpTooltip
                                            content={t(
                                                'instance.typingDelayHelp',
                                            )}
                                        />
                                    </div>
                                    <Input
                                        id="delay"
                                        type="number"
                                        value={
                                            settingsForm.data.settings
                                                .delayMessage
                                        }
                                        onChange={(e) =>
                                            settingsForm.setData('settings', {
                                                ...settingsForm.data.settings,
                                                delayMessage: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Delay before sending response
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="keyword">
                                            {t('instance.stopKeyword')}
                                        </Label>
                                        <HelpTooltip
                                            content={t(
                                                'instance.stopKeywordHelp',
                                            )}
                                        />
                                    </div>
                                    <Input
                                        id="keyword"
                                        value={
                                            settingsForm.data.settings
                                                .keywordFinish
                                        }
                                        onChange={(e) =>
                                            settingsForm.setData('settings', {
                                                ...settingsForm.data.settings,
                                                keywordFinish: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Type this to pause the bot
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Blacklist Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="blacklist">
                                        {t('instance.blacklist')}
                                    </Label>
                                    <HelpTooltip
                                        content={t('instance.blacklistHelp')}
                                    />
                                    {((agent?.settings?.blacklist as string[])
                                        ?.length ?? 0) > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {
                                                (
                                                    agent?.settings
                                                        ?.blacklist as string[]
                                                )?.length
                                            }
                                        </Badge>
                                    )}
                                </div>
                                <Textarea
                                    id="blacklist"
                                    placeholder="1234567890, 0987654321 (comma separated)"
                                    value={blacklistInput}
                                    onChange={(e) => {
                                        setBlacklistInput(e.target.value);
                                        const numbers = e.target.value
                                            .split(',')
                                            .map((n) => n.trim())
                                            .filter((n) => n.length > 0);
                                        settingsForm.setData('settings', {
                                            ...settingsForm.data.settings,
                                            blacklist: numbers,
                                        });
                                    }}
                                    className="font-mono text-sm"
                                    rows={2}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Agent will not respond to these numbers
                                </p>
                            </div>

                            <Separator />

                            {/* System Prompt */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="prompt">
                                            {t('instance.systemPrompt')}
                                        </Label>
                                        <HelpTooltip
                                            content={t(
                                                'instance.systemPromptHelp',
                                            )}
                                        />
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        AI Instructions
                                    </Badge>
                                </div>
                                <Textarea
                                    id="prompt"
                                    placeholder="Define your AI's personality, rules, and knowledge..."
                                    value={settingsForm.data.system_prompt}
                                    onChange={(e) =>
                                        settingsForm.setData(
                                            'system_prompt',
                                            e.target.value,
                                        )
                                    }
                                    rows={6}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This prompt shapes how the AI interacts with
                                    clients
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={settingsForm.processing}
                                className="w-full"
                            >
                                {settingsForm.processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
