import { FileText, FileSpreadsheet, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

interface DocumentStats {
    total: number;
    words_analyzed: number;
    size_gb: number;
    sources: number;
}

interface KpiCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend?: React.ReactNode;
}

function KpiCard({ icon, label, value, trend }: KpiCardProps) {
    return (
        <Card className="border bg-card shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-2xl font-bold text-foreground">
                            {value}
                        </p>
                        {trend && (
                            <div className="text-xs font-medium text-emerald-600">
                                {trend}
                            </div>
                        )}
                    </div>
                    <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function DocumentsKpiCards({ stats }: { stats: DocumentStats }) {
    const { t } = useTranslation();

    const formatNumber = (n: number) => n.toLocaleString('fr-FR');

    const cards = [
        {
            icon: <FileText className="h-5 w-5" />,
            label: t('bibliotheque.documents.kpi.documents'),
            value: formatNumber(stats.total),
            trend: t('bibliotheque.documents.kpi.documentsTrend'),
        },
        {
            icon: <FileSpreadsheet className="h-5 w-5" />,
            label: t('bibliotheque.documents.kpi.words'),
            value: formatNumber(stats.words_analyzed),
        },
        {
            icon: <HardDrive className="h-5 w-5" />,
            label: t('bibliotheque.documents.kpi.size'),
            value: stats.size_gb > 0 ? `${stats.size_gb.toFixed(1)} Go` : '—',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map((card) => (
                <KpiCard key={card.label} {...card} />
            ))}
        </div>
    );
}
