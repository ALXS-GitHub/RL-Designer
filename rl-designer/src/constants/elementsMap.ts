import type { ElementType } from "@/constants/elements";
import { useCarCollectionStore, useBallCollectionStore } from "@/stores/collectionStore";
import type { CollectionState } from "@/stores/collectionStore";

export interface ElementsMapEntry {
    elementType: ElementType;
    useStore: () => CollectionState;
}

export const ElementsMap: Record<ElementType, ElementsMapEntry> = {
    car: {
        elementType: 'car',
        useStore: useCarCollectionStore
    },
    ball: {
        elementType: 'ball',
        useStore: useBallCollectionStore
    }
};
