// resources/js/Pages/Instances/Partials/InstanceTabs.tsx
import { motion } from 'framer-motion';
import { Activity, Zap, Settings, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EvolutionInstance } from '@/types';
import AgentManager from './AgentManager';
import { InstanceSettings } from './InstanceSettings';
import { InstanceStats } from './InstanceStats';

interface Props {
    instance: EvolutionInstance;
}

export function InstanceTabs({ instance }: Props) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'automation', label: 'AI Automation', icon: Zap },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 inline-flex h-12 items-center justify-start gap-1 rounded-xl bg-slate-100/80 p-1.5 backdrop-blur-sm dark:bg-slate-900/80">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100"
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <InstanceStats
                        status={instance.status}
                        provider="Evolution"
                        platform="WhatsApp"
                        lastSynced={instance.connected_at}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <InstanceSettings
                        instanceName={instance.instance_name}
                        phoneNumber={instance.phone_number}
                        connectedAt={instance.connected_at}
                    />
                </motion.div>
            </TabsContent>

            <TabsContent value="automation">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <AgentManager instance={instance} />
                </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/50"
                >
                    <div className="text-center">
                        <BarChart3 className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500">
                            Analytics coming soon
                        </p>
                    </div>
                </motion.div>
            </TabsContent>

            <TabsContent value="settings">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/50"
                >
                    <div className="text-center">
                        <Settings className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500">
                            Advanced settings coming soon
                        </p>
                    </div>
                </motion.div>
            </TabsContent>
        </Tabs>
    );
}
