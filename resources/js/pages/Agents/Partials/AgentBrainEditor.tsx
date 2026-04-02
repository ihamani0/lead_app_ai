import { router } from '@inertiajs/react';
import { Brain, RotateCcw, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import agents from '@/routes/agents';

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

export default function AgentBrainEditor({ agent }: Props) {
    const { t } = useTranslation();

    const [prompt, setPrompt] = useState(agent.system_prompt || '');

    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const isLinked = agent.instance !== null;
    const isActive = agent.is_active && isLinked && agent.instance?.status === 'connected';

    const hasChanges = prompt !== (agent.system_prompt || '');

    const handleSave = () => {
        setIsSaving(true);
        router.put(
            agents.update(agent.id).url,
            { system_prompt: prompt },
            { onFinish: () => setIsSaving(false) },
        );
    };

    const handleReset = () => {
        if (!confirm(t('agents.config.resetConfirm'))) return;
        setIsResetting(true);
        router.post(
            agents.resetPrompt(agent.id).url,
            {},
            { onFinish: () => setIsResetting(false) },
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {t('agents.config.brain')}
                </h2>
                <p className="text-muted-foreground">
                    {t('agents.config.brainDesc')}
                </p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        {t('agents.brain_config')}
                    </CardTitle>
                    {agent.default_system_prompt && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={isResetting}
                            className="gap-1"
                        >
                            {isResetting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RotateCcw className="h-4 w-4" />
                            )}
                            {t('agents.config.reset')}
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('agents.brain_placeholder')}
                        className="min-h-[300px] font-mono text-sm"
                        disabled={isActive}
                    />

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {isActive
                                ? t('agents.config.promptLocked')
                                : hasChanges
                                  ? t('agents.config.unsavedChanges')
                                  : t('agents.config.noChanges')}
                        </p>
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving || isActive}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {t('agents.config.savePrompt')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* System Prompt Guidelines */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('agents.config.promptGuidelines')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{t('agents.config.guideline1')}</p>
                    <p>{t('agents.config.guideline2')}</p>
                    <p>{t('agents.config.guideline3')}</p>
                </CardContent>
            </Card>
        </div>
    );
}
