import { Link } from '@inertiajs/react';
import { BookOpen, Bot, Image, LayoutGrid, Phone, Users } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as indexAgent } from '@/routes/agents';
import { index as indexDocs } from '@/routes/knowledge';
import { index as indexLeads } from '@/routes/leads';
import { index as indexMedia } from '@/routes/media';
import { index as indexProfil } from '@/routes/profile';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },

    {
        title: 'Profil',
        href: indexProfil().url,
        icon: Phone,
    },
    {
        title: 'Agents',
        href: indexAgent().url,
        icon: Bot,
    },
    {
        title: 'Leads',
        href: indexLeads().url,
        icon: Users,
    },
    {
        title: 'Media Assets',
        href: indexMedia().url,
        icon: Image,
    },
    {
        title: 'Documentation',
        href: indexDocs().url,
        icon: BookOpen,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
