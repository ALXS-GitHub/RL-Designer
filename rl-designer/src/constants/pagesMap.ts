import type { PageType } from '@/constants/pages';
import useCollection from '@/hooks/useCollection';
import { useExplorerData } from '@/hooks/useExplorer';
import type { UseExplorerDataReturn } from '@/hooks/useExplorer';

export interface PageMapEntry {
    pageType: PageType;
    useData: () => UseExplorerDataReturn;
}

export const PagesMap: Record<PageType, PageMapEntry> = {
    collection: {
        pageType: 'collection',
        useData: useCollection,
    },
    explorer: {
        pageType: 'explorer',
        useData: useExplorerData,
    },
};