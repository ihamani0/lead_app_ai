import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export function FoldersCard({
    folders = [],
    canManage,
}: {
    folders?: string[];
    canManage: boolean;
}) {
    const { t } = useTranslation();

    const displayFolders =
        folders.length > 0
            ? folders
            : [
                  t('bibliotheque.documents.folders.brochures'),
                  t('bibliotheque.documents.folders.pricing'),
                  t('bibliotheque.documents.folders.technical'),
                  t('bibliotheque.documents.folders.faq'),
                  t('bibliotheque.documents.folders.legal'),
                  t('bibliotheque.documents.folders.presentation'),
                  t('bibliotheque.documents.folders.guides'),
              ];

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold">
                    {t('bibliotheque.documents.folders.title')}
                </CardTitle>
                {canManage && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                    >
                        <Plus className="h-3 w-3" />
                        {t('bibliotheque.documents.folders.newFolder')}
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-1">
                {displayFolders.map((folder) => (
                    <div
                        key={folder}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        {folder}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
