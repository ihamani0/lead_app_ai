// components/media/MediaTabs.tsx
import { Image as ImageIcon, Video, FileText } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Asset } from '@/types';
import { MediaGrid } from './MediaGrid';

interface MediaTabsProps {
    assets: Asset[];
    onDelete: (id: string) => void;
    onSelect: (asset: Asset) => void;
}

export function MediaTabs({ assets, onDelete, onSelect }: MediaTabsProps) {
    const [activeTab, setActiveTab] = useState('all');

    const images = assets.filter((a) => a.type === 'image');
    const videos = assets.filter((a) => a.type === 'video');
    const others = assets.filter(
        (a) => a.type !== 'image' && a.type !== 'video',
    );

    const tabs = [
        { value: 'all', label: 'All Assets', count: assets.length, icon: null },
        {
            value: 'images',
            label: 'Images',
            count: images.length,
            icon: ImageIcon,
        },
        { value: 'videos', label: 'Videos', count: videos.length, icon: Video },
        {
            value: 'other',
            label: 'Other',
            count: others.length,
            icon: FileText,
        },
    ];

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start gap-1 rounded-xl bg-muted/50 p-1">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                        {tab.icon && <tab.icon className="h-4 w-4" />}
                        {tab.label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                            {tab.count}
                        </Badge>
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
                <MediaGrid
                    assets={assets}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    emptyType="media"
                />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
                <MediaGrid
                    assets={images}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    emptyType="image"
                />
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
                <MediaGrid
                    assets={videos}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    emptyType="video"
                />
            </TabsContent>

            <TabsContent value="other" className="mt-6">
                <MediaGrid
                    assets={others}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    emptyType="other"
                />
            </TabsContent>
        </Tabs>
    );
}
