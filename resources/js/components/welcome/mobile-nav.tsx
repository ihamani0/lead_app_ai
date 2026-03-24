import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { XIcon, MenuIcon } from 'lucide-react';
import React from 'react';
import { Portal, PortalBackdrop } from '@/components/portal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';
import { navLinks } from './header';
import LanguageSwitcher from './LanguageSwitcher';

export function MobileNav({
    canRegister,
    t,
}: {
    canRegister?: boolean;
    t: TFunction;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="md:hidden">
            <Button
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label="Toggle menu"
                className="md:hidden"
                onClick={() => setOpen(!open)}
                size="icon"
                variant="outline"
            >
                {open ? (
                    <XIcon className="size-4.5" />
                ) : (
                    <MenuIcon className="size-4.5" />
                )}
            </Button>
            {open && (
                <Portal className="top-14" id="mobile-menu">
                    <PortalBackdrop />
                    <div
                        className={cn(
                            'ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97',
                            'size-full p-4',
                        )}
                        data-slot={open ? 'open' : 'closed'}
                    >
                        <div className="grid gap-y-2">
                            {navLinks.map(
                                (link: { label: string; href: string }) => (
                                    <Button
                                        asChild
                                        className="justify-start"
                                        key={link.label}
                                        variant="ghost"
                                    >
                                        <a href={link.href}>{link.label}</a>
                                    </Button>
                                ),
                            )}
                        </div>
                        <div className="mt-12 flex flex-col gap-2">
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
                        </div>
                    </div>
                    <div className="mt-12 flex flex-col gap-2">
                        <LanguageSwitcher />
                    </div>
                </Portal>
            )}
        </div>
    );
}
