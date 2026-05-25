import { router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import { destroy as teamsDestroy } from '@/routes/teams';
import type { Workspace } from '@/types';

interface WorkspaceDeleteDialogProps {
    workspace: Workspace;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WorkspaceDeleteDialog({
    workspace,
    open,
    onOpenChange,
}: WorkspaceDeleteDialogProps) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        setProcessing(true);
        router.delete(teamsDestroy({ slug: workspace.slug }).url, {
            onSuccess: () => {
                onOpenChange(false);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('workspace.delete_title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('workspace.delete_description', {
                            name: workspace.name,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {t('workspace.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
