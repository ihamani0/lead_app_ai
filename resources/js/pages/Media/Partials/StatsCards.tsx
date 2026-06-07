// components/media/StatsCards.tsx
import { FileText, HardDrive, Image as ImageIcon, Video } from 'lucide-react';
import type { Asset } from '@/types';

function formatStorage(kb: number): string {
    if (kb === 0) return '0 KB';
    const units = ['KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(kb) / Math.log(1024)), units.length - 1);
    return (kb / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
}

interface StatsCardsProps {
    assets: Asset[];
}

export function StatsCards({ assets }: StatsCardsProps) {
    const images = assets.filter((a) => a.type === 'image').length;
    const videos = assets.filter((a) => a.type === 'video').length;
    const totalCount = assets.length;
    const totalSizeKB = assets.reduce((sum, a) => sum + (parseFloat(a.size ?? '0') || 0), 0);

    const stats = [
        {
            icon: FileText,
            label: 'Total',
            count: totalCount,
            gradient: 'from-slate-500/10 to-gray-500/10',
            border: 'border-slate-500/20',
            text: 'text-slate-600 dark:text-slate-400',
        },
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
        {
            icon: HardDrive,
            label: 'Storage',
            count: formatStorage(totalSizeKB),
            gradient: 'from-amber-500/10 to-yellow-500/10',
            border: 'border-amber-500/20',
            text: 'text-amber-600 dark:text-amber-400',
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
