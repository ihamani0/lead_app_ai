import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Copy, Check, Server, Bot, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import agents from '@/routes/agents';
import type { AgentConfig } from '@/types';

interface Props {
    instanceName: string;
    phoneNumber?: string | null;
    connectedAt?: string | null;
    agentConfig?: AgentConfig | null;
}

export function InstanceSettings({
    instanceName,
    phoneNumber,
    connectedAt,
    agentConfig,
}: Props) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return t('instance.never');
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const settings = [
        {
            label: t('instance.instanceId'),
            value: instanceName,
            copyable: true,
        },
        {
            label: t('instance.phoneNumber'),
            value: phoneNumber ? `+${phoneNumber}` : t('instance.notLinked'),
            copyable: !!phoneNumber,
        },
        {
            label: t('instance.lastConnected'),
            value: formatDate(connectedAt),
            copyable: false,
        },
    ];

    return (
        <Card className="overflow-hidden border-none shadow-lg backdrop-blur-sm">
            <CardHeader className="border-b px-6 py-4">
                <CardTitle className="flex items-center gap-3 text-base font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Server className="h-4 w-4 text-primary" />
                    </div>
                    {t('instance.instanceDetails')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {settings.map((setting, index) => (
                        <motion.div
                            key={setting.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        >
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {setting.label}
                            </span>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`text-sm font-bold ${setting.value === t('instance.notLinked') ? 'text-slate-400 italic' : 'text-slate-900 dark:text-slate-100'}`}
                                >
                                    {setting.value}
                                </span>
                                {setting.copyable && (
                                    <button
                                        onClick={() =>
                                            copyToClipboard(setting.value)
                                        }
                                        className="rounded-md p-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Agent Link Section */}
                {agentConfig ? (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {agentConfig.name ||
                                            t('agents.assistant')}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {agentConfig.is_active
                                            ? t('agents.status.running')
                                            : t('agents.status.paused')}
                                    </p>
                                </div>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Link href={agents.show(agentConfig.id).url}>
                                    {t('agents.config.title')}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {t('instance.noAgent')}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {t('instance.noAgentDesc')}
                                    </p>
                                </div>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/agents">
                                    {t('agents.title')}
                                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
