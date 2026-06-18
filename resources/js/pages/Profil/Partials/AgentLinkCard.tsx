import { Link } from '@inertiajs/react';
import { Bot, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';
import type { AgentConfig } from '@/types';

interface AgentLinkCardProps {
    agentConfig?: AgentConfig | null;
}

export function AgentLinkCard({ agentConfig }: AgentLinkCardProps) {
    const activeWorkspace = useActiveWorkspace();
    const { t } = useTranslation();

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    Agent lié
                </CardTitle>
            </CardHeader>
            <CardContent>
                {agentConfig ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {agentConfig.name || t('agents.assistant')}
                                </p>
                                <p className="text-xs text-muted-foreground">
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
                            className="gap-1.5"
                        >
                            <Link
                                href={
                                    activeWorkspace
                                        ? workspaces.agents.show({
                                              slug: activeWorkspace.slug,
                                              agent: agentConfig.id,
                                          }).url
                                        : '#'
                                }
                            >
                                Voir l'agent
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Aucun agent lié
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Liez cette instance à un agent pour
                                    automatiser les conversations
                                </p>
                            </div>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link
                                href={
                                    activeWorkspace
                                        ? workspaces.agents.index({
                                              slug: activeWorkspace.slug,
                                          }).url
                                        : '#'
                                }
                            >
                                Agents
                                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
