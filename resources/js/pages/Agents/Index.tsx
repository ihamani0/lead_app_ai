import { Head, Link } from '@inertiajs/react';
import { Bot, Phone, PlusCircle, Settings, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
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
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('agents.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header - Purple/Violet Gradient */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 via-purple-700 to-indigo-800 p-8 shadow-2xl ring-1 ring-violet-400/30 md:p-12 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 dark:ring-violet-700/50">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />
                        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-md">
                                        <Bot className="h-8 w-8 text-white" />
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl">
                                        {t('agents.title')}
                                    </h1>
                                </div>
                                <p className="max-w-xl text-lg font-light text-white/90">
                                    {t('agents.subtitle')}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
                                    <Sparkles className="h-4 w-4" />
                                    <span>
                                        {agents.length}{' '}
                                        {t('agents.agentsCount')}
                                    </span>
                                </div>
                            </div>
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
                                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${isActive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
                                                    >
                                                        <Bot className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl font-bold tracking-tight">
                                                            {agent.instance?.instance_name?.split(
                                                                '-',
                                                            )[1] ||
                                                                t(
                                                                    'agents.assistant',
                                                                )}
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
                                                                ? t(
                                                                      'agents.status.running',
                                                                  )
                                                                : t(
                                                                      'agents.status.paused',
                                                                  )
                                                            : t(
                                                                  'agents.status.offline',
                                                              )}
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
                                                        {agent.instance
                                                            ?.phone_number
                                                            ? `+ ${agent.instance?.phone_number}`
                                                            : '--- --- ---'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative rounded-xl border border-slate-100 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                                    {t('agents.brain_config')}
                                                </p>
                                                <p className="line-clamp-3 min-h-18 text-sm leading-relaxed text-slate-600 italic dark:text-slate-400">
                                                    "
                                                    {agent.system_prompt ||
                                                        t(
                                                            'agents.brain_placeholder',
                                                        )}
                                                    "
                                                </p>
                                                {/* <div className="absolute bottom-0 left-0 h-1 w-0 bg-purple-500 transition-all duration-500 group-hover:w-full" /> */}
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
                                                        {t(
                                                            'agents.config_settings',
                                                        )}
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
                                    {t('agents.empty_title')}
                                </h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">
                                    {t('agents.empty_description')}
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
                                            {t('agents.numbers_available')}
                                        </h3>
                                        <p className="mt-1 text-blue-700/80 dark:text-blue-400/80">
                                            {t('agents.deploy_description')}
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
                                                {t('agents.setup')} +
                                                {instance.phone_number}
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
