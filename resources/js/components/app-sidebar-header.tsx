import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { LanguageSwitcher } from './language-switcher';
import { NavUser } from './nav-user';

type PageProps = {
    locale: string;
    availableLocales: string[];
};

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage<PageProps>();
    const { locale, availableLocales } = page.props;

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto  items-center gap-4 hidden md:flex">
                <LanguageSwitcher
                    availableLocales={availableLocales}
                    currentLocale={locale}
                />
                <NavUser />
            </div>
        </header>
    );
}
