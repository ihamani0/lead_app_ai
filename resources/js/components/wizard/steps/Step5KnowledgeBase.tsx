import { CheckCircle2, Database, FileText, Loader2, UploadCloud, X, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import type { WizardFormData } from '@/types/wizard';

type FileStatus = 'pending' | 'uploading' | 'done' | 'failed';

interface Step5KnowledgeBaseProps {
    formData: WizardFormData;
    setFormData: (data: WizardFormData | ((prev: WizardFormData) => WizardFormData)) => void;
    onNext: () => void;
    onSkip: () => void;
    isSubmitting: boolean;
}

function statusIcon(status: FileStatus) {
    switch (status) {
        case 'uploading':
            return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
        case 'done':
            return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
        case 'failed':
            return <XCircle className="h-4 w-4 text-destructive" />;
        default:
            return null;
    }
}

export function Step5KnowledgeBase({
    formData,
    setFormData,
    isSubmitting,
}: Step5KnowledgeBaseProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [fileStatuses, setFileStatuses] = useState<Record<number, FileStatus>>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            const newIndex = formData.knowledge_files.length;
            setFormData((prev: WizardFormData) => ({
                ...prev,
                knowledge_files: [...prev.knowledge_files, selected],
            }));
            setFileStatuses((prev) => ({ ...prev, [newIndex]: 'pending' }));
        }
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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const newIndex = formData.knowledge_files.length;
            setFormData((prev: WizardFormData) => ({
                ...prev,
                knowledge_files: [...prev.knowledge_files, file],
            }));
            setFileStatuses((prev) => ({ ...prev, [newIndex]: 'pending' }));
        }
    };

    const removeFile = (index: number) => {
        setFormData((prev: WizardFormData) => ({
            ...prev,
            knowledge_files: prev.knowledge_files.filter((_, i) => i !== index),
        }));
        setFileStatuses((prev) => {
            const updated = { ...prev };
            delete updated[index];
            // Re-index remaining statuses
            const reindexed: Record<number, FileStatus> = {};
            Object.keys(updated).forEach((key, i) => {
                reindexed[i] = updated[Number(key)];
            });
            return reindexed;
        });
    };

    // Update file statuses when submitting
    const prevSubmitting = useRef(isSubmitting);
    if (isSubmitting && !prevSubmitting.current) {
        setFileStatuses((prev) => {
            const updated: Record<number, FileStatus> = {};
            Object.keys(prev).forEach((key) => {
                updated[Number(key)] = 'uploading';
            });
            return updated;
        });
    }
    prevSubmitting.current = isSubmitting;

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
                        <p className="font-medium">
                            {t('wizard.step4.drop_files')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step4.supported_formats')}
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {t('wizard.step4.browse_files')}
                    </Button>
                </div>
            </div>

            {formData.knowledge_files.length > 0 && (
                <div className="space-y-2">
                    <Label>{t('wizard.step4.uploaded_files')}</Label>
                    <div className="space-y-2">
                        {formData.knowledge_files.map((file, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex items-center justify-between rounded-lg border bg-muted/30 p-3',
                                    fileStatuses[index] === 'uploading' && 'border-primary/50 bg-primary/5',
                                    fileStatuses[index] === 'failed' && 'border-destructive/50 bg-destructive/5',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {statusIcon(fileStatuses[index] ?? 'pending') || (
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    disabled={isSubmitting}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                    <Database className="mt-0.5 h-5 w-5 text-muted-foreground" />
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
