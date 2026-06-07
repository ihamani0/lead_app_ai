import { Copy, Play, Pause, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { AgentConfig } from '@/types';

import AgentBlockList from './AgentBlockList';

interface Props {
    agent: AgentConfig;
    isLinked: boolean;
    onToggle: () => void;
    onClone: () => void;
    isCloning: boolean;
}

export default function AgentParametres({ agent, isLinked, onToggle, onClone, isCloning }: Props) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Left: Actions + Blocklist */}
            <div className="space-y-6">
                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-3">
                        {isLinked && (
                            <Button
                                variant="outline"
                                size="default"
                                className="gap-2"
                                onClick={onToggle}
                            >
                                {agent.is_active ? (
                                    <>
                                        <Pause className="h-4 w-4" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4" />
                                        Resume
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="default"
                            className="gap-2"
                            onClick={onClone}
                            disabled={isCloning}
                        >
                            <Copy className="h-4 w-4" />
                            Dupliquer
                        </Button>
                    </CardContent>
                </Card>

                <AgentBlockList agent={agent} />
            </div>

            {/* Right: KPI Placeholder (future) */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="h-5 w-5" />
                        KPIs & Rapports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Les indicateurs clés et rapports d'activité apparaîtront
                        ici prochainement.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
