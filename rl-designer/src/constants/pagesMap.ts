import type { PageType } from '@/constants/pages';
import { useCollectionActions } from '@/hooks/useCollection';
import { useExplorerActions } from '@/hooks/useExplorer';
import type { DecalTextures } from '@/types';

export interface PageMapEntry {
    pageType: PageType;
    useData: () => {
        decals: DecalTextures[];
    };
}

export const PagesMap: Record<PageType, PageMapEntry> = {
    collection: {
        pageType: 'collection',
        useData: useCollectionActions,
    },
    explorer: {
        pageType: 'explorer',
        useData: useExplorerActions,
    },
};