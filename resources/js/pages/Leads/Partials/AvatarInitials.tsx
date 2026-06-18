import type { FC } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarColor, getInitials } from '@/lib/leadHelper';
import { cn } from '@/lib/utils';

interface AvatarInitialsProps {
    name: string;
    id: string | number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeMap = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-12 text-base',
};

export const AvatarInitials: FC<AvatarInitialsProps> = ({
    name,
    id,
    size = 'md',
    className,
}) => {
    const color = getAvatarColor(id);

    return (
        <Avatar className={cn(sizeMap[size], 'shrink-0', className)}>
            <AvatarFallback
                style={{ backgroundColor: color.bg, color: color.text }}
                className="font-semibold"
            >
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
};
