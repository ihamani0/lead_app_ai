import { Head, router } from '@inertiajs/react';
import {
    Bot,
    ChevronLeft,
    User,
    BookOpen,
    Settings,
    MessageSquare,
    Image,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import workspaces from '@/routes/workspaces';

import type {
    AgentConfig,
    Asset,
    BreadcrumbItem,
    EvolutionInstance,
} from '@/types';

import AgentIdentite from './Partials/AgentIdentite';
import AgentInstanceManager from './Partials/AgentInstanceManager';
import AgentKnowledgeBase from './Partials/AgentKnowledgeBase';
import AgentParametres from './Partials/AgentParametres';
import MediasPlaceholder from './Partials/MediasPlaceholder';
import TestChat from './Partials/TestChat';

interface TestMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface TestConversation {
    messages: TestMessage[];
}

interface AgentWithRelations extends AgentConfig {
    instance?: EvolutionInstance | null;
    knowledge_bases_count?: number;
    knowledgeBases?: Array<{
        id: string;
        name: string;
        status: string;
        created_at: string;
    }>;
    mediaAssets?: Asset[];
}

interface AgentStats {
    total_conversations: number;
    qualified_leads: number;
    satisfaction_rate: number | null;
    last_activity: string | null;
    messages_today: number;
}

interface Props {
    agent: AgentWithRelations;
    availableInstances: EvolutionInstance[];
    stats: AgentStats;
    canManage: boolean;
    testConversation: TestConversation | null;
    mediaAssets: Asset[];
}

type TabId =
    | 'identite'
    | 'connexions'
    | 'connaissances'
    | 'parametres'
    | 'test'
    | 'medias';

interface TabConfig {
    id: TabId;
    label: string;
    // Accept any React component that renders an SVG/icon and accepts className prop
    icon: ComponentType<{ className?: string }>;
}

export default function AgentShow({
    agent,
    availableInstances,
    stats,
    canManage,
    testConversation,
    mediaAssets,
}: Props) {
    const activeWorkspace = useActiveWorkspace()!;
    const { t } = useTranslation();

    const tabs: TabConfig[] = [
        { id: 'identite', label: 'Identité', icon: User },
        { id: 'connexions', label: 'Connexions', icon: WhatsAppIcon },
        { id: 'connaissances', label: 'Connaissances', icon: BookOpen },
        { id: 'medias', label: 'Médias', icon: Image },
        { id: 'test', label: 'Test IA', icon: MessageSquare },
        { id: 'parametres', label: 'Paramètres', icon: Settings },
    ];

    const [activeTab, setActiveTab] = useState<TabId>(() => {
        const saved = localStorage.getItem(`agent-tab-${agent.id}`);
        if (saved && tabs.some((t) => t.id === saved)) {
            return saved as TabId;
        }
        return 'identite';
    });
    const [isCloning, setIsCloning] = useState(false);

    const slug = activeWorkspace.slug;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/' },
        {
            title: 'Agents',
            href: workspaces.agents.index({ slug }).url,
        },
    ];

    useEffect(() => {
        localStorage.setItem(`agent-tab-${agent.id}`, activeTab);
    }, [activeTab, agent.id]);

    const isLinked = agent.evolution_instance_id !== null;
    const isConnected = isLinked && agent.instance?.status === 'connected';
    const isActive = agent.is_active && isConnected;

    const handleClone = () => {
        setIsCloning(true);
        router.post(
            workspaces.agents.clone({ slug, agent: agent.id }).url,
            {},
            {
                onFinish: () => setIsCloning(false),
            },
        );
    };

    const handleToggle = () => {
        router.patch(workspaces.agents.toggle({ slug, agent: agent.id }).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${agent.name || t('agents.assistant')} - ${t('agents.config.title')}`}
            />

            <div className="flex h-[calc(100vh-3.5rem)] flex-col">
                {/* Agent Header */}
                <div className="flex items-center justify-between border-b bg-card px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={() =>
                                router.get(
                                    workspaces.agents.index({ slug }).url,
                                )
                            }
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                isActive
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-base font-semibold">
                                {agent.name || t('agents.assistant')}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        isActive
                                            ? 'bg-green-500'
                                            : isLinked
                                              ? 'bg-amber-400'
                                              : 'bg-slate-300'
                                    }`}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {isActive
                                        ? t('agents.status.running')
                                        : isLinked
                                          ? t('agents.status.paused')
                                          : t('agents.status.noInstance')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Bar */}
                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as TabId)}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="border-b bg-card px-6 py-3">
                        <TabsList variant="line" className="h-14 gap-0">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="flex items-center gap-3 px-6 py-3 text-base font-medium data-[state=active]:text-purple-600 data-[state=active]:shadow-none data-[state=active]:after:bg-purple-600 data-[state=active]:after:opacity-100"
                                >
                                    <tab.icon className="h-5 w-5" />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div
                            className="p-4 md:p-6"
                            style={{
                                maxWidth: '1520px',
                                margin: '0 auto',
                                width: '100%',
                            }}
                        >
                            <TabsContent value="identite" className="mt-0">
                                <AgentIdentite
                                    agent={agent}
                                    slug={slug}
                                    stats={stats}
                                />
                            </TabsContent>

                            <TabsContent value="connexions" className="mt-0">
                                <AgentInstanceManager
                                    agent={agent}
                                    availableInstances={availableInstances}
                                    stats={stats}
                                    onNavigateToTest={() =>
                                        setActiveTab('test')
                                    }
                                />
                            </TabsContent>

                            <TabsContent value="connaissances" className="mt-0">
                                <AgentKnowledgeBase
                                    agent={agent}
                                    canManage={canManage}
                                    slug={slug}
                                />
                            </TabsContent>

                            <TabsContent value="parametres" className="mt-0">
                                <AgentParametres
                                    agent={agent}
                                    isLinked={isLinked}
                                    onToggle={handleToggle}
                                    onClone={handleClone}
                                    isCloning={isCloning}
                                />
                            </TabsContent>

                            <TabsContent value="test" className="mt-0">
                                <TestChat
                                    agent={agent}
                                    testConversation={testConversation}
                                />
                            </TabsContent>

                            <TabsContent value="medias" className="mt-0">
                                <MediasPlaceholder
                                    agent={agent}
                                    assets={mediaAssets}
                                />
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </AppLayout>
    );
}
