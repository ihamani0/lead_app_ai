import { usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bot,
    Home,
    LayoutDashboard,
    Library,
    UserCheck,
    Users,
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
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import teams from '@/routes/teams';
import workspaces from '@/routes/workspaces';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { LanguageSwitcher } from './language-switcher';
import { NavFooter } from './nav-footer';
import { NavUser } from './nav-user';
import { Separator } from './ui/separator';

export function AppSidebar() {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();
    const { locale, availableLocales } = usePage<{
        locale: string;
        availableLocales: string[];
    }>().props;

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
            title: t('messages.leads'),
            href: activeWorkspace
                ? workspaces.leads.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: Users,
            'data-tour': 'sidebar-leads',
        },
        {
            title: t('messages.bibliotheque'),
            href: activeWorkspace
                ? workspaces.bibliotheque.index({ slug: activeWorkspace.slug })
                      .url
                : teams.index().url,
            icon: Library,
            'data-tour': 'sidebar-bibliotheque',
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
            title: 'Reports',
            href: activeWorkspace
                ? workspaces.reports.index({ slug: activeWorkspace.slug }).url
                : teams.index().url,
            icon: BarChart3,
            'data-tour': 'sidebar-reports',
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
                <NavMain items={mainNavItems} />
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
