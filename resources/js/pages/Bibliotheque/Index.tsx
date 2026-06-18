import { Head } from '@inertiajs/react';
import { FileText, HelpCircle, Image, Library, Phone } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type {
    AgentConfig,
    Asset,
    BreadcrumbItem,
    EvolutionInstance,
} from '@/types';
import { DocumentsTab } from './Partials/DocumentsTab';
import { FaqTab } from './Partials/FaqTab';
import { MediaTab } from './Partials/MediaTab';
import { WhatsappTab } from './Partials/WhatsappTab';
import type { Faq, FaqPaginated } from './types';

interface KnowledgeDocument {
    id: string;
    name: string;
    file_path?: string | null;
    file_size?: number | null;
    file_size_formatted?: string;
    file_type?: string;
    folder?: string;
    usage_count?: number;
    status: string;
    created_at: string;
    updated_at: string;
    agent_config_id?: string | null;
    team_id?: number | null;
    agent?: AgentConfig | null;
}

interface DocumentStats {
    total: number;
    words_analyzed: number;
    size_bytes: number;
    size_gb: number;
    sources: number;
}

interface WhatsappStats {
    connected: number;
    total: number;
    messages_today: number;
}

interface BibliothequeIndexProps {
    documents: KnowledgeDocument[];
    documentStats: DocumentStats;
    qualityScore: number;
    faqs: FaqPaginated;
    suggestions: Faq[];
    agents: { id: string; name: string }[];
    instances: EvolutionInstance[];
    whatsappStats: WhatsappStats;
    assets: Asset[];
    canCreate: boolean;
    canManage: boolean;
    tenantId: string;
}

export default function BibliothequeIndex({
    documents,
    documentStats,
    qualityScore,
    faqs,
    suggestions,
    agents,
    instances,
    whatsappStats,
    assets,
    canCreate,
    canManage,
    tenantId,
}: BibliothequeIndexProps) {
    const activeWorkspace = useActiveWorkspace();
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.title'),
            href: '/dashboard',
        },
        {
            title: t('bibliotheque.title'),
            href: '',
        },
    ];

    const [activeTab, setActiveTab] = useState(() => {
        return (
            new URLSearchParams(window.location.search).get('tab') ||
            'documents'
        );
    });

    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
        window.history.replaceState(null, '', `?tab=${value}`);
    }, []);

    const tabConfig = [
        {
            value: 'documents',
            label: t('bibliotheque.tabs.documents'),
            icon: FileText,
            count: documents.length,
        },
        {
            value: 'faq',
            label: t('bibliotheque.tabs.faq'),
            icon: HelpCircle,
            count: faqs?.data?.length ?? 0,
        },
        {
            value: 'whatsapp',
            label: t('bibliotheque.tabs.whatsapp'),
            icon: Phone,
            count: instances.length,
        },
        {
            value: 'media',
            label: t('bibliotheque.tabs.media'),
            icon: Image,
            count: assets.length,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('bibliotheque.title')} />

            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="space-y-6">
                    {/* Header */}

                    <div className="mb-6 rounded-xl bg-card p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <Library className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                                <div>
                                    <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
                                        {t('bibliotheque.title')}
                                    </h1>
                                    <p className="text-xs text-muted-foreground sm:text-sm">
                                        {t('bibliotheque.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full"
                    >
                        <TabsList className="w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-xl bg-muted/50 p-1 [-webkit-overflow-scrolling:touch]">
                            {tabConfig.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    <Badge
                                        variant="secondary"
                                        className="ml-1 text-xs"
                                    >
                                        {tab.count}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="documents" className="mt-6">
                            <DocumentsTab
                                documents={documents}
                                stats={documentStats}
                                qualityScore={qualityScore}
                                canManage={canManage}
                                tenantId={tenantId}
                            />
                        </TabsContent>

                        <TabsContent value="faq" className="mt-6">
                            <FaqTab
                                faqs={faqs}
                                suggestions={suggestions}
                                agents={agents}
                                canCreate={canCreate}
                                canManage={canManage}
                            />
                        </TabsContent>

                        <TabsContent value="whatsapp" className="mt-6">
                            <WhatsappTab
                                instances={instances}
                                stats={whatsappStats}
                                slug={activeWorkspace?.slug ?? ''}
                                canCreate={canCreate}
                                canManage={canManage}
                            />
                        </TabsContent>

                        <TabsContent value="media" className="mt-6">
                            <MediaTab
                                assets={assets}
                                canCreate={canCreate}
                                canManage={canManage}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
