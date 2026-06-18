import { Badge } from '@/components/ui/badge';

interface WorkspaceHeaderProps {
    name: string;
    status: string;
    description?: string;
}

export function WorkspaceHeader({
    name,
    status,
    description,
}: WorkspaceHeaderProps) {
    const isActive = status === 'Actif';

    return (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
                <div className="mb-1 flex items-center gap-2.5">
                    <h1 className="text-2xl font-semibold text-foreground">
                        {name}
                    </h1>
                    <Badge
                        variant="outline"
                        className={
                            isActive
                                ? 'border-emerald-200 bg-emerald-50 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                                : 'border-gray-200 bg-gray-50 text-xs text-gray-500'
                        }
                    >
                        {status}
                    </Badge>
                </div>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
