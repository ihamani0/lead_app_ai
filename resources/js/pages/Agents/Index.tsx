import { Head, Link } from '@inertiajs/react';
import { Bot, Phone, PlusCircle, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { show } from '@/routes/profile';
import {
    type AgentConfig,
    type BreadcrumbItem,
    type EvolutionInstance,
} from '@/types';

type Props = {
    agents: AgentConfig[];
    availableInstances: EvolutionInstance[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: dashboard().url },
    { title: `Agent `, href: '' },
];

export default function AgentIndex({ agents, availableInstances }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Agents" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                AI Agents
                            </h2>
                            <p className="text-muted-foreground">
                                Manage your automated WhatsApp assistants.
                            </p>
                        </div>
                    </div>

                    {/* Agent Grid */}
                    {agents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {agents.map((agent) => {
                                const isConnected = !!agent.evo_integration_id;
                                const isActive = agent.is_active && isConnected;

                                return (
                                    <Card
                                        key={agent.id}
                                        className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/40 dark:backdrop-blur-sm"
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${isActive ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
                                                    >
                                                        <Bot className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold tracking-tight">
                                                            {agent.instance?.instance_name?.split(
                                                                '-',
                                                            )[1] || 'Assistant'}
                                                        </CardTitle>
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1 h-5 border-slate-200 text-[10px] font-medium tracking-wider uppercase dark:border-slate-700"
                                                        >
                                                            {agent.provider ||
                                                                'AI Core'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div
                                                        className={`h-2.5 w-2.5 animate-pulse rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`}
                                                    />
                                                    <span
                                                        className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}
                                                    >
                                                        {isConnected
                                                            ? agent.is_active
                                                                ? 'Running'
                                                                : 'Paused'
                                                            : 'Offline'}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4 pb-6">
                                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-700">
                                                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                        WhatsApp
                                                    </span>
                                                    <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-200">
                                                        +
                                                        {agent.instance
                                                            ?.phone_number ||
                                                            '---'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative rounded-xl border border-slate-100 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                                    Brain Configuration
                                                </p>
                                                <p className="line-clamp-3 min-h-18 text-sm leading-relaxed text-slate-600 italic dark:text-slate-400">
                                                    "
                                                    {agent.system_prompt ||
                                                        'Initialize the brain to get started...'}
                                                    "
                                                </p>
                                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-purple-500 transition-all duration-500 group-hover:w-full" />
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex border-t bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-transparent">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full font-bold text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-950/30"
                                                asChild
                                            >
                                                {agent.instance && (
                                                    <Link
                                                        href={
                                                            show(
                                                                agent.instance
                                                                    ?.id,
                                                            ).url
                                                        }
                                                    >
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        Configuration & Settings
                                                    </Link>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white/50 py-24 text-center dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Bot className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                                    Your AI Fleet is Empty
                                </h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">
                                    Ready to automate? Connect your first
                                    WhatsApp assistant below.
                                </p>
                            </div>
                            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
                        </div>
                    )}

                    {/* Available Instances Alert */}
                    {availableInstances.length > 0 && (
                        <div className="relative mt-12 overflow-hidden rounded-2xl border border-blue-200/50 bg-linear-to-br from-blue-50/50 to-white p-8 shadow-sm dark:border-blue-900/30 dark:from-blue-950/20 dark:to-background">
                            <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
                                <div className="flex gap-5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100/80 dark:bg-blue-900/30">
                                        <PlusCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-blue-950 dark:text-blue-50">
                                            {availableInstances.length}{' '}
                                            Number(s) Available
                                        </h3>
                                        <p className="mt-1 text-blue-700/80 dark:text-blue-400/80">
                                            Deploy AI assistants to handle these
                                            lines automatically.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {availableInstances.map((instance) => (
                                        <Button
                                            key={instance.id}
                                            variant="secondary"
                                            className="h-11 rounded-xl bg-blue-600 font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-blue-200 dark:bg-blue-700 dark:shadow-none dark:hover:bg-blue-600"
                                            asChild
                                        >
                                            <Link href={show(instance.id).url}>
                                                Setup +{instance.phone_number}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
