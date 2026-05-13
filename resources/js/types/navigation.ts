import type { InertiaLinkProps } from '@inertiajs/react';
import type { ComponentType, SVGProps } from 'react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: ComponentType<SVGProps<SVGSVGElement>> | null;
    isActive?: boolean;
    'data-tour'?: string;
};
