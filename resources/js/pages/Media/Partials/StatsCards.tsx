// components/media/StatsCards.tsx
import { Image as ImageIcon, Video } from 'lucide-react';
import type { Asset } from '@/types';

interface StatsCardsProps {
    assets: Asset[];
}

export function StatsCards({ assets }: StatsCardsProps) {
    const images = assets.filter((a) => a.type === 'image').length;
    const videos = assets.filter((a) => a.type === 'video').length;

    const stats = [
        {
            icon: ImageIcon,
            label: 'Images',
            count: images,
            gradient: 'from-violet-500/10 to-purple-500/10',
            border: 'border-violet-500/20',
            text: 'text-violet-600 dark:text-violet-400',
        },
        {
            icon: Video,
            label: 'Videos',
            count: videos,
            gradient: 'from-blue-500/10 to-cyan-500/10',
            border: 'border-blue-500/20',
            text: 'text-blue-600 dark:text-blue-400',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={`rounded-xl bg-linear-to-br p-4 ${stat.gradient} border ${stat.border}`}
                >
                    <div
                        className={`flex items-center gap-2 ${stat.text} mb-1`}
                    >
                        <stat.icon className="h-4 w-4" />
                        <span className="text-xs font-semibold tracking-wider uppercase">
                            {stat.label}
                        </span>
                    </div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                </div>
            ))}
        </div>
    );
}
