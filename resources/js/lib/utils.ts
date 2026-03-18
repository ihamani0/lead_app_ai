import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Calculate percentage with safe division
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Get color class for status
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        NEW: 'bg-blue-500',
        CONTACTED: 'bg-yellow-500',
        QUALIFIED: 'bg-orange-500',
        CONVERTED: 'bg-green-500',
        LOST: 'bg-red-500',
        CONNECTED: 'bg-green-500',
        DISCONNECTED: 'bg-red-500',
        ACTIVE: 'bg-green-500',
        INACTIVE: 'bg-gray-500',
    };
    return colors[status] || 'bg-slate-500';
}

/**
 * Get badge variant for temperature
 */
export function getTemperatureVariant(
    temp: string,
): 'outline' | 'default' | 'secondary' {
    switch (temp) {
        case 'HOT':
            return 'default';
        case 'WARM':
            return 'secondary';
        default:
            return 'outline';
    }
}

/**
 * Get CSS class for temperature badge
 */
export function getTemperatureClass(temp: string): string {
    switch (temp) {
        case 'HOT':
            return 'border-red-500 text-red-500';
        case 'WARM':
            return 'border-orange-500 text-orange-500';
        default:
            return 'border-blue-500 text-blue-500';
    }
}

/**
 * Get chart color from CSS variable (supports light/dark mode)
 */
export function getChartColor(index: number): string {
    const key = `--chart-${index}`;
    if (typeof window === 'undefined') {
        return '#6b7280';
    }
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(key).trim() || '#6b7280';
}
