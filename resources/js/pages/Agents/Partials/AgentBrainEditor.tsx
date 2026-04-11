import { router } from '@inertiajs/react';
import axios from 'axios';
import {
    Brain,
    RotateCcw,
    Save,
    Loader2,
    History,
    RotateCcwIcon,
    Download,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

interface PromptHistoryRecord {
    id: string;
    version: number;
    system_prompt: string;
    description: string | null;
    created_at: string;
}

interface Props {
    agent: AgentWithRelations;
}

export default function AgentBrainEditor({ agent }: Props) {
    const { t } = useTranslation();

    const [prompt, setPrompt] = useState(agent.system_prompt || '');

    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<PromptHistoryRecord[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [restoringVersion, setRestoringVersion] = useState<number | null>(
        null,
    );
    const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

    const isLinked = agent.instance !== null;
    const isActive =
        agent.is_active && isLinked && agent.instance?.status === 'connected';

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

    const openHistory = async () => {
        setIsLoadingHistory(true);
        setIsHistoryOpen(true);
        setExpandedVersion(null);

        try {
            const response = await axios.get(
                agents.promptHistory(agent.id).url,
            );
            setHistory(response.data.history || []);
        } catch {
            toast.error(t('agents.config.failedToLoadHistory'));
            setIsHistoryOpen(false);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const downloadPrompt = (record: PromptHistoryRecord) => {
        const blob = new Blob([record.system_prompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-v${record.version}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleExpand = (version: number) => {
        setExpandedVersion(expandedVersion === version ? null : version);
    };

    const handleRestore = (version: number) => {
        if (!confirm(t('agents.config.restoreConfirm', { version }))) return;
        setRestoringVersion(version);
        router.post(
            agents.restorePrompt({ agent: agent.id, version }).url,
            {},
            {
                onSuccess: () => {
                    setIsHistoryOpen(false);
                    setRestoringVersion(null);
                    window.location.reload();
                },
                onFinish: () => {
                    setRestoringVersion(null);
                },
            },
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
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
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openHistory}
                            className="gap-1"
                        >
                            <History className="h-4 w-4" />
                            {t('agents.config.history')}
                        </Button>
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
                    </div>
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

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            {t('agents.config.promptHistory')}
                        </DialogTitle>
                    </DialogHeader>
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : history.length > 0 ? (
                        <div className="space-y-3">
                            {history.map((record) => (
                                <div
                                    key={record.id}
                                    className="space-y-2 rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    v{record.version}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        record.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            {record.description && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {record.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    toggleExpand(record.version)
                                                }
                                                className="gap-1"
                                            >
                                                {expandedVersion ===
                                                record.version ? (
                                                    <ChevronUp className="h-3 w-3" />
                                                ) : (
                                                    <ChevronDown className="h-3 w-3" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleRestore(
                                                        record.version,
                                                    )
                                                }
                                                disabled={
                                                    restoringVersion !== null
                                                }
                                                className="gap-1"
                                            >
                                                {restoringVersion ===
                                                record.version ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <RotateCcwIcon className="h-3 w-3" />
                                                )}
                                                {t('agents.config.restore')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    downloadPrompt(record)
                                                }
                                                className="gap-1"
                                                title={t(
                                                    'agents.config.downloadPrompt',
                                                )}
                                            >
                                                <Download className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    {expandedVersion === record.version && (
                                        <div className="mt-2">
                                            <Textarea
                                                value={record.system_prompt}
                                                readOnly
                                                className="max-h-[300px] min-h-[150px] font-mono text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-muted-foreground">
                            {t('agents.config.noHistory')}
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
