import { Head, router } from '@inertiajs/react';
import { Users, Phone, Bot, Image, ChartArea } from 'lucide-react';
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
            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 via-green-600 to-teal-700 p-4 shadow-xl ring-1 ring-emerald-400/30 sm:p-5 md:p-6 dark:from-emerald-700 
                dark:via-green-800 dark:to-teal-800
                    dark:ring-emerald-400/30">

                        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* LEFT */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    
                                    <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md">
                                    <ChartArea className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                    </div>

                                    <h1 className="text-lg font-semibold text-white sm:text-xl md:text-3xl">
                                    {t('reports.title')}
                                    </h1>
                                </div>

                                <p className="text-xs text-white/80 sm:text-sm md:text-base max-w-xs sm:max-w-md">
                                {t('reports.description')}
                                </p>
                            </div>
                            {/* Right */}
                                            
                            
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
