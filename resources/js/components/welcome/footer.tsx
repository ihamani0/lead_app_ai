'use client';
import { InstagramIcon, LinkedinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';

export function Footer() {
    return (
        <footer className="relative border-t">
            <div
                className={cn(
                    'mx-auto max-w-6xl px-4 lg:border-x lg:px-6',
                    'dark:bg-[radial-gradient(35%_80%_at_15%_0%,--theme(--color-foreground/.1),transparent)]',
                )}
            >
                {/* Grid container with headings and links */}
                <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
                    {footerLinks.map((item) => (
                        <div key={item.title}>
                            <h3 className="mb-4 text-xs">{item.title}</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {item.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            className="hover:text-foreground"
                                            href={link.href}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="h-px bg-border" />
                {/* Social Buttons + App Links */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div className="flex items-center gap-2">
                        {socialLinks.map(({ icon, href }, index) => (
                            <Button
                                asChild
                                key={`social-${href}-${index}`} // More descriptive prefix
                                size="sm"
                                variant="outline"
                            >
                                <a href={href}>{icon}</a>
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>
                <div className="h-px bg-border" />
                <div className="py-4 text-center text-xs text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} crew, All rights
                        reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}

const footerLinks = [
    {
        title: 'Company',
        links: [
            { href: '#', label: 'Engineering Blog' },
            { href: '#', label: 'What’s New' },
            { href: '#', label: 'About' },
        ],
    },
    {
        title: 'Support',
        links: [
            { href: '#', label: 'Help Topics' },
            { href: '#', label: 'Getting Started' },
            { href: '#', label: 'FAQs' },
            { href: '#', label: 'Report a Violation' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { href: '#', label: 'Terms & Conditions' },
            { href: '#', label: 'Privacy Notice' },
            { href: '#', label: 'Cookie Notice' },
            { href: '#', label: 'Trust Center' },
            { href: '#', label: 'Cookie Preferences' },
        ],
    },
];

const socialLinks = [
    {
        icon: <InstagramIcon />,
        href: '#',
    },
    {
        icon: <LinkedinIcon />,
        href: '#',
    },
    {
        icon: <XIcon />,
        href: '#',
    },
];

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
