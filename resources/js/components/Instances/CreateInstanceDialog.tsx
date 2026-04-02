// resources/js/Components/Instances/CreateInstanceDialog.tsx
import { useForm } from '@inertiajs/react';
import type { TFunction } from 'i18next';
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { store } from '@/routes/profile';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function CreateInstanceDialog({ t }: { t: TFunction }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        name: '',
        display_name: '',
        phone_number: '',
    });

    const onSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        form.post(store().url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    // Reset modal state when closed
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={'outline'} className="shadow-lg">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('profil.connectNewNumber')}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[425px]"
                style={{ maxWidth: '600px' }}
            >
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('profil.createTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('profil.createDesc')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {t('profil.name')}
                            </Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                className="col-span-3"
                                placeholder={t('profil.namePlaceholder')}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="display_name"
                                className="text-right"
                            >
                                {t('profil.displayName')}
                            </Label>
                            <Input
                                id="display_name"
                                value={form.data.display_name}
                                onChange={(e) =>
                                    form.setData('display_name', e.target.value)
                                }
                                className="col-span-3"
                                placeholder={t('profil.displayNamePlaceholder')}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                {t('profil.number')}
                            </Label>
                            <Input
                                id="phone"
                                value={form.data.phone_number}
                                onChange={(e) =>
                                    form.setData('phone_number', e.target.value)
                                }
                                className="col-span-3"
                                placeholder="e.g. 212612345678"
                            />
                        </div>
                        {form.errors.name && (
                            <div className="text-right text-sm text-red-500">
                                {form.errors.name}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t('profil.createInstance')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
