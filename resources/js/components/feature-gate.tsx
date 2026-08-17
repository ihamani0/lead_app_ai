import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface FeatureGateProps {
    feature: boolean | undefined;
    children: ReactNode;
    message?: string;
}

export function FeatureGate({
    feature,
    children,
    message = 'This feature is not available on your current plan.',
}: FeatureGateProps) {
    if (feature) {
        return <>{children}</>;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="relative cursor-not-allowed">
                        <div className="pointer-events-none select-none opacity-60">
                            {children}
                        </div>
                        <div className="absolute right-2 top-2">
                            <div className="rounded-full bg-muted/90 p-1.5 shadow-sm backdrop-blur-sm">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
