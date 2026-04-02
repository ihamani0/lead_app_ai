import { Bot, Phone, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { AgentConfig, EvolutionInstance } from '@/types';

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
}

export default function AgentOverview({ agent }: Props) {
    const { t } = useTranslation();

    const isLinked = agent.instance !== null;
    const isConnected = isLinked && agent.instance?.status === 'connected';
    const isActive = agent.is_active && isConnected;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {t('agents.config.overview')}
                </h2>
                <p className="text-muted-foreground">
                    {t('agents.config.overviewDesc')}
                </p>
            </div>

            {/* Agent Status Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Status Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Status
                        </CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : isLinked ? 'bg-amber-400' : 'bg-slate-300'}`}
                            />
                            <span className="text-lg font-semibold">
                                {isActive
                                    ? t('agents.status.running')
                                    : isLinked
                                      ? t('agents.status.paused')
                                      : t('agents.status.noInstance')}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Instance Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('agents.config.linkedInstance')}
                        </CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLinked && agent.instance ? (
                            <div className="space-y-1">
                                <p className="font-semibold">
                                    {agent.instance.display_name ||
                                        agent.instance.phone_number ||
                                        '---'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {agent.instance.phone_number || 'No phone'}
                                </p>
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        agent.instance.status === 'connected'
                                            ? 'bg-green-100 text-green-700'
                                            : agent.instance.status ===
                                                'connecting'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    {agent.instance.status}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {t('agents.no_instance')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Knowledge Base Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('agents.config.knowledgeBases')}
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {agent.knowledge_bases_count || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t('agents.config.documents')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Agent Details */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('agents.config.agentDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">
                                {agent.name || t('agents.assistant')}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Provider</p>
                            <p className="font-medium uppercase">
                                {agent.provider}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">
                                {t('agents.config.created')}
                            </p>
                            {agent.created_at && (
                                <p className="font-medium">
                                {formatDate(agent.created_at)}
                            </p>
                            )}
                        </div>
                        <div>
                            <p className="text-muted-foreground">
                                {t('agents.config.lastUpdated')}
                            </p>
                            {agent.updated_at && (
                                <p className="font-medium">
                                {formatDate(agent.updated_at)}
                            </p>
                            )}
                            
                        </div>
                    </div>

                    {/* System Prompt Preview */}
                    <div className="rounded-lg border p-4">
                        <p className="mb-2 text-sm font-medium">
                            {t('agents.brain_config')}
                        </p>
                        <p className="line-clamp-3 text-sm text-muted-foreground italic">
                            "
                            {agent.system_prompt ||
                                t('agents.brain_placeholder')}
                            "
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
