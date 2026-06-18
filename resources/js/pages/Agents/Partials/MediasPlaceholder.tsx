import { router } from '@inertiajs/react';
import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import { useUppyState, UppyContextProvider } from '@uppy/react';
import axios from 'axios';
import {
    Upload,
    X,
    Image as ImageIcon,
    Video,
    FileText,
    Plus,
    FolderOpen,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { cn } from '@/lib/utils';

import { AssetDetailDialog } from '@/pages/Media/Partials/AssetDetailDialog';
import { MediaTabs } from '@/pages/Media/Partials/MediaTabs';
import { StatsCards } from '@/pages/Media/Partials/StatsCards';
import media from '@/routes/workspaces/media';
import type { AgentConfig, Asset, PresignResponse } from '@/types';

import '@uppy/core/css/style.min.css';

// ─── Constants ───────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
];
const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
];
const MAX_FILE_SIZE = 30 * 1024 * 1024;

function getUppyRestrictions(type: string) {
    const allowedTypes =
        type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;

    return {
        maxFileSize: MAX_FILE_SIZE,
        allowedFileTypes: allowedTypes,
        maxNumberOfFiles: 1,
    };
}

function getAcceptMimeTypes(type: string): string {
    if (type === 'image') return ALLOWED_IMAGE_TYPES.join(',');
    if (type === 'video') return ALLOWED_VIDEO_TYPES.join(',');

    return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',');
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function FileIcon({ type }: { type: string | undefined }) {
    if (type?.startsWith('image/'))
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (type?.startsWith('video/'))
        return <Video className="h-5 w-5 text-purple-500" />;

    return <FileText className="h-5 w-5 text-muted-foreground" />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UppyFileType = any;

// ─── Uppy Upload Inner ───────────────────────────────────────────────────────

interface UppyUploadInnerProps {
    agentId: string;
    mediaType: string;
    category: string;
    caption: string;
    onUploadProgress: (progress: number) => void;
    onUploadComplete: (asset: Asset) => void;
    onUploadError: (error: Error) => void;
    onCancel: () => void;
    isOpen: boolean;
    isUploading: boolean;
    progress: number;
}

function UppyUploadInner({
    agentId,
    mediaType,
    category,
    caption,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    onCancel,
    isOpen,
    isUploading,
    progress,
}: UppyUploadInnerProps) {
    const activeWorkspace = useActiveWorkspace();
    const slugRef = useRef(activeWorkspace?.slug);

    useEffect(() => {
        slugRef.current = activeWorkspace?.slug;
    }, [activeWorkspace?.slug]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaTypeRef = useRef(mediaType);

    useEffect(() => {
        mediaTypeRef.current = mediaType;
    }, [mediaType]);

    const [selectedFile, setSelectedFile] = useState<UppyFileType>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const uppyRef = useRef<Uppy | null>(null);

    if (!uppyRef.current) {
        const instance = new Uppy({
            id: 'agent-media-upload',
            restrictions: getUppyRestrictions(mediaType),
            autoProceed: false,
            debug: false,
        });

        instance.use(AwsS3, {
            shouldUseMultipart: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getUploadParameters: (file: any) => {
                const payload = {
                    filename: file.name,
                    mime_type: file.type,
                    size: Math.ceil((file.size ?? 0) / 1024),
                };

                return new Promise((resolve, reject) => {
                    axios
                        .post(
                            media.presign({ slug: slugRef.current ?? '' }).url,
                            payload,
                        )
                        .then((response) => {
                            const presign = response.data as PresignResponse;
                            instance.setFileMeta(file.id, {
                                s3_key: presign.key,
                            });

                            const safeHeaders = { ...presign.headers };
                            delete safeHeaders['Host'];
                            delete safeHeaders['host'];

                            resolve({
                                method: 'PUT' as const,
                                url: presign.url,
                                headers: safeHeaders,
                            });
                        })
                        .catch((error) => {
                            const msg =
                                error.response?.data?.message ||
                                'Presign failed';
                            console.error('[Presign] Error:', msg);
                            reject(new Error(msg));
                        });
                });
            },
        });

        uppyRef.current = instance;
    }

    const uppy = uppyRef.current;

    useEffect(() => {
        uppy.setOptions({ restrictions: getUppyRestrictions(mediaType) });
    }, [uppy, mediaType]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files = useUppyState(uppy, (state: any) => state.files);

    useEffect(() => {
        const fileList = Object.values(files) as UppyFileType[];

        if (fileList.length === 0) {
            setSelectedFile(null);
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);

                return null;
            });

            return;
        }

        const latest = fileList[0];
        setSelectedFile((prev: UppyFileType) => {
            if (prev?.id === latest.id) return prev;

            return latest;
        });

        if (latest.type?.startsWith('image/') && latest.data instanceof File) {
            const url = URL.createObjectURL(latest.data);
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);

                return url;
            });
        } else {
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);

                return null;
            });
        }
    }, [files]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleProgress = (p: any) => onUploadProgress(p);

        uppy.on('progress', handleProgress);

        return () => {
            uppy.off('progress', handleProgress);
        };
    }, [uppy, onUploadProgress]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSuccess = (file: any) => {
            const s3Key = file.meta?.s3_key;

            if (!s3Key) {
                console.error('Missing S3 key. Presign step may have failed.');

                return;
            }

            const payload = {
                category: category.toLowerCase().trim(),
                type: mediaType,
                s3_key: s3Key,
                mime_type: file.type || 'application/octet-stream',
                caption: caption,
                agent_config_id: agentId,
            };

            axios
                .post(
                    media.finalize({ slug: slugRef.current ?? '' }).url,
                    payload,
                )
                .then((response) => {
                    const { asset } = response.data as { asset: Asset };
                    onUploadComplete(asset);
                })
                .catch((error) => {
                    const msg =
                        error.response?.data?.message || 'Finalize failed';
                    console.error('[Finalize] Error:', msg);
                    onUploadError(new Error(msg));
                });
        };

        uppy.on('upload-success', handleSuccess);

        return () => {
            uppy.off('upload-success', handleSuccess);
        };
    }, [
        uppy,
        category,
        mediaType,
        caption,
        agentId,
        onUploadComplete,
        onUploadError,
    ]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleError = (_file: any, error: Error) => {
            console.error('[S3] Upload error:', error);
            onUploadError(error);
        };

        uppy.on('upload-error', handleError);

        return () => {
            uppy.off('upload-error', handleError);
        };
    }, [uppy, onUploadError]);

    useEffect(() => {
        if (!isOpen) {
            uppy.cancelAll();
            uppy.clear();
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [isOpen, uppy]);

    useEffect(() => {
        return () => {
            uppyRef.current?.destroy();
            uppyRef.current = null;
        };
    }, []);

    const addFileToUppy = useCallback(
        (file: File) => {
            const currentType = mediaTypeRef.current;
            const allowed =
                currentType === 'image'
                    ? ALLOWED_IMAGE_TYPES
                    : ALLOWED_VIDEO_TYPES;

            if (!allowed.includes(file.type)) {
                onUploadError(
                    new Error(
                        `Please select a valid ${currentType} file. Allowed: ${allowed.join(', ')}`,
                    ),
                );

                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                onUploadError(new Error('File exceeds 30 MB limit.'));

                return;
            }

            const existing = Object.keys(uppy.getState().files);
            existing.forEach((id) => uppy.removeFile(id));

            uppy.addFile({
                name: file.name,
                type: file.type,
                data: file,
                source: 'Local',
                isRemote: false,
            });
        },
        [uppy, onUploadError],
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) addFileToUppy(file);
            e.target.value = '';
        },
        [addFileToUppy],
    );

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);
            const file = e.dataTransfer.files?.[0];
            if (file) addFileToUppy(file);
        },
        [addFileToUppy],
    );

    const handleRemoveFile = useCallback(() => {
        if (selectedFile) {
            uppy.removeFile(selectedFile.id);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [uppy, selectedFile]);

    const handleCancelClick = useCallback(() => {
        uppy.cancelAll();
        uppy.clear();
        onCancel();
    }, [uppy, onCancel]);

    const handleUploadClick = useCallback(async () => {
        if (isUploading || !selectedFile || !category.trim()) return;
        try {
            await uppy.upload();
        } catch (error) {
            onUploadError(
                error instanceof Error
                    ? error
                    : new Error('Failed to start upload.'),
            );
        }
    }, [uppy, isUploading, selectedFile, category, onUploadError]);

    const isImage = selectedFile?.type?.startsWith('image/') ?? false;
    const isVideo = selectedFile?.type?.startsWith('video/') ?? false;

    return (
        <UppyContextProvider uppy={uppy}>
            <div className="space-y-4">
                {/* Drop zone */}
                <div>
                    <Label className="text-sm font-medium">
                        {mediaType === 'image' ? 'Image' : 'Video'} File
                    </Label>
                    <div
                        onDragEnter={!isUploading ? handleDragEnter : undefined}
                        onDragLeave={!isUploading ? handleDragLeave : undefined}
                        onDragOver={!isUploading ? handleDragOver : undefined}
                        onDrop={!isUploading ? handleDrop : undefined}
                        onClick={() =>
                            !isUploading &&
                            !selectedFile &&
                            fileInputRef.current?.click()
                        }
                        className={cn(
                            'mt-2 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all',
                            isUploading && 'cursor-not-allowed opacity-50',
                            isDragActive
                                ? 'scale-[1.02] border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50',
                        )}
                    >
                        {isDragActive ? (
                            <>
                                <Upload className="mx-auto mb-3 h-10 w-10 animate-bounce text-primary" />
                                <p className="text-sm font-medium text-primary">
                                    Drop your file here
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <FolderOpen className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">
                                    Drag & drop or{' '}
                                    <span className="text-primary underline">
                                        browse
                                    </span>
                                </p>
                            </>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                            {mediaType === 'image'
                                ? 'JPEG, PNG, GIF, WebP • Max 30 MB'
                                : 'MP4, WebM, MOV, AVI • Max 30 MB'}
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={getAcceptMimeTypes(mediaType)}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                        {!selectedFile && !isUploading && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Choose File
                            </Button>
                        )}
                    </div>
                </div>

                {/* File preview card */}
                {selectedFile && (
                    <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                        {isImage && previewUrl && (
                            <div className="bg-checkerboard relative h-40 w-full">
                                <img
                                    src={previewUrl}
                                    alt={selectedFile.name}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        )}
                        {isVideo && (
                            <div className="relative flex h-32 w-full items-center justify-center bg-black/10">
                                <Video className="h-10 w-10 text-muted-foreground/50" />
                                <span className="ml-2 text-sm text-muted-foreground">
                                    Video preview unavailable
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 p-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                                <FileIcon type={selectedFile.type} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatFileSize(selectedFile.size ?? 0)}
                                </p>
                            </div>
                            {!isUploading && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleRemoveFile}
                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {isUploading && (
                    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 font-medium">
                                {progress < 100 ? (
                                    'Uploading…'
                                ) : (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Saving to database…
                                    </>
                                )}
                            </span>
                            <span className="text-muted-foreground tabular-nums">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-center text-xs text-muted-foreground">
                            {progress < 100
                                ? 'Uploading directly to cloud storage'
                                : 'Finalizing upload, please wait…'}
                        </p>
                    </div>
                )}

                {/* Done state */}
                {!isUploading && progress === 100 && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        Upload complete!
                    </div>
                )}

                {/* Actions */}
                {!isUploading && progress < 100 && (
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelClick}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUploadClick}
                            disabled={
                                isUploading || !selectedFile || !category.trim()
                            }
                            className="flex-1 gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </div>
                )}
            </div>
        </UppyContextProvider>
    );
}

// ─── Agent Upload Dialog ─────────────────────────────────────────────────────

interface UploadDialogProps {
    agentId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadComplete?: (asset: Asset) => void;
}

function UploadDialog({
    agentId,
    open,
    onOpenChange,
    onUploadComplete,
}: UploadDialogProps) {
    const [mediaType, setMediaType] = useState<string>('image');
    const [category, setCategory] = useState('');
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            const t = setTimeout(() => {
                setCategory('');
                setCaption('');
                setProgress(0);
                setIsUploading(false);
                setUploadError(null);
                setMediaType('image');
            }, 300);

            return () => clearTimeout(t);
        }
    }, [open]);

    const handleUploadProgress = useCallback((newProgress: number) => {
        setProgress(newProgress);
        setIsUploading(true);
    }, []);

    const handleUploadComplete = useCallback(
        (asset: Asset) => {
            setIsUploading(false);
            setProgress(100);
            onUploadComplete?.(asset);
            setTimeout(() => {
                onOpenChange(false);
                setTimeout(() => {
                    router.reload({ only: ['mediaAssets'] });
                }, 200);
            }, 800);
        },
        [onUploadComplete, onOpenChange],
    );

    const handleUploadError = useCallback((error: Error) => {
        setUploadError(error.message);
        setIsUploading(false);
        setProgress(0);
    }, []);

    const handleCancel = useCallback(() => {
        setUploadError(null);
        setProgress(0);
        setIsUploading(false);
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isUploading) onOpenChange(isOpen);
            }}
        >
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30">
                    <Plus className="h-4 w-4" />
                    Add Asset
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] max-w-lg md:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Upload Media
                    </DialogTitle>
                    <DialogDescription>
                        Upload an image or video to this agent's media library.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g., pool, apartment"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isUploading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mediaType">Type</Label>
                            <select
                                id="mediaType"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                value={mediaType}
                                onChange={(e) => setMediaType(e.target.value)}
                                disabled={isUploading}
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="caption-input">
                            Caption (optional)
                        </Label>
                        <Input
                            id="caption-input"
                            placeholder="Add a caption…"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            disabled={isUploading}
                        />
                    </div>

                    <UppyUploadInner
                        agentId={agentId}
                        mediaType={mediaType}
                        category={category}
                        caption={caption}
                        onUploadProgress={handleUploadProgress}
                        onUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                        onCancel={handleCancel}
                        isOpen={open}
                        isUploading={isUploading}
                        progress={progress}
                    />

                    {uploadError && (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                            <p className="text-sm text-destructive">
                                {uploadError}
                            </p>
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => setUploadError(null)}
                                className="h-auto p-0 text-destructive"
                            >
                                Try again
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface MediasPlaceholderProps {
    agent: AgentConfig;
    assets: Asset[];
}

export default function MediasPlaceholder({
    agent,
    assets: initialAssets,
}: MediasPlaceholderProps) {
    const activeWorkspace = useActiveWorkspace()!;

    const [assetsList, setAssetsList] = useState(initialAssets);

    useEffect(() => {
        setAssetsList(initialAssets);
    }, [initialAssets]);

    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleDelete = (id: string) => {
        if (
            confirm(
                "Delete this media asset? The AI won't be able to send it anymore.",
            )
        ) {
            setAssetsList((prev) => prev.filter((a) => a.id !== id));
            setSelectedAsset((prev) => (prev?.id === id ? null : prev));
            router.delete(
                media.destroy({ slug: activeWorkspace.slug, id }).url,
            );
        }
    };

    const handleSelectAsset = (asset: Asset) => {
        setSelectedAsset(asset);
        setDetailOpen(true);
    };

    const handleToggleDefault = (id: string, isDefault: boolean) => {
        setSelectedAsset((prev) => {
            if (prev && prev.id === id)
                return { ...prev, is_default: isDefault };

            return prev;
        });
        setAssetsList((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, is_default: isDefault } : a,
            ),
        );
    };

    const handleUpdateAsset = (
        id: string,
        data: { category: string; caption: string },
    ) => {
        setSelectedAsset((prev) => {
            if (prev && prev.id === id) return { ...prev, ...data };

            return prev;
        });
        setAssetsList((prev) =>
            prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Médias de l'agent</h2>
                    <p className="text-sm text-muted-foreground">
                        Gérez les images et vidéos que {agent.name} peut envoyer
                        aux prospects.
                    </p>
                </div>
                <UploadDialog
                    agentId={agent.id}
                    open={uploadOpen}
                    onOpenChange={setUploadOpen}
                />
            </div>

            {/* Two-column layout: 70% grid, 30% stats */}
            <div className="flex flex-col gap-6 lg:flex-row">
                <div className="w-full lg:w-[70%]">
                    <MediaTabs
                        assets={assetsList}
                        onDelete={handleDelete}
                        onSelect={handleSelectAsset}
                        canManage={true}
                    />
                </div>
                <div className="w-full lg:w-[30%]">
                    <StatsCards assets={assetsList} />
                </div>
            </div>

            <AssetDetailDialog
                asset={selectedAsset}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onDelete={handleDelete}
                onToggleDefault={handleToggleDefault}
                onUpdate={handleUpdateAsset}
                canManage={true}
            />
        </div>
    );
}
