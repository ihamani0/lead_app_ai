// components/media/MediaIndex.tsx
import { Head, router } from '@inertiajs/react';
import { Image, Files } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/media';
import type { Asset } from '@/types';

import { AssetDetailDialog } from './Partials/AssetDetailDialog';
import { MediaTabs } from './Partials/MediaTabs';

import { StatsCards } from './Partials/StatsCards';
import { UploadDialog } from './Partials/UploadDialog';

interface MediaIndexProps {
    assets: Asset[];
}

export default function Index({ assets }: MediaIndexProps) {
    const { t } = useTranslation();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleDelete = (id: string) => {
        if (
            confirm(
                "Delete this media asset? The AI won't be able to send it anymore.",
            )
        ) {
            router.delete(destroy(id).url);
        }
    };

    const handleSelectAsset = (asset: Asset) => {
        setSelectedAsset(asset);
        setDetailOpen(true);
    };

    return (
        <AppLayout>
            <Head title={t('media.title')} />

            <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
                <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header - Violet/Purple Gradient */}
                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-700 to-cyan-700 p-8 shadow-2xl ring-1 ring-blue-400/30 md:p-12 dark:from-blue-900 dark:via-indigo-900 dark:to-cyan-900 dark:ring-blue-700/50">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
                        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-md">
                                        <Image className="h-8 w-8 text-white" />
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl">
                                        {t('media.title')}
                                    </h1>
                                </div>
                                <p className="max-w-xl text-lg font-light text-white/90">
                                    {t('media.description')}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
                                    <Files className="h-4 w-4" />
                                    <span>
                                        {assets.length} {t('media.assetsCount')}
                                    </span>
                                </div>
                                <UploadDialog
                                    open={uploadOpen}
                                    onOpenChange={setUploadOpen}
                                />
                            </div>
                        </div>
                    </div>

                    <StatsCards assets={assets} />
                    <MediaTabs
                        assets={assets}
                        onDelete={handleDelete}
                        onSelect={handleSelectAsset}
                    />

                    <AssetDetailDialog
                        asset={selectedAsset}
                        open={detailOpen}
                        onOpenChange={setDetailOpen}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
