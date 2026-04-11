// components/media/MediaGrid.tsx
import { Image as ImageIcon, Video } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Asset } from '@/types';
import { AssetCard } from './AssetCard';

interface MediaGridProps {
    assets: Asset[];
    onDelete: (id: string) => void;
    onSelect: (asset: Asset) => void;
    emptyType: string;
}

export function MediaGrid({
    assets,
    onDelete,
    onSelect,
    emptyType,
}: MediaGridProps) {
    const { t } = useTranslation();

    if (assets.length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    {emptyType === 'image' && (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                    {emptyType === 'video' && (
                        <Video className="h-8 w-8 text-muted-foreground" />
                    )}
                    {emptyType === 'media' && (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-muted-foreground">
                    {t('media.mediaGrid.noAssets', { type: emptyType })}
                </h3>
                <p className="text-sm text-muted-foreground/60">
                    {t('media.mediaGrid.uploadFiles', { type: emptyType })}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {assets.map((asset) => (
                <AssetCard
                    key={asset.id}
                    asset={asset}
                    onDelete={onDelete}
                    onClick={() => onSelect(asset)}
                />
            ))}
        </div>
    );
}
