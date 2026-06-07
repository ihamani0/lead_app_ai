import { Head, router } from '@inertiajs/react';
import { Bot, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import workspaces from '@/routes/workspaces';
import {
    type AgentConfig,
    type BreadcrumbItem,
    type EvolutionInstance,
} from '@/types';
import { AgentCard } from './Partials/AgentCard';
import { CreateAgentDialog } from './Partials/CreateAgentDialog';
import { LinkInstanceDialog } from './Partials/LinkInstanceDialog';

type Props = {
    agents: AgentConfig[];
    availableInstances: EvolutionInstance[];
    canCreate: boolean;
    canManage: boolean;
};

export default function AgentIndex({
    agents,
    availableInstances,
    canCreate,
    canManage,
}: Props) {
    const activeWorkspace = useActiveWorkspace()!;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Workspaces',
            href: activeWorkspace ? '/workspaces' : '',
        },
        {
            title: 'Home',
            href: activeWorkspace
                ? workspaces.dashboard({ slug: activeWorkspace.slug }).url
                : '',
        },
        { title: 'Agents', href: '' },
    ];

    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(
        null,
    );
    const [cloningId, setCloningId] = useState<string | null>(null);

    const handleOpenLink = (agent: AgentConfig) => {
        setSelectedAgent(agent);
        setLinkOpen(true);
    };

    const handleDelete = (agentId: string) => {
        if (confirm('Delete this agent? This cannot be undone.')) {
            router.delete(
                workspaces.agents.destroy({
                    slug: activeWorkspace.slug,
                    agent: agentId,
                }).url,
            );
        }
    };

    const handleOpenConfig = (agentId: string) => {
        router.get(
            workspaces.agents.show({
                slug: activeWorkspace.slug,
                agent: agentId,
            }).url,
        );
    };

    const handleClone = (agentId: string) => {
        setCloningId(agentId);
        router.post(
            workspaces.agents.clone({ slug: activeWorkspace.slug, agent: agentId }).url,
            {},
            {
                onSuccess: () => toast.success('Agent dupliqué'),
                onFinish: () => setCloningId(null),
            },
        );
    };

    const handleUnlink = (agentId: string) => {
        if (
            confirm(
                'Unlink this instance from the agent? The agent configuration will be preserved.',
            )
        ) {
            router.post(
                workspaces.agents.unlinkInstance({
                    slug: activeWorkspace.slug,
                    agent: agentId,
                }).url,
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('agents.title')} />

            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="space-y-5">
                    {/* Header */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl">
                        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* LEFT */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-xl border bg-muted p-2">
                                        <Bot className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
                                    </div>

                                    <h1 className="text-lg font-semibold text-foreground sm:text-xl md:text-3xl">
                                        {t('agents.title')}
                                    </h1>
                                </div>

                                <p className="max-w-xs text-xs text-muted-foreground sm:max-w-md sm:text-sm md:text-base">
                                    {t('agents.subtitle')}
                                </p>
                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-end">
                                <div className="flex items-center gap-1.5 rounded-full border bg-muted px-2.5 py-1 text-[10px] text-muted-foreground sm:px-3 sm:text-xs">
                                    <Sparkles className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                                    <span>
                                        {agents.length}{' '}
                                        {t('agents.agentsCount')}
                                    </span>
                                </div>

                                {canCreate && (
                                    <div data-tour="agents-create">
                                        <CreateAgentDialog
                                            open={createOpen}
                                            onOpenChange={setCreateOpen}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator className="mb-6" />
                    {/* Available Instances Alert */}
                    {/* {availableInstances.length > 0 && (
                        <div className="relative my-12 overflow-hidden rounded-2xl border border-blue-200/50 bg-linear-to-br from-blue-50/50 to-white p-8 shadow-sm dark:border-blue-900/30 dark:from-blue-950/20 dark:to-background">
                            <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
                                <div className="flex gap-5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100/80 dark:bg-blue-900/30">
                                        <PlusCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight text-blue-950 md:text-xl lg:text-2xl dark:text-blue-50">
                                            {availableInstances.length}{' '}
                                            {t('agents.numbers_available')}
                                        </h3>
                                        <p className="mt-1 text-sm text-blue-700/80 md:text-base dark:text-blue-400/80">
                                            {t('agents.deploy_description')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
                        </div>
                    )} */}

                    {/* Agent Grid */}
                    {agents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {agents.map((agent) => (
                                <AgentCard
                                    key={agent.id}
                                    agent={agent}
                                    canManage={canManage}
                                    onUnlink={handleUnlink}
                                    onOpenLink={handleOpenLink}
                                    onOpenConfig={handleOpenConfig}
                                    onDelete={handleDelete}
                                    onClone={handleClone}
                                    cloningId={cloningId}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white/50 py-24 text-center dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="relative z-10">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Bot className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl lg:text-3xl dark:text-slate-100">
                                    {t('agents.empty_title')}
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 md:text-base dark:text-slate-400">
                                    {t('agents.empty_description')}
                                </p>
                            </div>
                            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
                        </div>
                    )}

                    {/* Link Instance Dialog */}
                    <LinkInstanceDialog
                        agent={selectedAgent}
                        availableInstances={availableInstances}
                        open={linkOpen}
                        onOpenChange={setLinkOpen}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
