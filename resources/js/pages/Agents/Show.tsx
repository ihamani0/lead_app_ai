import { Head, router } from '@inertiajs/react';
import {
    Bot,
    Settings,
    Brain,
    Shield,
    BookOpen,
    ChevronLeft,
    Copy,
    Play,
    Pause,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import agents from '@/routes/agents';

import type { AgentConfig, BreadcrumbItem, EvolutionInstance } from '@/types';

import AgentBlockList from './Partials/AgentBlockList';
import AgentBrainEditor from './Partials/AgentBrainEditor';
import AgentConversationLogs from './Partials/AgentConversationLogs';
import AgentInstanceManager from './Partials/AgentInstanceManager';
import AgentKnowledgeBase from './Partials/AgentKnowledgeBase';
import AgentOverview from './Partials/AgentOverview';

type NavItem = {
    id: string;
    label: string;
    icon: typeof Brain;
};

interface AgentWithRelations extends AgentConfig {
    instance?: EvolutionInstance | null;
    knowledge_bases_count?: number;
    knowledgeBases?: Array<{
        id: string;
        name: string;
        status: string;
        created_at: string;
    }>;
}

interface Props {
    agent: AgentWithRelations;
    availableInstances: EvolutionInstance[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Agents', href: '/agents' },
];

type TabId =
    | 'overview'
    | 'instance'
    | 'brain'
    | 'blocklist'
    | 'knowledge'
    | 'logs';

export default function AgentShow({ agent, availableInstances }: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [isCloning, setIsCloning] = useState(false);

    const navItems: NavItem[] = [
        { id: 'overview', label: t('agents.config.overview'), icon: Settings },
        { id: 'instance', label: t('agents.config.instance'), icon: Bot },
        { id: 'brain', label: t('agents.config.brain'), icon: Brain },
        { id: 'blocklist', label: t('agents.config.blocklist'), icon: Shield },
        {
            id: 'knowledge',
            label: t('agents.config.knowledge'),
            icon: BookOpen,
        },
        // { id: 'logs', label: t('agents.config.logs'), icon: History },
    ];

    const isLinked = agent.evolution_instance_id !== null;
    const isConnected = isLinked && agent.instance?.status === 'connected';
    const isActive = agent.is_active && isConnected;

    const handleClone = () => {
        setIsCloning(true);
        router.post(
            agents.clone(agent.id).url,
            {},
            {
                onFinish: () => setIsCloning(false),
            },
        );
    };

    const handleToggle = () => {
        router.patch(agents.toggle(agent.id).url);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AgentOverview agent={agent} />;
            case 'instance':
                return (
                    <AgentInstanceManager
                        agent={agent}
                        availableInstances={availableInstances}
                    />
                );
            case 'brain':
                return <AgentBrainEditor agent={agent} />;
            case 'blocklist':
                return <AgentBlockList agent={agent} />;
            case 'knowledge':
                return <AgentKnowledgeBase agent={agent} />;
            case 'logs':
                return <AgentConversationLogs agent={agent} />;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${agent.name || t('agents.assistant')} - ${t('agents.config.title')}`}
            />

            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => router.get('/agents')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                        <Bot className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="truncate text-sm font-semibold">
                            {agent.name || t('agents.assistant')}
                        </p>
                        <div className="flex items-center gap-1">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500' : isLinked ? 'bg-amber-400' : 'bg-slate-300'}`}
                            />
                            <span className="text-xs text-muted-foreground">
                                {isActive
                                    ? t('agents.status.running')
                                    : isLinked
                                      ? t('agents.status.paused')
                                      : t('agents.status.noInstance')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {isLinked && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleToggle}
                        >
                            {agent.is_active ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleClone}
                        disabled={isCloning}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="border-b bg-card md:hidden">
                <div className="flex overflow-x-auto px-2 py-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabId)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                activeTab === item.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden w-64 shrink-0 border-r bg-card md:block">
                    <div className="flex h-full flex-col">
                        {/* Back button */}
                        <div className="border-b p-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start gap-2"
                                onClick={() => router.get('/agents')}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t('agents.config.backToAgents')}
                            </Button>
                        </div>

                        {/* Agent info header */}
                        <div className="border-b p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                >
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold">
                                        {agent.name || t('agents.assistant')}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500' : isLinked ? 'bg-amber-400' : 'bg-slate-300'}`}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {isActive
                                                ? t('agents.status.running')
                                                : isLinked
                                                  ? t('agents.status.paused')
                                                  : t(
                                                        'agents.status.noInstance',
                                                    )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="mt-4 flex gap-2">
                                {isLinked && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-1 text-xs"
                                        onClick={handleToggle}
                                    >
                                        {agent.is_active ? (
                                            <>
                                                <Pause className="h-3 w-3" />
                                                Pause
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-3 w-3" />
                                                Resume
                                            </>
                                        )}
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-1 text-xs"
                                    onClick={handleClone}
                                    disabled={isCloning}
                                >
                                    <Copy className="h-3 w-3" />
                                    {t('agents.config.clone')}
                                </Button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-2">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() =>
                                                setActiveTab(item.id as TabId)
                                            }
                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                                activeTab === item.id
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="mx-auto max-w-6xl">{renderContent()}</div>
                </div>
            </div>
        </AppLayout>
    );
}
