import { Link } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';
import AppLogo from '../app-logo';
import { Button } from '../ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { MobileNav } from './mobile-nav';

interface HeaderProps {
    canRegister?: boolean;
    auth: Auth;
    t: TFunction;
}

export const navLinks = [
    { labelKey: 'welcome.nav.features', label: 'Features', href: '#features' },
    { labelKey: 'welcome.nav.pricing', label: 'Pricing', href: '#pricing' },
    {
        labelKey: 'welcome.nav.testimonials',
        label: 'Testimonials',
        href: '#testimonials',
    },
    { labelKey: 'welcome.nav.contact', label: 'Contact', href: '#contact' },
];

export const Header = ({ canRegister = true, auth, t }: HeaderProps) => {
    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo />
                    </Link>
                </div>

                <div className="hidden md:flex md:items-center md:gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.labelKey}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            {t(link.labelKey, link.label)}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    {auth.user ? (
                        <Button asChild className="hidden md:inline-flex">
                            <Link href={dashboard()}>
                                {t('welcome.dashboard', 'Dashboard')}
                            </Link>
                        </Button>
                    ) : (
                        <div className="hidden md:flex md:items-center md:gap-3">
                            <Link
                                href={login()}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                {t('welcome.login', 'Log in')}
                            </Link>
                            {canRegister && (
                                <Button asChild>
                                    <Link href={register()}>
                                        {t(
                                            'welcome.buttonStarted',
                                            'Get Started',
                                        )}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}

                    <MobileNav canRegister={canRegister} t={t} />
                </div>
            </div>
        </nav>
    );
};
