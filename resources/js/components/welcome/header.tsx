'use client';
import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { Button } from '@/components/ui/button';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';
import LanguageSwitcher from './LanguageSwitcher';
import { MobileNav } from './mobile-nav';
import { Logo } from './welcom-logo';

export const navLinks = [
    {
        label: 'Features',
        href: '#',
    },
    {
        label: 'Pricing',
        href: '#',
    },
    {
        label: 'About',
        href: '#',
    },
];

export function Header({
    canRegister,
    auth,
    t,
}: {
    canRegister?: boolean;
    auth: Auth;
    t: TFunction;
}) {
    const scrolled = useScroll(10);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
                {
                    'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow':
                        scrolled,
                },
            )}
        >
            <nav
                className={cn(
                    'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
                    {
                        'md:px-2': scrolled,
                    },
                )}
            >
                <a
                    className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
                    href="#"
                >
                    <Logo />
                </a>
                <div className="hidden items-center gap-2 md:flex">
                    {auth.user ? (
                        <Button size="sm" asChild>
                            <Link href={dashboard()}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <div>
                                {navLinks.map((link) => (
                                    <Button
                                        asChild
                                        key={link.label}
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <a href={link.href}>{link.label}</a>
                                    </Button>
                                ))}
                            </div>
                            <Button size="sm" variant="outline" asChild>
                                <Link href={login()}>Log in</Link>
                            </Button>

                            {canRegister && (
                                <Button size="sm" asChild>
                                    <Link href={register()}>
                                        {t('welcome.buttonStarted')}
                                    </Link>
                                </Button>
                            )}

                            <LanguageSwitcher />
                        </>
                    )}
                </div>
                <MobileNav t={t} canRegister={canRegister} />
            </nav>
        </header>
    );
}
