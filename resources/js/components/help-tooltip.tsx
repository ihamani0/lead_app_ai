import { HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
    content: string;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTooltip({
    content,
    className,
    side = 'top',
}: HelpTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <HelpCircle
                    className={cn(
                        'h-4 w-4 cursor-help text-muted-foreground/60 transition-colors hover:text-muted-foreground',
                        className,
                    )}
                />
            </TooltipTrigger>
            <TooltipContent side={side}>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    );
}
