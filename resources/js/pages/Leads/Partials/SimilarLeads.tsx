import { Link } from '@inertiajs/react';
import type { FC } from 'react';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { cn } from '@/lib/utils';
import { show as showRoute } from '@/routes/workspaces/leads';
import type { SimilarLead } from '@/types';
import { AvatarInitials } from './AvatarInitials';

interface SimilarLeadsProps {
    leads: SimilarLead[];
}

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Nouveau' },
    contacted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'En cours' },
    qualified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Qualifié' },
    hot: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Chaud' },
    rdv: { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Rendez-vous' },
    lost: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Perdu' },
};

const resultConfig: Record<string, { bg: string; text: string; label: string }> = {
    HOT: { bg: 'bg-orange-100', text: 'text-orange-800', label: '🔥 Chaud' },
    WARM: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Tiède' },
    COLD: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Froid' },
};

export const SimilarLeads: FC<SimilarLeadsProps> = ({ leads }) => {
    const activeWorkspace = useActiveWorkspace();

    if (leads.length === 0) {
        return (
            <p className="text-xs text-muted-foreground">
                Aucun prospect similaire trouvé.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {leads.map((l) => {
                const rc = resultConfig[l.qualification_result ?? ''] ?? statusBadge[l.status] ?? null;
                return (
                    <Link
                        key={l.id}
                        href={showRoute({ slug: activeWorkspace!.slug, lead: l.id }).url}
                        className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-muted"
                    >
                        <AvatarInitials name={l.name} id={l.id} size="sm" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                                {l.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                                +{l.phone}
                            </p>
                        </div>
                        {rc && (
                            <span
                                className={cn(
                                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                    rc.bg,
                                    rc.text,
                                )}
                            >
                                {rc.label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export const SimilarLeadsSkeleton: FC = () => (
    <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
            <div
                key={i}
                className="flex animate-pulse items-center gap-2.5 rounded-lg p-2"
            >
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-2.5 w-16 rounded bg-muted" />
                </div>
                <div className="h-4 w-12 rounded-full bg-muted" />
            </div>
        ))}
    </div>
);
