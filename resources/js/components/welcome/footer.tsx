'use client';
import type { TFunction } from 'i18next';
import { Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../theme-toggle';

interface FooterProps {
    t: TFunction;
}

export function Footer({ t }: FooterProps) {
    const footerLinks = [
        {
            titleKey: 'welcome.footer.company',
            title: 'Company',
            links: [
                {
                    href: '#',
                    labelKey: 'welcome.footer.blog',
                    label: 'Engineering Blog',
                },
                {
                    href: '#',
                    labelKey: 'welcome.footer.whatsnew',
                    label: "What's New",
                },
                { href: '#', labelKey: 'welcome.footer.about', label: 'About' },
            ],
        },
        {
            titleKey: 'welcome.footer.support',
            title: 'Support',
            links: [
                {
                    href: '#',
                    labelKey: 'welcome.footer.help',
                    label: 'Help Topics',
                },
                {
                    href: '#',
                    labelKey: 'welcome.footer.gettingStarted',
                    label: 'Getting Started',
                },
                { href: '#', labelKey: 'welcome.footer.faq', label: 'FAQs' },
                {
                    href: '#',
                    labelKey: 'welcome.footer.report',
                    label: 'Report a Violation',
                },
            ],
        },
        {
            titleKey: 'welcome.footer.legal',
            title: 'Legal',
            links: [
                {
                    href: '#',
                    labelKey: 'welcome.footer.terms',
                    label: 'Terms & Conditions',
                },
                {
                    href: '#',
                    labelKey: 'welcome.footer.privacy',
                    label: 'Privacy Notice',
                },
                {
                    href: '#',
                    labelKey: 'welcome.footer.cookies',
                    label: 'Cookie Notice',
                },
                {
                    href: '#',
                    labelKey: 'welcome.footer.trust',
                    label: 'Trust Center',
                },
                {
                    href: '#',
                    labelKey: 'welcome.footer.preferences',
                    label: 'Cookie Preferences',
                },
            ],
        },
    ];

    const socialLinks = [
        {
            icon: <Instagram className="h-5 w-5" />,
            href: '#',
            labelKey: 'welcome.footer.instagram',
        },
        {
            icon: <Linkedin className="h-5 w-5" />,
            href: '#',
            labelKey: 'welcome.footer.linkedin',
        },
        {
            icon: <XIcon className="h-5 w-5" />,
            href: '#',
            labelKey: 'welcome.footer.twitter',
        },
    ];

    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {footerLinks.map((item) => (
                        <div key={item.titleKey}>
                            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                                {t(item.titleKey, item.title)}
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                {item.links.map((link) => (
                                    <li key={link.labelKey}>
                                        <a
                                            className="transition-colors hover:text-purple-600 dark:hover:text-purple-400"
                                            href={link.href}
                                        >
                                            {t(link.labelKey, link.label)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <Button
                                asChild
                                key={social.labelKey}
                                size="sm"
                                variant="outline"
                                className="h-10 w-10 rounded-full"
                            >
                                <a
                                    href={social.href}
                                    aria-label={t(
                                        social.labelKey,
                                        'Social link',
                                    )}
                                >
                                    {social.icon}
                                </a>
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} MYIA.{' '}
                        {t('welcome.footer.copyright', 'All rights reserved')}
                    </p>
                </div>
            </div>
        </footer>
    );
}

function XIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="m18.9,1.153h3.682l-8.042,9.189,9.46,12.506h-7.405l-5.804-7.583-6.634,7.583H.469l8.6-9.831L0,1.153h7.593l5.241,6.931,6.065-6.931Zm-1.293,19.494h2.039L6.482,3.239h-2.19l13.314,17.408Z" />
        </svg>
    );
}
