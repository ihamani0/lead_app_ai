import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    Image,
    LayoutGrid,
    Users,
    BarChart3,
    Settings,
    Activity,
    CreditCard,
    Home,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
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
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import { index as indexAgent } from '@/routes/agents';
import { index as indexDocs } from '@/routes/knowledge';
import { index as indexLeads } from '@/routes/leads';
import { index as indexMedia } from '@/routes/media';
import { edit, index as indexProfil } from '@/routes/profile';
import { index as indexReports } from '@/routes/reports';
import superAdmin from '@/routes/super-admin';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { LanguageSwitcher } from './language-switcher';
import { NavFooter } from './nav-footer';
import { NavUser } from './nav-user';
import { Separator } from './ui/separator';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

type PageProps = {
    locale: string;
    availableLocales: string[];
    auth: {
        user: {
            id: string;
            name: string;
            email: string;
            is_super_admin: boolean;
        };
    };
};

export function AppSidebar() {
    const { t } = useTranslation();

    const page = usePage<PageProps>();

    const { locale, availableLocales } = page.props;

    const mainNavItems: NavItem[] = [
        {
            title: t('messages.dashboard'),
            href: dashboard(),
            icon: Home,
            'data-tour': 'sidebar-dashboard',
        },

        {
            title: t('messages.agents'),
            href: indexAgent().url,
            icon: Bot,
            'data-tour': 'sidebar-agents',
        },

        {
            title: t('messages.whatsapp'),
            href: indexProfil().url,
            icon: WhatsAppIcon,
            'data-tour': 'sidebar-instances',
        },

        {
            title: t('messages.leads'),
            href: indexLeads().url,
            icon: Users,
            'data-tour': 'sidebar-leads',
        },
        {
            title: t('messages.media_assets'),
            href: indexMedia().url,
            icon: Image,
            'data-tour': 'sidebar-media',
        },
        {
            title: t('messages.documentation'),
            href: indexDocs().url,
            icon: BookOpen,
            'data-tour': 'sidebar-docs',
        },
        {
            title: 'Reports',
            href: indexReports().url,
            icon: BarChart3,
            'data-tour': 'sidebar-reports',
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('messages.settings'),
            href: edit().url,
            icon: Settings,
        },
    ];

    const superAdminGroups = [
        {
            label: 'Dashboard',
            items: [
                {
                    title: 'Dashboard',
                    href: superAdmin.dashboard().url,
                    icon: LayoutGrid,
                    'data-tour': 'sidebar-dashboard',
                },
            ],
        },
        {
            label: 'TENANT MANAGEMENT',
            items: [
                {
                    title: 'Tenants',
                    href: admin.tenant.index().url,
                    icon: Users,
                },
                {
                    title: 'AI Models',
                    href: '/super-admin/models',
                    icon: Bot,
                },
                {
                    title: 'Plans & Pricing',
                    href: '/super-admin/plans',
                    icon: CreditCard,
                },
            ],
        },
        {
            label: 'SYSTEM REPORTS',
            items: [
                {
                    title: 'System Reports',
                    href: '/super-admin/reports',
                    icon: BarChart3,
                },
                {
                    title: 'Token Usage',
                    href: '/super-admin/token-usage',
                    icon: Activity,
                },
            ],
        },
        {
            label: 'ADMINISTRATION',
            items: [
                { title: 'All Users', href: '/super-admin/users', icon: Users },
                {
                    title: 'System Settings',
                    href: '/super-admin/settings',
                    icon: Settings,
                },
            ],
        },
    ];

    const isSuperAdmin = page.props.auth?.user?.is_super_admin;

    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="my-4" />
            <SidebarContent>
                {!isSuperAdmin && <NavMain items={mainNavItems} />}
                {isSuperAdmin &&
                    superAdminGroups.map((group, index) => (
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
                {/* <NavUser /> */}

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
