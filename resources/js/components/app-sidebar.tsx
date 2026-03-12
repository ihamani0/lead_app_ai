import { Link } from '@inertiajs/react';
import { BookOpen, Bot, Image, LayoutGrid, Phone, Users } from 'lucide-react';
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
import { index as indexAgent } from '@/routes/agents';
import { index as indexDocs } from '@/routes/knowledge';
import { index as indexLeads } from '@/routes/leads';
import { index as indexMedia } from '@/routes/media';
import { index as indexProfil } from '@/routes/profile';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { t } = useTranslation();

    const mainNavItems: NavItem[] = [
        {
            title: t('messages.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },

        {
            title: t('messages.profile'),
            href: indexProfil().url,
            icon: Phone,
        },
        {
            title: t('messages.agents'),
            href: indexAgent().url,
            icon: Bot,
        },
        {
            title: t('messages.leads'),
            href: indexLeads().url,
            icon: Users,
        },
        {
            title: t('messages.media_assets'),
            href: indexMedia().url,
            icon: Image,
        },
        {
            title: t('messages.documentation'),
            href: indexDocs().url,
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="offcanvas" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                {/* <NavUser /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
