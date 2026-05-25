import { usePage, Link } from '@inertiajs/react';
import { Bell, CreditCard } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AppContent } from '@/components/app-content';
import AppLogo from '@/components/app-logo';
import { AppShell } from '@/components/app-shell';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useFlash } from '@/hooks/use-flash';
import { useInitials } from '@/hooks/use-initials';
import i18n from '@/i18n';
import { index as teamsIndex } from '@/routes/teams';

interface Props {
    children: ReactNode;
    title?: string;
}

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            avatar?: string;
            tenant: {
                name: string;
                slug: string;
                plan: string;
                credit: number;
                is_low_credit: boolean;
            };
        };
        workspaces?: Array<{ id: string; name: string; slug: string }>;
    };
    locale: string;
    langVersion: number;
    availableLocales: string[];
};

export default function WorkspaceLayout({ children, title }: Props) {
    useFlash();

    const page = usePage<PageProps>();
    const { locale, langVersion, auth, availableLocales } = page.props;
    const getInitials = useInitials();
    const plan = auth?.user?.tenant?.plan ?? '';
    const credit = auth?.user?.tenant?.credit ?? 0;
    const isLowCredit = auth?.user?.tenant?.is_low_credit ?? false;

    useEffect(() => {
        if (i18n.language !== locale) {
            i18n.services.backendConnector.backend.options.loadPath =
                `/translations/{{lng}}?v=${langVersion}`;
            i18n.changeLanguage(locale as string);
        }
    }, [locale, langVersion]);

    return (
        <AppShell variant="header">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/80 px-6 md:px-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={teamsIndex().url}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>
                    {title && (
                        <>
                            <span className="hidden text-sm font-medium text-muted-foreground md:inline">
                                /
                            </span>
                            <span className="hidden text-sm font-semibold md:inline">
                                {title}
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {plan && (
                        <Badge
                            variant="secondary"
                            className="hidden px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider md:inline-flex"
                        >
                            {plan}
                        </Badge>
                    )}

                    <div className="flex items-center gap-2 rounded-xl border px-3 py-1.5">
                        <CreditCard
                            className={`size-4 ${isLowCredit ? 'text-red-500' : 'text-blue-600'}`}
                        />
                        <span
                            className={`text-sm font-semibold ${isLowCredit ? 'text-red-700' : 'text-slate-800 dark:text-slate-200'}`}
                        >
                            ${credit.toFixed(2)}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative size-9"
                    >
                        <Bell className="size-4" />
                    </Button>

                    <LanguageSwitcher
                        availableLocales={availableLocales}
                        currentLocale={locale}
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="size-9 rounded-full p-0"
                            >
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="rounded-lg bg-purple-200 text-purple-900 dark:bg-purple-600 dark:text-purple-100">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="end"
                        >
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <AppContent>{children}</AppContent>

            <Toaster position="top-center" />
        </AppShell>
    );
}
