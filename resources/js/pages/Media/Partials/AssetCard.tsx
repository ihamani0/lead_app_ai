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
                    />
                ) : asset.type === 'video' ? (
                    <div className="relative h-full w-full">
                        <video
                            src={asset.url}
                            preload="metadata"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg dark:bg-black/80">
                                <MediaIcon
                                    type="video"
                                    className="h-5 w-5 fill-current text-primary"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="rounded-2xl border border-border/50 bg-background/80 p-6 shadow-lg backdrop-blur-xl dark:bg-background/40">
                            <MediaIcon type={asset.type} className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            {asset.type}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors duration-300 group-hover:bg-black/20 group-hover:opacity-100 dark:group-hover:bg-black/40">
                    <span className="translate-y-2 transform rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow-lg transition-transform group-hover:translate-y-0 dark:bg-black/80">
                        View Details
                    </span>
                </div>

                <div className="absolute top-3 left-3">
                    <Badge
                        variant="secondary"
                        className="border-0 bg-background/80 font-medium shadow-sm backdrop-blur-md dark:bg-black/60"
                    >
                        {asset.category}
                    </Badge>
                </div>
            </div>

            <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/30 p-3 dark:bg-muted/10">
                <p
                    className="max-w-[70%] truncate text-xs text-muted-foreground"
                    title={asset.caption || 'No caption'}
                >
                    {asset.caption || 'Untitled'}
                </p>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="h-7 w-7 rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </CardFooter>
        </Card>
    );
}
