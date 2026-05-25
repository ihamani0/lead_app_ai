import { usePage } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    Briefcase,
    Image,
    LayoutGrid,
    UserCheck,
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
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import admin from '@/routes/admin';
import superAdmin from '@/routes/super-admin';
import teams, { show as teamsShow } from '@/routes/teams';
import workspaces from '@/routes/workspaces';
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
    const activeWorkspace = useActiveWorkspace();

    const mainNavItems: NavItem[] = [
        {
            title: t('messages.dashboard'),
            href: activeWorkspace
                ? workspaces.dashboard({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: Home,
            'data-tour': 'sidebar-dashboard',
        },

        {
            title: t('messages.agents'),
            href: activeWorkspace
                ? workspaces.agents.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: Bot,
            'data-tour': 'sidebar-agents',
        },

        {
            title: t('messages.whatsapp'),
            href: activeWorkspace
                ? workspaces.instances.index({ slug: activeWorkspace.slug }).url
                : '#',
            icon: WhatsAppIcon,
            'data-tour': 'sidebar-instances',
        },

        {
            title: t('messages.leads'),
            href: activeWorkspace
                ? workspaces.leads.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: Users,
            'data-tour': 'sidebar-leads',
        },
        {
            title: t('workspace.members.title'),
            href: activeWorkspace
                ? workspaces.members.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: UserCheck,
            'data-tour': 'sidebar-members',
        },
        {
            title: t('messages.media_assets'),
            href: activeWorkspace
                ? workspaces.media.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: Image,
            'data-tour': 'sidebar-media',
        },
        {
            title: t('messages.documentation'),
            href: activeWorkspace
                ? workspaces.knowledge.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: BookOpen,
            'data-tour': 'sidebar-docs',
        },
        {
            title: 'Reports',
            href: activeWorkspace
                ? workspaces.reports.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: BarChart3,
            'data-tour': 'sidebar-reports',
        },
    ];

    const footerNavItems: NavItem[] = [
        ...(activeWorkspace
            ? [
                  {
                      title: t('workspace.title'),
                      href: teamsShow({ slug: activeWorkspace.slug }).url,
                      icon: Briefcase,
                  },
              ]
            : []),
        {
            title: t('messages.settings'),
            href: teams.index().url,
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
                            {/* <Link href={dashboard()} prefetch>
                            </Link> */}
                                <AppLogo />
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
