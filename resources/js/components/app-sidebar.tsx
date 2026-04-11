import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    Image,
    LayoutGrid,
    Users,
    BarChart3,
    Settings,
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
import { index as indexAgent } from '@/routes/agents';
import { index as indexDocs } from '@/routes/knowledge';
import { index as indexLeads } from '@/routes/leads';
import { index as indexMedia } from '@/routes/media';
import { edit, index as indexProfil } from '@/routes/profile';
import { index as indexReports } from '@/routes/reports';
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
};

export function AppSidebar() {
    const { t } = useTranslation();

    const page = usePage<PageProps>();
    const { locale, availableLocales } = page.props;

    const mainNavItems: NavItem[] = [
        {
            title: t('messages.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },

        {
            title: t('messages.agents'),
            href: indexAgent().url,
            icon: Bot,
        },

        {
            title: t('messages.whatsapp'),
            href: indexProfil().url,
            icon: WhatsAppIcon,
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
        {
            title: 'Reports',
            href: indexReports().url,
            icon: BarChart3,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('messages.settings'),
            href: edit().url,
            icon: Settings,
        },
    ];

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/* <NavUser /> */}

                <Separator className="my-4 md:hidden" />
                <div className='flex justify-start md:hidden'>
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
