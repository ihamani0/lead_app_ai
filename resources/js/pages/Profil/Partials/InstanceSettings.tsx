// resources/js/Pages/Instances/Partials/InstanceSettings.tsx
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    instanceName: string;
    phoneNumber?: string | null;
    connectedAt?: string | null;
}

export function InstanceSettings({
    instanceName,
    phoneNumber,
    connectedAt,
}: Props) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const settings = [
        { label: 'Instance ID', value: instanceName, copyable: true },
        {
            label: 'Phone Number',
            value: phoneNumber ? `+${phoneNumber}` : 'Not linked',
            copyable: !!phoneNumber,
        },
        {
            label: 'Last Connected',
            value: formatDate(connectedAt),
            copyable: false,
        },
    ];

    return (
        <Card className="overflow-hidden border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader className="border-b bg-slate-50/50 px-6 py-4 dark:bg-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Instance Details
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
                                    className={`text-sm font-bold ${setting.value === 'Not linked' ? 'text-slate-400 italic' : 'text-slate-900 dark:text-slate-100'}`}
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
            </CardContent>
        </Card>
    );
}
