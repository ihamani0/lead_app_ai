// components/media/AssetCard.tsx
import type { LucideIcon } from 'lucide-react';
import { Trash2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { getGradient } from '@/lib/mediaHelpers';
import { cn } from '@/lib/utils';
import type { Asset } from '@/types';

interface AssetCardProps {
    asset: Asset;
    onDelete: (id: string) => void;
    onClick: () => void;
}
const iconMap: Record<string, LucideIcon> = {
    image: ImageIcon,
    video: Video,
    document: FileText,
};
interface MediaIconProps {
    type: string;
    className?: string;
}

export function MediaIcon({ type, className = 'h-5 w-5' }: MediaIconProps) {
    const Icon = iconMap[type] || ImageIcon;
    return <Icon className={className} />;
}

export function AssetCard({ asset, onDelete, onClick }: AssetCardProps) {
    const [imageError, setImageError] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(asset.id);
    };

    return (
        <Card
            onClick={onClick}
            className={cn(
                'group relative cursor-pointer overflow-hidden',
                'border border-border/50 bg-card/50 backdrop-blur-sm',
                'hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5',
                'transition-all duration-300 ease-out',
                'hover:-translate-y-1',
                // Mobile: reduce hover effects on touch devices
                'active:scale-[0.98] sm:active:scale-100',
                'touch-manipulation',
            )}
        >
            <div
                className={cn(
                    'relative flex aspect-square items-center justify-center overflow-hidden',
                    'bg-linear-to-br',
                    getGradient(asset.type),
                )}
            >
                {asset.type === 'image' && !imageError ? (
                    <img
                        src={asset.url}
                        alt={asset.category}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImageError(true)}
                        // Mobile: optimize image loading
                        loading="lazy"
                        decoding="async"
                    />
                ) : asset.type === 'video' ? (
                    <div className="relative h-full w-full">
                        <video
                            src={asset.url}
                            preload="metadata"
                            className="h-full w-full object-cover"
                            // Mobile: disable autoplay hints
                            playsInline
                            muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg sm:h-10 sm:w-10 dark:bg-black/80">
                                <MediaIcon
                                    type="video"
                                    className="h-5 w-5 fill-current text-primary sm:h-4 sm:w-4"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="rounded-xl border border-border/50 bg-background/80 p-4 shadow-lg backdrop-blur-xl sm:rounded-2xl sm:p-6 dark:bg-background/40">
                            <MediaIcon
                                type={asset.type}
                                className="h-6 w-6 sm:h-8 sm:w-8"
                            />
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-xs">
                            {asset.type}
                        </span>
                    </div>
                )}


                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors duration-300 group-hover:bg-black/20 group-hover:opacity-100 sm:group-hover:opacity-100 dark:group-hover:bg-black/40">
                    <span className="translate-y-2 transform rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium shadow-lg transition-transform group-hover:translate-y-0 sm:px-4 sm:py-2 sm:text-sm dark:bg-black/80">
                        View Details
                    </span>
                </div>

                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <Badge
                        variant="secondary"
                        className="border-0 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-md sm:px-2.5 sm:py-0.5 sm:text-xs dark:bg-black/60"
                    >
                        {asset.category}
                    </Badge>
                </div>
            </div>

            <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/30 p-2 sm:p-3 dark:bg-muted/10">
                <p
                    className="max-w-[65%] truncate text-[11px] text-muted-foreground sm:max-w-[70%] sm:text-xs"
                    title={asset.caption || 'No caption'}
                >
                    {asset.caption || 'Untitled'}
                </p>
                <span className="text-[10px] text-muted-foreground/60 sm:text-xs">
                    {asset.type}
                </span>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className={cn(
                        'h-8 w-8 shrink-0 rounded-md',
                        'text-muted-foreground transition-colors',
                        'hover:bg-destructive/10 hover:text-destructive'
                    )}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
