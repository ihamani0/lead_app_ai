import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatBytes } from '@/lib/utils';

interface WorkspaceUsage {
    leads_used: number;
    storage_used_bytes: number;
}

interface WorkspaceAboutCardProps {
    name: string;
    description: string;
    created_at: string;
    owner_name: string;
    usage: WorkspaceUsage;
}

function UsageRow({
    label,
    used,
    limit,
    unit,
}: {
    label: string;
    used: number;
    limit?: number;
    unit?: string;
}) {
    const hasLimit = limit !== undefined && limit > 0;
    const pct = hasLimit
        ? Math.min(Math.round((used / limit) * 100), 100)
        : null;
    const isWarning = pct !== null && pct >= 80;

    return (
        <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium text-foreground">
                    {used.toLocaleString('fr-FR')}
                    {unit ?? ''}
                    {hasLimit &&
                        ` / ${limit.toLocaleString('fr-FR')}${unit ?? ''}`}
                </span>
            </div>
            {pct !== null && (
                <Progress
                    value={pct}
                    className={`h-1.5 ${isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-violet-500'}`}
                />
            )}
        </div>
    );
}

export function WorkspaceAboutCard({
    name,
    description,
    created_at,
    owner_name,
    usage,
}: WorkspaceAboutCardProps) {
    const rows = [
        { label: 'Nom', value: name },
        { label: 'Description', value: description || '-' },
        { label: 'Créé le', value: created_at },
        { label: 'Propriétaire', value: owner_name },
    ];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Info className="h-4 w-4 text-muted-foreground" />À propos
                    de ce workspace
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 pb-4">
                <div className="space-y-0 divide-y">
                    {rows.map((row) => (
                        <div
                            key={row.label}
                            className="flex justify-between py-1.5"
                        >
                            <span className="text-xs text-muted-foreground">
                                {row.label}
                            </span>
                            <span className="max-w-[60%] truncate text-right text-xs font-medium text-foreground">
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                <Separator />

                <p className="text-xs font-medium text-foreground">
                    Utilisation
                </p>
                <div className="space-y-3">
                    <UsageRow label="Leads" used={usage.leads_used} />
                    <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs text-muted-foreground">
                                Stockage
                            </span>
                            <span className="text-xs font-medium text-foreground">
                                {formatBytes(usage.storage_used_bytes)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
