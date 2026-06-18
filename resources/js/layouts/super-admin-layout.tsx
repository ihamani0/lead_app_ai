import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SuperAdminSidebar } from '@/components/super-admin-sidebar';
import { useFlash } from '@/hooks/use-flash';
import i18n from '@/i18n';
import type { AppLayoutProps } from '@/types';

export default function SuperAdminLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    useFlash();

    const { locale, langVersion } = usePage().props;

    useEffect(() => {
        if (i18n.language !== locale) {
            i18n.services.backendConnector.backend.options.loadPath = `/translations/{{lng}}?v=${langVersion}`;

            i18n.changeLanguage(locale as string);
        }
    }, [locale, langVersion]);

    return (
        <AppShell variant="sidebar">
            <SuperAdminSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
