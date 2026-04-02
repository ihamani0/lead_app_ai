import { router } from '@inertiajs/react';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { forceDestroy } from '@/routes/instances';

interface ForceDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    instanceId: string;
    instanceName: string;
}

export function ForceDeleteDialog({
    open,
    onOpenChange,
    instanceId,
    instanceName,
}: ForceDeleteDialogProps) {
    const { t } = useTranslation();
    const [confirmText, setConfirmText] = useState('');
    const [processing, setProcessing] = useState(false);

    const isConfirmed = confirmText === 'DELETE';

    const handleDelete = () => {
        if (!isConfirmed) return;
        setProcessing(true);
        router.delete(forceDestroy({ id: instanceId }), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmText('');
                setProcessing(false);
                onOpenChange(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleClose = () => {
        setConfirmText('');
        setProcessing(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        {t('profil.forceDelete')}
                    </DialogTitle>
                    <DialogDescription className="text-destructive/80">
                        {t('profil.forceDeleteWarning')}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm">
                        <span className="font-medium">
                            {t('profil.instance')}:
                        </span>{' '}
                        {instanceName}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="force-delete-confirm">
                            {t('profil.forceDeleteConfirm')}
                        </Label>
                        <Input
                            id="force-delete-confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                            className="uppercase"
                            disabled={processing}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={processing}
                    >
                        {t('profil.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing || !isConfirmed}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('profil.deleting')}
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('profil.forceDelete')}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
