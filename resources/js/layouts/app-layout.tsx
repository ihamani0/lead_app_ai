import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useFlash } from '@/hooks/use-flash';
import i18n from '@/i18n';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    useFlash();

    const { locale , langVersion } = usePage().props;

    useEffect(() => {
        if (i18n.language !== locale) {
            // Update load path with latest version before switching
            i18n.services.backendConnector.backend.options.loadPath = `/translations/{{lng}}?v=${langVersion}`;

            i18n.changeLanguage(locale as string);
        }
    }, [locale, langVersion]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}

            <Toaster position="top-center" />
        </AppLayoutTemplate>
    );
}
