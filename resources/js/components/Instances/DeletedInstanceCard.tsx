import { router } from '@inertiajs/react';
import { Archive, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { restore } from '@/routes/instances';
import { ForceDeleteDialog } from './ForceDeleteDialog';

interface DeletedInstance {
    id: string;
    instance_name: string;
    display_name: string | null;
    phone_number: string | null;
    deleted_at: string | null;
    settings: Record<string, unknown> | null;
}

interface DeletedInstanceCardProps {
    instance: DeletedInstance;
}

export function DeletedInstanceCard({ instance }: DeletedInstanceCardProps) {
    const { t } = useTranslation();
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleRestore = () => {
        router.post(
            restore({ id: instance.instance_name }),
            {},
            { preserveScroll: true },
        );
    };

    const settings = instance.settings as Record<string, unknown> | undefined;
    const needsRecreation = settings?.needs_recreation as boolean | undefined;
    const originalName = settings?.original_instance_name as string | undefined;

    return (
        <>
            <Card className="group relative overflow-hidden border-red-200/50 bg-red-50/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-red-900/30 dark:bg-red-950/50">
                <div className="absolute top-3 right-3">
                    <Badge
                        variant="outline"
                        className="border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/50 dark:text-red-400"
                    >
                        <Trash2 className="mr-1 h-3 w-3" />
                        {t('profil.deleted')}
                    </Badge>
                </div>

                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                            <Archive className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-bold text-foreground">
                                {instance.display_name ||
                                    instance.instance_name
                                        .split('-')
                                        .slice(1, -1)
                                        .join(' ') ||
                                    instance.instance_name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {instance.phone_number
                                    ? `+${instance.phone_number}`
                                    : '---'}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {needsRecreation && (
                        <div className="rounded-lg bg-red-100/50 p-3 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <span className="font-semibold">
                                {t('profil.needsRecreation')}
                            </span>
                            {originalName && (
                                <span className="mt-1 block">
                                    {t('profil.originalName')}: {originalName}
                                </span>
                            )}
                        </div>
                    )}

                    {instance.deleted_at && (
                        <p className="text-xs text-muted-foreground">
                            {t('profil.deletedAt')}:{' '}
                            {new Date(instance.deleted_at).toLocaleDateString()}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={handleRestore}
                            className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            size="sm"
                        >
                            <RotateCcw className="h-4 w-4" />
                            {t('profil.restore')}
                        </Button>
                        <Button
                            onClick={() => setDeleteOpen(true)}
                            variant="outline"
                            className="gap-2 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                            size="sm"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ForceDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                instanceId={instance.id}
                instanceName={instance.display_name || instance.instance_name}
            />
        </>
    );
}
