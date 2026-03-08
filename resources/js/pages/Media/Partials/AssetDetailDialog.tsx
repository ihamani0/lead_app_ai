// components/media/AssetDetailDialog.tsx
import {
    ExternalLink,
    Trash2,
    Tag,
    FileType,
    Link2,
    Calendar,
    Check,
    Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useClipboard } from '@/hooks/use-clipboard';
import { getGradient } from '@/lib/mediaHelpers';
import { cn } from '@/lib/utils';
import type { Asset } from '@/types';
import { MediaIcon } from './AssetCard';
import { MetadataItem } from './MetadataItem';

interface AssetDetailDialogProps {
    asset: Asset | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (id: string) => void;
}

export function AssetDetailDialog({
    asset,
    open,
    onOpenChange,
    onDelete,
}: AssetDetailDialogProps) {
    const { copy, isCopied } = useClipboard();

    if (!asset) return null;

    const handleCopy =
        (text: string, field: string) => (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            copy(text, field);
        };

    const handleOpenExternal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(asset.url, '_blank');
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this media asset?')) {
            onDelete(asset.id);
            onOpenChange(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className="gap-0 overflow-hidden p-0"
                style={{
                    width: '95vw',
                    maxWidth: '96rem',
                    height: '90vh',
                    maxHeight: '90vh',
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div
                        className={cn(
                            'relative flex items-center justify-center',
                            'h-[40vh] md:h-full',
                            'bg-linear-to-br',
                            getGradient(asset.type),
                        )}
                    >
                        {asset.type === 'image' ? (
                            <img
                                src={asset.url}
                                alt={asset.category}
                                className="h-full w-full object-contain p-4"
                            />
                        ) : asset.type === 'video' ? (
                            <video
                                src={asset.url}
                                controls
                                className="h-full w-full object-contain p-4"
                                style={{
                                    // Maintain 16:9 aspect ratio within container
                                    aspectRatio: '16/9',
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="rounded-3xl border border-border bg-background/90 p-8 shadow-2xl backdrop-blur-xl dark:bg-background/50">
                                    <MediaIcon
                                        type={asset.type}
                                        className="h-12 w-12"
                                    />
                                </div>
                                <span className="text-lg font-semibold tracking-widest text-muted-foreground uppercase">
                                    {asset.type} Document
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col h-full min-h-0">
                        <DialogHeader className="p-4 md:p-6 pb-3 md:pb-4 shrink-0">
                            <DialogTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold">
                                <MediaIcon
                                    type={asset.type}
                                    className="h-5 w-5"
                                />
                                Asset Details
                            </DialogTitle>
                            <DialogDescription className="text-sm md:text-base">
                                Media information and metadata
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="flex-1 px-4 md:px-6">
                            <div className="space-y-6 pb-6">
                                <div className="flex flex-col xl:flex-row gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={handleOpenExternal}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={handleCopy(asset.url, 'url')}
                                    >
                                        {isCopied('url') ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                        {isCopied('url')
                                            ? 'Copied'
                                            : 'Copy URL'}
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <MetadataItem
                                        icon={<Tag className="h-4 w-4" />}
                                        label="Category"
                                        value={asset.category}
                                        onCopy={handleCopy(
                                            asset.category,
                                            'category',
                                        )}
                                        copied={isCopied('category')}
                                    />

                                    <MetadataItem
                                        icon={<FileType className="h-4 w-4" />}
                                        label="Type"
                                        value={asset.type}
                                        capitalize
                                    />

                                    <MetadataItem
                                        icon={<Link2 className="h-4 w-4" />}
                                        label="External URL"
                                        value={asset.external_url || 'None'}
                                        truncate
                                        onCopy={
                                            asset.external_url
                                                ? handleCopy(
                                                      asset.external_url,
                                                      'external',
                                                  )
                                                : undefined
                                        }
                                        copied={isCopied('external')}
                                    />

                                    {asset.created_at && (
                                        <MetadataItem
                                            icon={
                                                <Calendar className="h-4 w-4" />
                                            }
                                            label="Created"
                                            value={new Date(
                                                asset.created_at,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        />
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Caption / Description
                                    </Label>
                                    <div className="rounded-lg border border-border/50 bg-muted/50 p-3 text-sm leading-relaxed">
                                        {asset.caption || (
                                            <span className="text-muted-foreground italic">
                                                No caption provided
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs text-primary">
                                    <span className="font-semibold">
                                        AI Reference:
                                    </span>{' '}
                                    Use category "{asset.category}" in your
                                    agent prompts to send this media.
                                </div>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="border-t border-border/50 p-6 pt-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Asset
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
