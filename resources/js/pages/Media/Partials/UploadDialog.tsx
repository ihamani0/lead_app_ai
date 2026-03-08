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
import { store } from '@/routes/media';
import type { MediaFormData } from '@/types';

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
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
                    Add Asset
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        Add New Media Asset
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category (AI Keyword)</Label>
                            <Input
                                placeholder="e.g., pool, facade"
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
                            <Label>Media Type</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                            </select>
                        </div>
                    </div>

                    <Tabs
                        value={data.upload_method}
                        onValueChange={(v) => setData('upload_method', v)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="file">Upload File</TabsTrigger>
                            <TabsTrigger value="url">External URL</TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="mt-4 space-y-3">
                            <Label>Select File</Label>
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
                            <Label>Direct URL</Label>
                            <Input
                                type="url"
                                placeholder="https://..."
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
                        <Label>Caption (Optional)</Label>
                        <Input
                            placeholder="Description sent with the media..."
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
                        {processing ? 'Uploading...' : 'Save Asset'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
