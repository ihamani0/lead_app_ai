import { ExternalLink, ImageIcon } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
    title: string;
    location: string;
    specs: string;
    price: string;
    imageUrl?: string;
    onViewDetails?: () => void;
}

export const PropertyCard: FC<PropertyCardProps> = ({
    title,
    location,
    specs,
    price,
    imageUrl,
    onViewDetails,
}) => {
    return (
        <div className="my-2 max-w-[280px] overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="aspect-[16/9] bg-muted">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                )}
            </div>
            <div className="space-y-1.5 p-3">
                <h4 className="text-sm font-semibold text-foreground">
                    {title}
                </h4>
                <p className="text-xs text-muted-foreground">{location}</p>
                <p className="text-xs text-muted-foreground">{specs}</p>
                <p className="text-sm font-bold text-foreground">{price}</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                    onClick={onViewDetails}
                >
                    <ExternalLink className="mr-1.5 h-3 w-3" />
                    Voir les détails
                </Button>
            </div>
        </div>
    );
};
