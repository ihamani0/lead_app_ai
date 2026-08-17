import { usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    Bot,
    Contact2,
    CreditCard,
    LayoutDashboard,
    LayoutGrid,
    Settings,
    Users,
    Wallet,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslation } from '@/hooks/use-translation';
import admin from '@/routes/admin';
import superAdmin from '@/routes/super-admin';
import teams from '@/routes/teams';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { LanguageSwitcher } from './language-switcher';
import { NavFooter } from './nav-footer';
import { NavUser } from './nav-user';
import { Separator } from './ui/separator';

type PageProps = {
    locale: string;
    availableLocales: string[];
};

export function SuperAdminSidebar() {
    const { t } = useTranslation();

    const page = usePage<PageProps>();

    const { locale, availableLocales } = page.props;

    const superAdminGroups: { label: string; items: NavItem[] }[] = [
        {
            label: t('superAdmin.sidebar.dashboard'),
            items: [
                {
                    title: t('superAdmin.sidebar.dashboard'),
                    href: superAdmin.dashboard().url,
                    icon: LayoutGrid,
                },
            ],
        },
        {
            label: t('superAdmin.sidebar.tenantManagement'),
            items: [
                {
                    title: t('superAdmin.sidebar.tenants'),
                    href: admin.tenant.index().url,
                    icon: Users,
                },
                {
                    title: t('superAdmin.sidebar.leads'),
                    href: admin.leads.index().url,
                    icon: Contact2,
                },
                {
                    title: t('superAdmin.sidebar.aiModels'),
                    href: '/super-admin/models',
                    icon: Bot,
                },
                {
                    title: t('superAdmin.sidebar.plans'),
                    href: admin.plan.index().url,
                    icon: CreditCard,
                },
                {
                    title: t('superAdmin.sidebar.creditPackages'),
                    href: admin.creditPackages.index().url,
                    icon: Wallet,
                },
            ],
        },
        {
            label: t('superAdmin.sidebar.systemReports'),
            items: [
                {
                    title: t('superAdmin.sidebar.reports'),
                    href: admin.reports.index().url,
                    icon: BarChart3,
                },
                {
                    title: t('superAdmin.sidebar.tokenUsage'),
                    href: admin.tokenUsage.index().url,
                    icon: Activity,
                },
            ],
        },
        {
            label: t('superAdmin.sidebar.administration'),
            items: [
                {
                    title: t('superAdmin.sidebar.allUsers'),
                    href: '/super-admin/users',
                    icon: Users,
                },
                {
                    title: t('superAdmin.sidebar.systemSettings'),
                    href: '/super-admin/settings',
                    icon: Settings,
                },
            ],
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('messages.teams'),
            href: teams.index().url,
            icon: LayoutDashboard,
        },
    ];

    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="my-4" />
            <SidebarContent>
                {superAdminGroups.map((group, index) => (
                    <div key={index}>
                        <div className="px-3 py-2">
                            <h2 className="text-xs font-semibold text-muted-foreground">
                                {group.label}
                            </h2>
                        </div>
                        <NavMain items={group.items} />
                    </div>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />

                <Separator className="my-4 md:hidden" />
                <div className="flex justify-start md:hidden">
                    <LanguageSwitcher
                        availableLocales={availableLocales}
                        currentLocale={locale}
                    />
                </div>
                <div className="flex flex-col gap-4 md:hidden">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
