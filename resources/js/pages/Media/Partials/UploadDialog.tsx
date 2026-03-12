// components/media/UploadDialog.tsx
import { useForm } from '@inertiajs/react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import { store } from '@/routes/media';
import type { MediaFormData } from '@/types';

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
    const { t } = useTranslation();
    const { data, post, reset, setData, processing, errors } =
        useForm<MediaFormData>({
            category: '',
            type: 'image',
            upload_method: 'file',
            file: null,
            external_url: '',
            caption: '',
        });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(store().url, {
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30">
                    <Plus className="h-4 w-4" />
                    {t('media.upload.addAsset')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        {t('media.upload.addNewMediaAsset')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('media.upload.category')}</Label>
                            <Input
                                placeholder={t(
                                    'media.upload.categoryPlaceholder',
                                )}
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                required
                                className="focus-visible:ring-primary"
                            />
                            {errors.category && (
                                <span className="text-xs text-destructive">
                                    {errors.category}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{t('media.upload.mediaType')}</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                            >
                                <option value="image">
                                    {t('media.upload.image')}
                                </option>
                                <option value="video">
                                    {t('media.upload.video')}
                                </option>
                                <option value="document">
                                    {t('media.upload.document')}
                                </option>
                            </select>
                        </div>
                    </div>

                    <Tabs
                        value={data.upload_method}
                        onValueChange={(v) => setData('upload_method', v)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="file">
                                {t('media.upload.uploadFile')}
                            </TabsTrigger>
                            <TabsTrigger value="url">
                                {t('media.upload.externalUrl')}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="mt-4 space-y-3">
                            <Label>{t('media.upload.selectFile')}</Label>
                            <Input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'file',
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            {errors.file && (
                                <span className="text-xs text-destructive">
                                    {errors.file}
                                </span>
                            )}
                        </TabsContent>

                        <TabsContent value="url" className="mt-4 space-y-3">
                            <Label>{t('media.upload.directUrl')}</Label>
                            <Input
                                type="url"
                                placeholder={t('media.upload.urlPlaceholder')}
                                value={data.external_url}
                                onChange={(e) =>
                                    setData('external_url', e.target.value)
                                }
                            />
                            {errors.external_url && (
                                <span className="text-xs text-destructive">
                                    {errors.external_url}
                                </span>
                            )}
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-2">
                        <Label>{t('media.upload.caption')}</Label>
                        <Input
                            placeholder={t('media.upload.captionPlaceholder')}
                            value={data.caption}
                            onChange={(e) => setData('caption', e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full gap-2"
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        {processing
                            ? t('media.upload.uploading')
                            : t('media.upload.saveAsset')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
