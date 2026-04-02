import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ExternalLink,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import knowledge from '@/routes/knowledge';

interface KnowledgeBase {
    id: string;
    name: string;
    status: string;
    created_at: string;
}

interface AgentWithRelations {
    id: string;
    name: string | null;
    knowledge_bases?: KnowledgeBase[];
    knowledge_bases_count?: number;
}

interface Props {
    agent: AgentWithRelations;
}

export default function AgentKnowledgeBase({ agent }: Props) {

    console.log(agent);
    const { t } = useTranslation();

    const knowledgeBases = agent.knowledge_bases || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'indexed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'processing':
                return (
                    <Clock className="h-4 w-4 animate-spin text-amber-500" />
                );
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-slate-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const classes = {
            indexed: 'bg-green-100 text-green-700',
            processing: 'bg-amber-100 text-amber-700',
            failed: 'bg-red-100 text-red-700',
        };
        const statusClasses =
            classes[status as keyof typeof classes] ||
            'bg-slate-100 text-slate-700';

        return (
            <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses}`}
            >
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </span>
        );
    };

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
                    {t('agents.config.knowledge')}
                </h2>
                <p className="text-muted-foreground">
                    {t('agents.config.knowledgeDesc')}
                </p>
            </div>

            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('agents.config.totalDocs')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {agent.knowledge_bases_count || 0}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('agents.config.indexed')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {
                                knowledgeBases.filter(
                                    (kb) => kb.status === 'indexed',
                                ).length
                            }
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('agents.config.processing')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {
                                knowledgeBases.filter(
                                    (kb) => kb.status === 'processing',
                                ).length
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Knowledge Base List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {t('agents.config.documents')}
                    </CardTitle>
                    <Button asChild variant="outline" size="sm">
                        <Link href={knowledge.index().url}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t('agents.config.manageAll')}
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {knowledgeBases.length > 0 ? (
                        <div className="space-y-3">
                            {knowledgeBases.map((kb) => (
                                <div
                                    key={kb.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                            <FileText className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {kb.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(kb.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(kb.status)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            <BookOpen className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>{t('agents.config.noDocuments')}</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href={knowledge.index().url}>
                                    {t('agents.config.uploadDocs')}
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
