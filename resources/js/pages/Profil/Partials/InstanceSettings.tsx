import { motion } from 'framer-motion';
import {
    Copy,
    Check,
    Server,
    Bot,
    Shield,
    Clock,
    MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
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

    const getAgentStatus = () => {
        if (!agentConfig || !agentConfig.evo_integration_id) {
            return {
                label: t('instance.noAgent'),
                color: 'text-slate-400',
                bg: 'bg-slate-100',
            };
        }
        if (agentConfig.is_active) {
            return {
                label: t('instance.agentRunning'),
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
            };
        }
        return {
            label: t('instance.agentPaused'),
            color: 'text-amber-600',
            bg: 'bg-amber-100',
        };
    };

    const status = getAgentStatus();
    const blacklist = agentConfig?.settings?.blacklist as string[] | undefined;
    const blacklistCount = blacklist?.length ?? 0;
    const promptPreview = agentConfig?.system_prompt
        ? agentConfig.system_prompt.substring(0, 80) +
          (agentConfig.system_prompt.length > 80 ? '...' : '')
        : null;

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

    const agentSettings =
        agentConfig && agentConfig.evo_integration_id
            ? [
                  {
                      label: t('instance.agentStatus'),
                      value: status.label,
                      color: status.color,
                      bg: status.bg,
                      copyable: false,
                  },
                  {
                      label: t('instance.typingDelay'),
                      value: `${agentConfig.settings?.delayMessage ?? 1200} ${t('instance.typingDelayMs')}`,
                      copyable: false,
                  },
                  {
                      label: t('instance.stopKeyword'),
                      value: agentConfig.settings?.keywordFinish ?? '#STOP',
                      copyable: false,
                  },
                  {
                      label: t('instance.blacklist'),
                      value:
                          blacklistCount > 0
                              ? `${blacklistCount} ${t('instance.blacklistCount')}`
                              : t('instance.noBlacklist'),
                      copyable: false,
                      highlight: blacklistCount > 0,
                  },
              ]
            : [];

    return (
        <Card className="overflow-hidden border-none shadow-lg backdrop-blur-sm">
            <CardHeader className="border-b px-6 py-4">
                <CardTitle className="flex items-center gap-3 text-base font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Server className="h-4 w-4 text-primary" />
                    </div>
                    {t('instance.instanceId')}
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

                {agentSettings.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 border-t border-b border-slate-100 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/30">
                            <Bot className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                {t('instance.agentStatus')}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {agentSettings.map((setting, index) => (
                                <motion.div
                                    key={setting.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: (settings.length + index) * 0.1,
                                    }}
                                    className={`group flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${setting.highlight ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}
                                >
                                    <span className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {setting.label ===
                                            t('instance.typingDelay') && (
                                            <Clock className="h-3.5 w-3.5" />
                                        )}
                                        {setting.label ===
                                            t('instance.stopKeyword') && (
                                            <Shield className="h-3.5 w-3.5" />
                                        )}
                                        {setting.label ===
                                            t('instance.blacklist') && (
                                            <MessageSquare className="h-3.5 w-3.5" />
                                        )}
                                        {setting.label}
                                    </span>
                                    <span
                                        className={`text-sm font-bold ${
                                            setting.color
                                                ? setting.color
                                                : 'text-slate-900 dark:text-slate-100'
                                        }`}
                                    >
                                        {setting.bg && (
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${setting.bg} ${setting.color}`}
                                            >
                                                {setting.value}
                                            </span>
                                        )}
                                        {!setting.bg && setting.value}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {promptPreview && (
                            <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/20">
                                <span className="mb-1 block text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                    {t('instance.systemPrompt')}
                                </span>
                                <p className="line-clamp-2 text-sm text-slate-600 italic dark:text-slate-300">
                                    "{promptPreview}"
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
