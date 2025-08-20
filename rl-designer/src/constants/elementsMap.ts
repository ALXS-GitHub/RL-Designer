import type { ElementType } from "@/constants/elements";
import { useCarCollectionStore, useBallCollectionStore, useWheelCollectionStore, useBoostMeterCollectionStore } from "@/stores/collectionStore";
import type { CollectionState } from "@/stores/collectionStore";

export interface ElementsMapEntry {
    elementType: ElementType;
    useStore: () => CollectionState;
    displayName: string;
    decalsDisplayName: string;
    hasModel3D: boolean;
}

export const ElementsMap: Record<ElementType, ElementsMapEntry> = {
    car: {
        elementType: 'car',
        useStore: useCarCollectionStore,
        displayName: 'Car',
        decalsDisplayName: 'Car Decals',
        hasModel3D: true
    },
    ball: {
        elementType: 'ball',
        useStore: useBallCollectionStore,
        displayName: 'Ball',
        decalsDisplayName: 'Ball Decals',
        hasModel3D: true
    },
    wheel: {
        elementType: 'wheel',
        useStore: useWheelCollectionStore,
        displayName: 'Wheel',
        decalsDisplayName: 'Wheel Decals',
        hasModel3D: false
    },
    boost_meter: {
        elementType: 'boost_meter',
        useStore: useBoostMeterCollectionStore,
        displayName: 'Boost Meter',
        decalsDisplayName: 'Boost Meters',
        hasModel3D: false
    }
};
