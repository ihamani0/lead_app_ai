import { BrainCircuit, RefreshCw } from 'lucide-react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatLastActivity } from '@/lib/leadHelper';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types';

interface IAInsightsProps {
    lead: Lead;
}

export const IAInsights: FC<IAInsightsProps> = ({ lead }) => {
    const score = lead.qualification_score ?? 0;
    const scorePercent = (score / 10) * 100;
    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset =
        circumference - (scorePercent / 100) * circumference;

    const isHot =
        lead.qualification_result === 'HOT' ||
        (lead.qualification_result === null && score >= 7);
    const isWarm =
        lead.qualification_result === 'WARM' ||
        (lead.qualification_result === null && score >= 4);

    const gaugeColor = isHot ? '#ef4444' : isWarm ? '#f59e0b' : '#3b82f6';
    const gaugeLabel = isHot
        ? 'Très chaud 🔥'
        : isWarm
          ? 'Tiède'
          : 'Froid';

    const customData =
        typeof lead.custom_data === 'string'
            ? (() => {
                  try {
                      return JSON.parse(lead.custom_data);
                  } catch {
                      return {};
                  }
              })()
            : lead.custom_data || {};

    const infoItems: Array<{ label: string; value: string }> = [
        { label: 'Budget', value: customData.budget || '-' },
        {
            label: 'Préférence',
            value: customData.preference || customData.preference_type || '-',
        },
        {
            label: 'Chambres',
            value: customData.rooms || customData.chambres || '-',
        },
        { label: 'Vue', value: customData.view || customData.vue || '-' },
        {
            label: "Zone d'intérêt",
            value:
                customData.area ||
                customData.zone ||
                customData.quartier ||
                '-',
        },
        {
            label: "Niveau d'intérêt",
            value: isHot ? 'Très élevé 🔥' : isWarm ? 'Moyen' : 'Faible',
        },
    ].filter((item) => item.value !== '-');

    const hasIntention = customData.intention || customData.type || null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-foreground">
                        Analyse IA
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                        Mis à jour à{' '}
                        {formatLastActivity(lead.updated_at) || '-'}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {hasIntention && (
                <div>
                    <Badge className="border-0 bg-purple-100 text-[11px] font-medium text-purple-800">
                        {hasIntention as string}
                    </Badge>
                </div>
            )}

            <div className="flex flex-col items-center py-2">
                <div className="relative flex items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke={gaugeColor}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 40 40)"
                            className="transition-all duration-700"
                        />
                    </svg>
                    <span className="absolute text-lg font-bold text-foreground">
                        {score}
                        <span className="text-xs font-normal text-muted-foreground">
                            /10
                        </span>
                    </span>
                </div>
                <span
                    className={cn(
                        'mt-1 text-xs font-medium',
                        isHot && 'text-orange-600',
                        isWarm && 'text-amber-600',
                        !isHot && !isWarm && 'text-blue-600',
                    )}
                >
                    {gaugeLabel}
                </span>
            </div>

            {lead.ai_summary && (
                <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        {lead.ai_summary}
                    </p>
                </div>
            )}

            {infoItems.length > 0 && (
                <div className="space-y-1">
                    <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Informations clés
                    </h4>
                    <div className="space-y-1.5">
                        {infoItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="text-muted-foreground">
                                    {item.label}
                                </span>
                                <span className="ml-2 truncate text-right font-medium text-foreground">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* <div className="space-y-2">
                <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Actions suggérées
                </h4>
                <div className="space-y-1.5">
                    {[
                        "Envoyer d'autres biens similaires",
                        'Proposer une visite',
                        'Partager la brochure de la résidence',
                    ].map((action) => (
                        <label
                            key={action}
                            className="flex cursor-pointer items-center gap-2 text-xs text-foreground"
                        >
                            <input
                                type="checkbox"
                                className="h-3.5 w-3.5 rounded border-gray-300 text-purple-600"
                            />
                            {action}
                        </label>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full text-xs"
                >
                    Voir toutes les actions →
                </Button>
            </div> */}
        </div>
    );
};
