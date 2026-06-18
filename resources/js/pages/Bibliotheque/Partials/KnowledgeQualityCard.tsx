import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

function CircularProgress({
    value,
    size = 120,
    strokeWidth = 8,
}: {
    value: number;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const colorClass =
        value >= 80
            ? 'text-emerald-500'
            : value >= 50
              ? 'text-amber-500'
              : 'text-red-500';

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={colorClass}
                />
            </svg>
            <span className="absolute text-2xl font-bold text-foreground">
                {value}%
            </span>
        </div>
    );
}

function getLabel(score: number): {
    label: string;
    color: string;
    description: string;
} {
    if (score >= 90) {
        return {
            label: 'Excellente',
            color: 'text-emerald-600 dark:text-emerald-400',
            description:
                'Votre base de connaissances est bien structurée et à jour.',
        };
    }
    if (score >= 70) {
        return {
            label: 'Bonne',
            color: 'text-blue-600 dark:text-blue-400',
            description:
                "Votre base de connaissances est correcte. Ajoutez plus de documents pour l'améliorer.",
        };
    }
    if (score >= 50) {
        return {
            label: 'Moyenne',
            color: 'text-amber-600 dark:text-amber-400',
            description: 'Certains documents sont en attente de traitement.',
        };
    }
    return {
        label: 'À améliorer',
        color: 'text-red-600 dark:text-red-400',
        description:
            'Ajoutez des documents pour enrichir votre base de connaissances.',
    };
}

export function KnowledgeQualityCard({ score = 0 }: { score?: number }) {
    const { t } = useTranslation();
    const { label, color, description } = getLabel(score);

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader>
                <CardTitle className="text-sm font-semibold">
                    {t('bibliotheque.documents.quality.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    <CircularProgress value={score} />
                </div>
                <div className="text-center">
                    <p className={`text-sm font-bold ${color}`}>{label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
                <a
                    href="#"
                    className="block text-center text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400"
                >
                    {t('bibliotheque.documents.quality.recommendations')}
                </a>
            </CardContent>
        </Card>
    );
}
