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
import { AlertDestructive } from '@/components/alert-destructive';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { destroy, store, toggle, update } from '@/routes/bot';
import { type EvolutionInstance } from '@/types';

export default function AgentManager({
    instance,
}: {
    instance: EvolutionInstance;
}) {
    const agent = instance.agent_config;
    const isConnected = !!agent?.evo_integration_id;
    const isActive = agent?.is_active;

    // Connect Form
    const connectForm = useForm({ webhook_url: agent?.webhook_url || '' });

    // Settings & Prompt Form
    const settingsForm = useForm({
        config_webhook_url: agent?.config_webhook_url || '',
        system_prompt: agent?.system_prompt || '',
        settings: {
            delayMessage: agent?.settings?.delayMessage || 1200,
            keywordFinish: agent?.settings?.keywordFinish || '#STOP',
        },
    });

    const handleConnect = (e: React.SubmitEvent) => {
        e.preventDefault();
        connectForm.post(store({ id: instance.id }).url, {
            preserveScroll: true,
        });
    };

    const handleUpdate = (e: React.SubmitEvent) => {
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
        <div className="animate-in space-y-8 duration-700 slide-in-from-bottom-4">
            {/* CONNECTION CARD */}
            <Card
                className={`overflow-hidden border-none shadow-xl transition-all duration-500 ${isConnected ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-900/50'}`}
            >
                <div
                    className={`h-1.5 w-full ${isConnected ? (isActive ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200 dark:bg-slate-800'}`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isConnected ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
                        >
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight">
                                AI Deployment
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Connect and control your WhatsApp AI assistant.
                            </CardDescription>
                        </div>
                    </div>
                    {isConnected && (
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    System Status
                                </span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`h-2 w-2 rounded-full ${isActive ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`}
                                    />
                                    <span
                                        className={`text-sm font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
                                    >
                                        {isActive
                                            ? 'Live & Automated'
                                            : 'Paused'}
                                    </span>
                                </div>
                            </div>
                            <Switch
                                checked={isActive}
                                onCheckedChange={handleToggle}
                                className="data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                    )}
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    {!isConnected ? (
                        <form
                            onSubmit={handleConnect}
                            className="flex flex-col gap-6 md:flex-row md:items-end"
                        >
                            <div className="flex-1 space-y-3">
                                <label className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                    N8N Webhook Endpoint
                                </label>
                                <div className="group relative">
                                    <Input
                                        placeholder="https://n8n.yourdomain.com/webhook/..."
                                        className="h-12 border-slate-200 bg-white px-4 ring-offset-emerald-50 transition-all focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950"
                                        value={connectForm.data.webhook_url}
                                        onChange={(e) =>
                                            connectForm.setData(
                                                'webhook_url',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center text-slate-300 group-focus-within:text-emerald-500">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                </div>
                                {connectForm.errors.webhook_url && (
                                    <AlertDestructive
                                        title={connectForm.errors.webhook_url}
                                    />
                                )}
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 rounded-xl bg-slate-900 font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-slate-200 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:shadow-emerald-900/30"
                                disabled={connectForm.processing}
                            >
                                {connectForm.processing ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Zap className="mr-2 h-5 w-5" />
                                )}
                                Initialize AI Brain
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 md:flex-row dark:border-slate-800 dark:bg-slate-950/20">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm dark:bg-slate-800">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div className="max-w-md">
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Active Webhook
                                    </p>
                                    <p className="truncate font-mono text-sm text-slate-600 dark:text-slate-300">
                                        {agent.webhook_url}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={connectForm.processing}
                                className="h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <Unlink className="mr-2 h-4 w-4" /> Terminate
                                Agent
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SETTINGS CARD */}
            {agent && (
                <Card className="overflow-hidden border-none shadow-xl dark:bg-slate-900">
                    <CardHeader className="bg-slate-50/50 px-8 py-6 dark:bg-gray-700/15">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                                    Cognitive Settings
                                </CardTitle>
                                <CardDescription className="dark:text-slate-400">
                                    Define the behavior, typing patterns, and
                                    logic of your AI.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        Typing Simulation (ms)
                                    </label>
                                    <Input
                                        type="number"
                                        className="h-12 border-slate-200 bg-white font-bold transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950"
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
                                    <p className="text-xs text-slate-400 italic">
                                        Simulates human-like delays before
                                        active responses.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        Interruption Keyword
                                    </label>
                                    <Input
                                        className="h-12 border-slate-200 bg-white font-mono transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950"
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
                                    <p className="text-xs text-slate-400 italic">
                                        Key phrase used to manually halt AI
                                        automation.
                                    </p>
                                </div>
                            </div>

                            {/* <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        Url Prompt
                                    </label>
                                    <Badge
                                        variant="outline"
                                        className="h-6 border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400"
                                    >
                                        High Priority
                                    </Badge>
                                </div>
                                <Input
                                    className="resize-none border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                                    placeholder="http://url.com"
                                    value={settingsForm.data.config_webhook_url}
                                    onChange={(e) =>
                                        settingsForm.setData(
                                            'config_webhook_url',
                                            e.target.value,
                                        )
                                    }
                                />
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Link className="h-3 w-3" />
                                    <span>
                                        This Url for updating the Target Agent Prompte.
                                    </span>
                                </div>
                            </div> */}

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        System Prompt
                                    </label>
                                    <Badge
                                        variant="outline"
                                        className="h-6 border-red-200 bg-red-50 text-[10px] text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
                                    >
                                        High Priority
                                    </Badge>
                                </div>
                                <Textarea
                                    rows={10}
                                    className="resize-none rounded-lg border border-slate-300 bg-white p-4 text-slate-900 placeholder-slate-400 transition-all focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:ring-slate-400"
                                    placeholder="Write your AI's personality, rules, and knowledge base here..."
                                    value={settingsForm.data.system_prompt}
                                    onChange={(e) =>
                                        settingsForm.setData(
                                            'system_prompt',
                                            e.target.value,
                                        )
                                    }
                                />
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Activity className="h-3 w-3" />
                                    <span>
                                        This prompt defines how the AI will
                                        interact with all your clients.
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={settingsForm.processing}
                                className="h-12 w-full rounded-lg  font-semibold  shadow-md transition-colors bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200 hover:dark:bg-indigo-900/80 hover:bg-indigo-100/80
                                delay-50
                                "
                            >
                                {settingsForm.processing ? (
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                ) : (
                                    <Save className="mr-3 h-6 w-6" />
                                )}
                                Synchronize AI
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
