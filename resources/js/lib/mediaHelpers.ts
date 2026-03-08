// components/media/utils/mediaHelpers.ts

import type { Asset } from "@/types";


export const getIconComponent = (type: string) => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'document':
      return 'FileText';
    default:
      return 'Image';
  }
};

export const getGradient = (type: string): string => {
  switch (type) {
    case 'image':
      return 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-fuchsia-950/40';
    case 'video':
      return 'from-blue-500/20 via-cyan-500/20 to-teal-500/20 dark:from-blue-950/40 dark:via-cyan-950/40 dark:to-teal-950/40';
    default:
      return 'from-orange-500/20 via-amber-500/20 to-yellow-500/20 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40';
  }
};

export const filterAssetsByType = (assets: Asset[]) => ({
  images: assets.filter(a => a.type === 'image'),
  videos: assets.filter(a => a.type === 'video'),
  others: assets.filter(a => a.type !== 'image' && a.type !== 'video')
});