import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface OnlineDotProps {
    online?: boolean;
    className?: string;
}

export const OnlineDot: FC<OnlineDotProps> = ({
    online = false,
    className,
}) => {
    return (
        <span
            className={cn(
                'inline-block h-2 w-2 rounded-full',
                online ? 'bg-emerald-500' : 'bg-gray-300',
                className,
            )}
            title={online ? 'En ligne' : 'Hors ligne'}
        />
    );
};
