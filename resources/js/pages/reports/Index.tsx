import { Head, router } from '@inertiajs/react';
import { Users, Phone, Bot, Coins, ChartArea } from 'lucide-react';
import { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/workspaces/reports';
import type { BreadcrumbItem } from '@/types';
import type {
    LeadsReportData,
    InstancesReportData,
    AgentsReportData,
    TokenTransactionsReportData,
} from '@/types/reports';
import {
    LeadsReport,
    InstancesReport,
    AgentsReport,
    TokenTransactionsReport,
} from './partials';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports',
        href: '',
    },
];

type ReportData = {
    leads?: LeadsReportData;
    instances?: InstancesReportData;
    agents?: AgentsReportData;
    tokens?: TokenTransactionsReportData;
};

type ReportsIndexProps = {
    reportData: ReportData;
    activeTab: string;
};

export default function ReportsIndex({
    reportData,
    activeTab,
}: ReportsIndexProps) {
    const activeWorkspace = useActiveWorkspace();
    const { t } = useTranslation();
    const handleTabChange = useCallback((tab: string) => {
        router.get(
            index({ slug: activeWorkspace!.slug }).url,
            { tab },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('reports.title')} />
            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                
                <div className="mb-6 rounded-xl bg-card p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <ChartArea className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                            <div>
                                <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
                                    {t('reports.title')}
                                </h1>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                    {t('reports.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            value="leads"
                            className="flex items-center gap-2"
                        >
                            <Users className="h-4 w-4" />
                            {t('reports.tabs.leads')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="instances"
                            className="flex items-center gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            {t('reports.tabs.instances')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="agents"
                            className="flex items-center gap-2"
                        >
                            <Bot className="h-4 w-4" />
                            {t('reports.tabs.agents')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="tokens"
                            className="flex items-center gap-2"
                        >
                            <Coins className="h-4 w-4" />
                            {t('reports.tabs.tokens')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="leads" className="mt-6">
                        <LeadsReport data={reportData.leads ?? null} />
                    </TabsContent>

                    <TabsContent value="instances" className="mt-6">
                        <InstancesReport data={reportData.instances ?? null} />
                    </TabsContent>

                    <TabsContent value="agents" className="mt-6">
                        <AgentsReport data={reportData.agents ?? null} />
                    </TabsContent>

                    <TabsContent value="tokens" className="mt-6">
                        <TokenTransactionsReport data={reportData.tokens ?? null} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
