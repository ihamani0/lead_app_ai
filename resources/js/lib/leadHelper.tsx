import { Flame, Snowflake, ThermometerSun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { QualificationResult, TreatmentStatus } from '@/types';

export const getTempBadge = (temp: string | null) => {
    switch (temp?.toUpperCase()) {
        case 'HOT':
            return (
                <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-100">
                    <Flame className="mr-1 h-3 w-3" /> Hot
                </Badge>
            );
        case 'WARM':
            return (
                <Badge className="border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-100">
                    <ThermometerSun className="mr-1 h-3 w-3" /> Warm
                </Badge>
            );
        case 'COLD':
            return (
                <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Snowflake className="mr-1 h-3 w-3" /> Cold
                </Badge>
            );
        default:
            return <Badge variant="outline">New</Badge>;
    }
};

export const heatLabels: Record<string, string> = {
    HOT: 'Chaud',
    WARM: 'Tiède',
    COLD: 'Froid',
};

export const heatColors: Record<string, { bg: string; text: string }> = {
    HOT: { bg: 'bg-orange-100', text: 'text-orange-800' },
    WARM: { bg: 'bg-amber-100', text: 'text-amber-800' },
    COLD: { bg: 'bg-blue-100', text: 'text-blue-800' },
};

export const statusLabels: Record<string, string> = {
    new: 'Nouveau',
    contacted: 'En cours',
    qualified: 'Qualifié',
    unqualified: 'Non qualifié',
    converted: 'Converti',
};

export const statusStyles: Record<string, { bg: string; text: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-800' },
    qualified: { bg: 'bg-green-100', text: 'text-green-800' },
    unqualified: { bg: 'bg-gray-100', text: 'text-gray-700' },
    converted: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

export const AVATAR_COLORS = [
    { bg: '#EEEDFE', text: '#6C63FF' },
    { bg: '#E1F5EE', text: '#0F6E56' },
    { bg: '#FAECE7', text: '#993C1D' },
    { bg: '#E6F1FB', text: '#185FA5' },
    { bg: '#FAEEDA', text: '#854F0B' },
];

export function getAvatarColor(id: string | number) {
    const num = typeof id === 'string' ? id.charCodeAt(0) : Number(id);
    return AVATAR_COLORS[num % AVATAR_COLORS.length];
}

export function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}

export function getHeatBadge(result: QualificationResult | null) {
    if (!result) return null;
    const label = heatLabels[result] ?? result;
    const colors = heatColors[result] ?? {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
    };
    return (
        <Badge
            className={`${colors.bg} ${colors.text} border-0 text-[11px] font-medium`}
        >
            {result === 'HOT' && '🔥 '}
            {label}
        </Badge>
    );
}

export function getTreatmentBadge(status: TreatmentStatus | null) {
    if (!status) return null;
    const isTraite = status === 'TRAITE';
    return (
        <Badge
            className={`border-0 text-[11px] font-medium ${
                isTraite
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
            }`}
        >
            {isTraite ? 'Traité' : 'Non traité'}
        </Badge>
    );
}

export function getStatusBadge(status: string | null) {
    if (!status) return null;
    const label = statusLabels[status] ?? status;
    const colors = statusStyles[status] ?? {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
    };
    return (
        <Badge
            className={`${colors.bg} ${colors.text} border-0 text-[11px] font-medium`}
        >
            {label}
        </Badge>
    );
}

export function formatLastActivity(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;

    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
    });
}

export function formatTime(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function getDateSeparator(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';

    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function groupMessagesByDate(
    messages: Array<{ direction: string; message: string; timestamp: string }>,
): Array<{ date: string; messages: typeof messages }> {
    const groups: Array<{ date: string; messages: typeof messages }> = [];
    for (const msg of messages) {
        const dateKey = new Date(msg.timestamp).toDateString();
        const last = groups[groups.length - 1];
        if (
            last &&
            new Date(last.messages[0].timestamp).toDateString() === dateKey
        ) {
            last.messages.push(msg);
        } else {
            groups.push({ date: dateKey, messages: [msg] });
        }
    }
    return groups;
}

export function groupLeadMessagesByDate<T extends { created_at: string }>(
    messages: T[],
): Array<{ date: string; messages: T[] }> {
    const groups: Array<{ date: string; messages: T[] }> = [];
    for (const msg of messages) {
        const dateKey = new Date(msg.created_at).toDateString();
        const last = groups[groups.length - 1];
        if (
            last &&
            new Date(last.messages[0].created_at).toDateString() === dateKey
        ) {
            last.messages.push(msg);
        } else {
            groups.push({ date: dateKey, messages: [msg] });
        }
    }
    return groups;
}
