import { Image as ImageIcon, Video, X, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import type { WizardFormData } from '@/types/wizard';

interface Step4MediaProps {
    formData: WizardFormData;
    setFormData: (data: WizardFormData | ((prev: WizardFormData) => WizardFormData)) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
const MAX_SIZE = 30 * 1024 * 1024;

export function Step4Media({ formData, setFormData }: Step4MediaProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (const file of Array.from(files)) {
            if (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE) {
                setFormData((prev) => ({
                    ...prev,
                    media_files: [...prev.media_files, file],
                }));
            }
        }
        e.target.value = '';
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (!files) return;
        for (const file of Array.from(files)) {
            if (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE) {
                setFormData((prev) => ({
                    ...prev,
                    media_files: [...prev.media_files, file],
                }));
            }
        }
    };

    const removeFile = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            media_files: prev.media_files.filter((_, i) => i !== index),
        }));
    };

    const isImage = (file: File) => file.type.startsWith('image/');
    const previewUrl = (file: File) => (isImage(file) ? URL.createObjectURL(file) : null);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('wizard.step4.title')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('wizard.step4.description')}
                </p>
            </div>

            <div
                className={`rounded-lg border-2 border-dashed p-8 transition-colors ${
                    dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-muted p-4">
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">{t('wizard.step4.drop_files')}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step4.supported_formats')}
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        {t('wizard.step4.browse_files')}
                    </Button>
                </div>
            </div>

            {formData.media_files.length > 0 && (
                <div className="space-y-2">
                    <Label>{t('wizard.step4.uploaded_files')}</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {formData.media_files.map((file, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg border bg-muted/30"
                            >
                                {isImage(file) ? (
                                    <div className="aspect-square">
                                        <img
                                            src={previewUrl(file) ?? ''}
                                            alt={file.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-square items-center justify-center">
                                        <Video className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <p className="truncate text-xs text-white">{file.name}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                    <ImageIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="font-medium">{t('wizard.step4.info_title')}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step4.info_description')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}