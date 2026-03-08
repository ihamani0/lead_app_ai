// components/media/MetadataItem.tsx
import { CopyButton } from '@/components/copy-button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
 

interface MetadataItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    truncate?: boolean;
    onCopy?: (e: React.MouseEvent) => void;
    copied?: boolean;
    capitalize?: boolean;
}

export function MetadataItem({
    icon,
    label,
    value,
    truncate,
    onCopy,
    copied,
    capitalize,
}: MetadataItemProps) {
    return (
        <div className="group/item flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="min-w-0 flex-1">
                <Label className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {label}
                </Label>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'text-sm font-medium',
                            truncate && 'truncate',
                            capitalize && 'capitalize',
                        )}
                    >
                        {value}
                    </span>
                    {onCopy && (
                        <div className="opacity-0 transition-opacity group-hover/item:opacity-100">
                            <CopyButton
                                onCopy={onCopy}
                                copied={copied || false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
