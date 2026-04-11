// components/media/MediaIndex.tsx
import { Head, router } from '@inertiajs/react';
import { Image, Files } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { destroy } from '@/routes/media';
import type { Asset, BreadcrumbItem } from '@/types';

import { AssetDetailDialog } from './Partials/AssetDetailDialog';
import { MediaTabs } from './Partials/MediaTabs';

import { StatsCards } from './Partials/StatsCards';
import { UploadDialog } from './Partials/UploadDialog';

interface MediaIndexProps {
    assets: Asset[];
}

export default function Index({ assets }: MediaIndexProps) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.title'),
            href: '/dashboard',
        },
        {
            title: t('media.title'),
            href: '',
        },
    ];


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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('media.title')} />

            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="space-y-5">
                    {/* Header - Violet/Purple Gradient */}

                  <div className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 p-4 shadow-xl ring-1 ring-blue-400/30 sm:p-5 md:p-6 
                dark:from-blue-700 dark:to-cyan-700 dark:ring-blue-600/40">

                  {/* Subtle pattern */}
                  <div className="absolute inset-0 bg-[url('image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-12 dark:opacity-8" />

                  <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {/* LEFT */}
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                          <Image className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        </div>
                        <h1 className="text-lg font-semibold text-white sm:text-xl md:text-3xl leading-tight">
                          {t('media.title')}
                        </h1>
                      </div>
                      <p className="max-w-xs sm:max-w-md text-xs sm:text-sm md:text-base text-white/90 font-light">
                        {t('media.description')}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] sm:text-xs font-medium text-white backdrop-blur-sm">
                        <Files className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="whitespace-nowrap">
                          {assets.length} {t('media.assetsCount')}
                        </span>
                      </div>

                      {/* Upload Dialog */}
                      <div className="shrink-0">
                        <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
                      </div>
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
