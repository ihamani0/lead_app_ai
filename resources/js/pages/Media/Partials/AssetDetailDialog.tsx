// components/media/AssetDetailDialog.tsx
import axios from 'axios';
import {
    ExternalLink,
    Trash2,
    Tag,
    FileType,
    Link2,
    Calendar,
    Check,
    Copy,
    Eye,
    Star,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useClipboard } from '@/hooks/use-clipboard';
import { getGradient } from '@/lib/mediaHelpers';
import { cn } from '@/lib/utils';
import media from '@/routes/media';
import type { Asset } from '@/types';
import { MediaIcon } from './AssetCard';
interface AssetDetailDialogProps {
    asset: Asset | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (id: string) => void;
    onToggleDefault?: (id: string, isDefault: boolean) => void;
}

interface MetadataRowProps {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    capitalize?: boolean;
    truncate?: boolean;
    onCopy?: () => void;
    copied?: boolean;
}

function MetadataRow({
    icon,
    label,
    value,
    capitalize = false,
    truncate = false,
    onCopy,
    copied,
}: MetadataRowProps) {
    return (
        <div className="flex w-full max-w-full items-start justify-between gap-3">
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase">
                {icon} {label}
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
                <span
                    className={cn(
                        'text-right text-sm break-words',
                        capitalize && 'capitalize',
                        truncate && 'max-w-[140px] truncate sm:max-w-[200px]',
                    )}
                >
                    {value || (
                        <span className="text-muted-foreground/60 italic">
                            —
                        </span>
                    )}
                </span>
                {onCopy && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-1 h-5 w-5 shrink-0"
                        onClick={onCopy}
                        aria-label={`Copy ${label}`}
                    >
                        {copied ? (
                            <Check className="h-3 w-3" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

export function AssetDetailDialog({
    asset,
    open,
    onOpenChange,
    onDelete,
    onToggleDefault,
}: AssetDetailDialogProps) {
    const { copy, isCopied } = useClipboard();
    const [isUpdatingDefault, setIsUpdatingDefault] = useState(false);

    if (!asset) return null;

    const handleToggleDefault = async () => {
        if (!onToggleDefault) return;
        setIsUpdatingDefault(true);
        try {
            const response = await axios.post(
                media.toggleDefault(asset.id).url,
            );
            onToggleDefault(asset.id, response.data.is_default);
        } catch (error) {
            console.error('Failed to toggle default:', error);
        } finally {
            setIsUpdatingDefault(false);
        }
    };

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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full max-w-full flex-col rounded-t-2xl border-none p-0 shadow-2xl"
                style={{ boxSizing: 'border-box' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 📱 Thumbnail + Preview Section */}
                <div className="relative flex shrink-0 flex-col items-center justify-center gap-3 border-b border-border/50 bg-linear-to-br from-muted/40 to-background p-4">
                    <div
                        className={cn(
                            'relative flex aspect-video w-full max-w-xs items-center justify-center overflow-hidden rounded-xl shadow-inner sm:max-w-sm',
                            'bg-linear-to-br',
                            getGradient(asset.type),
                        )}
                    >
                        {asset.type === 'image' ? (
                            <img
                                src={asset.url}
                                alt={asset.category}
                                className="h-full w-full object-contain p-2"
                            />
                        ) : asset.type === 'video' ? (
                            <video
                                src={asset.url}
                                className="h-full w-full object-contain p-2"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-3 p-6 text-white/90">
                                <MediaIcon
                                    type={asset.type}
                                    className="h-14 w-14 drop-shadow-md"
                                />
                                <span className="text-xs font-semibold tracking-widest uppercase drop-shadow">
                                    {asset.type} Document
                                </span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="default"
                        size="sm"
                        className="w-full gap-2 sm:w-auto"
                        onClick={() =>
                            window.open(
                                asset.url,
                                '_blank',
                                'noopener,noreferrer',
                            )
                        }
                    >
                        <Eye className="h-4 w-4" />
                        Preview in New Tab
                    </Button>
                </div>

                {/* 📜 Scrollable Details Section */}
                <div className="w-full max-w-full flex-1 space-y-4 overflow-y-auto px-4 py-4">
                    <div className="space-y-1">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <MediaIcon
                                type={asset.type}
                                className="h-5 w-5 shrink-0"
                            />
                            <span className="truncate">Asset Details</span>
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Media information and metadata
                        </p>
                    </div>

                    <Separator />

                    {/* Quick Actions */}
                    <div className="grid w-full grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 truncate"
                            onClick={handleOpenExternal}
                        >
                            <ExternalLink className="h-4 w-4 shrink-0" /> Open
                            Source
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 truncate"
                            onClick={() => handleCopy(asset.url, 'url')}
                        >
                            {isCopied('url') ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            {isCopied('url') ? 'Copied' : 'Copy URL'}
                        </Button>
                    </div>

                    <Separator />

                    {/* Metadata (Inline for zero overflow) */}
                    <div className="w-full max-w-full space-y-3">
                        <MetadataRow
                            icon={<Tag className="h-4 w-4 shrink-0" />}
                            label="Category"
                            value={asset.category}
                            onCopy={() =>
                                handleCopy(asset.category, 'category')
                            }
                            copied={isCopied('category')}
                        />
                        <MetadataRow
                            icon={<FileType className="h-4 w-4 shrink-0" />}
                            label="Type"
                            value={asset.type}
                            capitalize
                        />

                        {/* URL with bulletproof wrapping */}
                        <div className="w-full max-w-full space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase">
                                    <Link2 className="h-3.5 w-3.5 shrink-0" />{' '}
                                    Direct URL
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 shrink-0"
                                    onClick={() => handleCopy(asset.url, 'url')}
                                >
                                    {isCopied('url') ? (
                                        <Check className="h-3 w-3" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                            <div className="w-full rounded-md border bg-muted/30 p-2 font-mono text-[10px] leading-relaxed break-all select-all sm:text-xs">
                                {asset.url}
                            </div>
                        </div>

                        {/* {asset.external_url && (
              <MetadataRow icon={<Link2 className="h-4 w-4 shrink-0" />} label="External URL" value={asset.external_url} truncate onCopy={() => handleCopy(asset.external_url, 'external')} copied={isCopied('external')} />
            )} */}

                        {asset.created_at && (
                            <MetadataRow
                                icon={<Calendar className="h-4 w-4 shrink-0" />}
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

                    {/* Caption */}
                    <div className="w-full max-w-full space-y-1.5">
                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Caption / Description
                        </p>
                        <div className="w-full rounded-md border border-border/50 bg-muted/30 p-3 text-sm leading-relaxed wrap-break-word">
                            {asset.caption || (
                                <span className="text-muted-foreground italic">
                                    No caption provided
                                </span>
                            )}
                        </div>
                    </div>

                    {/* AI Default Toggle */}
                    <div className="flex w-full max-w-full items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 shrink-0 text-amber-500" />
                            <span className="text-sm text-amber-700 dark:text-amber-400">
                                AI Default
                            </span>
                        </div>
                        <Switch
                            checked={asset.is_default ?? false}
                            onCheckedChange={handleToggleDefault}
                            disabled={isUpdatingDefault}
                        />
                    </div>

                    {/* AI Reference */}
                    <div className="w-full max-w-full rounded-md border border-primary/10 bg-primary/5 p-3 text-xs wrap-break-word text-primary">
                        <span className="font-semibold">AI Reference:</span> Use
                        category "{asset.category}" in your agent prompts to
                        send this media.
                    </div>

                    {/* Delete */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        className="mt-2 w-full gap-2 sm:w-auto"
                    >
                        <Trash2 className="h-4 w-4 shrink-0" /> Delete Asset
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
