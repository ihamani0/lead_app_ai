// components/media/MediaIndex.tsx
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
            <Head title="Media Catalog" />

            <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
                <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 border-b border-border/50 pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                                Media Catalog
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage assets for your AI agent to share with
                                clients
                            </p>
                        </div>

                        <UploadDialog
                            open={uploadOpen}
                            onOpenChange={setUploadOpen}
                        /> 
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
