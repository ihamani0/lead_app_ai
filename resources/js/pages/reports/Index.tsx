import { Head, router } from '@inertiajs/react';
import { Users, Phone, Bot, Image } from 'lucide-react';
import { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/reports';
import type { BreadcrumbItem } from '@/types';
import type {
    LeadsReportData,
    InstancesReportData,
    AgentsReportData,
    MediaReportData,
} from '@/types/reports';
import {
    LeadsReport,
    InstancesReport,
    AgentsReport,
    MediaReport,
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
    media?: MediaReportData;
};

type ReportsIndexProps = {
    reportData: ReportData;
    activeTab: string;
};

export default function ReportsIndex({
    reportData,
    activeTab,
}: ReportsIndexProps) {
    const { t } = useTranslation();
    const handleTabChange = useCallback((tab: string) => {
        router.get(
            index().url,
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
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        {t('reports.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground md:text-base">
                        {t('reports.description')}
                    </p>
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
                            value="media"
                            className="flex items-center gap-2"
                        >
                            <Image className="h-4 w-4" />
                            {t('reports.tabs.media')}
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

                    <TabsContent value="media" className="mt-6">
                        <MediaReport data={reportData.media ?? null} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
