import { router } from '@inertiajs/react';
import {
    FileText,
    Film,
    Grid3x3,
    Image,
    List,
    Music,
    Play,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { AssetDetailDialog } from '@/pages/Media/Partials/AssetDetailDialog';
import { UploadDialog } from '@/pages/Media/Partials/UploadDialog';
import { destroy } from '@/routes/workspaces/media';
import type { Asset } from '@/types';

interface MediaTabProps {
    assets: Asset[];
    canCreate: boolean;
    canManage: boolean;
}

const MEDIA_TYPES = ['image', 'video', 'audio', 'pdf', 'document'];
const CATEGORIES = [
    'residences',
    'plans',
    'visits',
    'brochures',
    'location',
    'logos',
    'audio',
    'interiors',
];

function getTypeForBadge(type: string, url: string): string {
    if (type === 'image') return 'JPG';
    if (type === 'video') return 'MP4';
    const ext = url.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'PDF';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'MP3';
    return type.toUpperCase();
}

function MediaCard({
    asset,
    onDelete,
    onView,
    canManage,
}: {
    asset: Asset;
    onDelete: (id: string) => void;
    onView: (asset: Asset) => void;
    canManage: boolean;
}) {
    const type = asset.type || 'image';
    const ext = getTypeForBadge(type, asset.url);
    const isVideo = type === 'video';
    const isAudio =
        type === 'audio' ||
        ['mp3', 'wav', 'ogg'].includes(asset.url.split('.').pop() || '');
    const isPdf = asset.url.toLowerCase().endsWith('.pdf');

    return (
        <Card
            className="group cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => onView(asset)}
        >
            <div className="relative aspect-4/3 bg-muted">
                {type === 'image' && !isPdf && (
                    <img
                        src={asset.url}
                        alt={asset.caption || asset.name || ''}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                )}
                {isVideo && (
                    <div className="relative flex h-full w-full items-center justify-center bg-muted">
                        <Film className="h-8 w-8 text-muted-foreground/50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-lg">
                                <Play className="ml-0.5 h-4 w-4 text-foreground" />
                            </div>
                        </div>
                    </div>
                )}
                {isAudio && (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                        <Music className="h-8 w-8 text-purple-500/50" />
                    </div>
                )}
                {isPdf && (
                    <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-900">
                        <FileText className="h-8 w-8 text-red-500/50" />
                    </div>
                )}

                <div className="absolute top-1.5 left-1.5 rounded bg-[#1A1A2E]/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {ext}
                </div>

                {canManage && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="absolute top-1.5 right-1.5 rounded-lg bg-black/30 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50">
                                <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(asset);
                                }}
                            >
                                Voir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(asset.id);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="space-y-1 p-2">
                <p className="truncate text-xs font-medium text-foreground">
                    {asset.caption || asset.name || 'Sans titre'}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{asset.size || '—'}</span>
                    {asset.created_at && (
                        <>
                            <span>•</span>
                            <span>
                                {new Date(asset.created_at).toLocaleDateString(
                                    'fr-FR',
                                    {
                                        day: 'numeric',
                                        month: 'short',
                                    },
                                )}
                            </span>
                        </>
                    )}
                </div>
                {asset.category && (
                    <Badge
                        variant="secondary"
                        className="bg-indigo-50 text-[10px] text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400"
                    >
                        {asset.category}
                    </Badge>
                )}
            </div>
        </Card>
    );
}

export function MediaTab({ assets, canCreate, canManage }: MediaTabProps) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [uploadOpen, setUploadOpen] = useState(false);
    const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filtered = useMemo(() => {
        const result = assets.filter((asset) => {
            const nameMatch = (asset.caption || asset.name || '')
                .toLowerCase()
                .includes(search.toLowerCase());
            const typeMatch = typeFilter === 'all' || asset.type === typeFilter;
            const catMatch =
                categoryFilter === 'all' || asset.category === categoryFilter;
            return nameMatch && typeMatch && catMatch;
        });

        if (sortBy === 'oldest') {
            result.sort(
                (a, b) =>
                    new Date(a.created_at ?? '').getTime() -
                    new Date(b.created_at ?? '').getTime(),
            );
        } else {
            result.sort(
                (a, b) =>
                    new Date(b.created_at ?? '').getTime() -
                    new Date(a.created_at ?? '').getTime(),
            );
        }

        return result;
    }, [assets, search, typeFilter, categoryFilter, sortBy]);

    const handleDelete = (id: string) => {
        if (confirm('Supprimer ce média ?')) {
            router.delete(destroy({ slug: activeWorkspace!.slug, id }).url);
        }
    };

    const handleView = (asset: Asset) => {
        setDetailAsset(asset);
        setDetailOpen(true);
    };

    const handleUpdateAsset = (
        id: string,
        data: { category: string; caption: string },
    ) => {
        router.put(`/workspaces/${activeWorkspace?.slug}/media/${id}`, data, {
            preserveScroll: true,
        });
    };

    const handleToggleDefault = (id: string) => {
        router.post(
            `/workspaces/${activeWorkspace?.slug}/media/${id}/toggle-default`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {t('bibliotheque.media.title')}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {t('bibliotheque.media.description')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {canCreate && (
                        <>
                            <UploadDialog
                                open={uploadOpen}
                                onOpenChange={setUploadOpen}
                                onUploadComplete={() => {}}
                            />
                            <Button
                                size="sm"
                                className="gap-2"
                                onClick={() => setUploadOpen(true)}
                            >
                                <Plus className="h-4 w-4" />
                                {t('bibliotheque.media.addMedia')}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card className="border-0 bg-card shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[180px] flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    'bibliotheque.media.filters.search',
                                )}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 rounded-lg pl-9 text-xs"
                            />
                        </div>

                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="h-9 w-[120px] rounded-lg text-xs">
                                <SelectValue
                                    placeholder={t(
                                        'bibliotheque.media.filters.typeAll',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('bibliotheque.media.filters.typeAll')}
                                </SelectItem>
                                {MEDIA_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {t(`bibliotheque.media.types.${type}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="h-9 w-[130px] rounded-lg text-xs">
                                <SelectValue
                                    placeholder={t(
                                        'bibliotheque.media.filters.categoryAll',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t(
                                        'bibliotheque.media.filters.categoryAll',
                                    )}
                                </SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {t(
                                            `bibliotheque.media.categories.${cat}`,
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="ml-auto flex items-center gap-2">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-9 w-[140px] rounded-lg text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">
                                        {t(
                                            'bibliotheque.media.filters.sortRecent',
                                        )}
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        {t(
                                            'bibliotheque.media.filters.sortOldest',
                                        )}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant={
                                    viewMode === 'grid' ? 'default' : 'outline'
                                }
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3x3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === 'list' ? 'default' : 'outline'
                                }
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Count */}
            <p className="text-xs text-muted-foreground">
                {t('bibliotheque.media.count').replace(
                    '{count}',
                    String(filtered.length),
                )}
            </p>

            {/* Grid / List */}
            {filtered.length > 0 ? (
                <div
                    className={cn(
                        'grid gap-3',
                        viewMode === 'grid'
                            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                            : 'grid-cols-1',
                    )}
                >
                    {filtered.map((asset) => (
                        <MediaCard
                            key={asset.id}
                            asset={asset}
                            onDelete={handleDelete}
                            onView={handleView}
                            canManage={canManage}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20">
                    <Image className="mb-4 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                        {assets.length === 0
                            ? 'Aucun média. Importez votre premier fichier !'
                            : 'Aucun média ne correspond à vos filtres.'}
                    </p>
                </div>
            )}

            {/* Asset Detail Dialog */}
            <AssetDetailDialog
                asset={detailAsset}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onDelete={handleDelete}
                onToggleDefault={handleToggleDefault}
                onUpdate={handleUpdateAsset}
                canManage={canManage}
            />
        </div>
    );
}
