import { useAsyncOperations } from './useAsyncOperations'
import { downloadDecalVariant as downloadDecalVariantService } from '@/services'
import { useCarCollectionStore } from '@/stores/collectionStore'
import type { ElementType } from '@/constants/elements';
import { ElementsMap } from '@/constants/elementsMap';
import useSelectedElementStore from '@/stores/selectedElementStore';
import type { DecalTextures } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getDecalsFromGitHub } from '@/services/explorer';
import { useEffect, useState } from 'react';
import { useExplorerStore } from '@/stores/collectionStore';

export interface UseExplorerDataReturn {
    decals: DecalTextures[];
    isLoading: boolean;
    isError: Error | null;
}

export const useExplorerData = (): UseExplorerDataReturn => {
    const { selectedElement } = useSelectedElementStore();
    const { decals, setDecals } = useExplorerStore();
    const { isLoading, isError, executeAsync } = useAsyncOperations();


    const fetchData = async () => {
    return executeAsync({
        operation: async () => {
        const result = await getDecalsFromGitHub(selectedElement);
        if (!result.success) throw new Error(result.error || 'Failed to fetch decals');
        console.log('Fetched decals:', result.decals);
        setDecals(result.decals);
        return result.decals;
        }, 
        errorMessage: `Failed to fetch explorer decals for ${selectedElement}`,
    });
    };

    useQuery({
        queryKey: ['GitDecals', selectedElement],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return {
        decals,
        isLoading,
        isError,
    };
};

interface UseExplorerActionsReturn {
    downloadDecalVariant: (decalName: string, variantName: string) => Promise<string | undefined>;
    isLoading: boolean;
    isError: Error | null;
}

export const useExplorerActions = (): UseExplorerActionsReturn => {
    const { selectedElement } = useSelectedElementStore();
    const { useStore } = ElementsMap[selectedElement];
    const { addVariant } = useStore();
    const { isLoading, isError, executeAsync } = useAsyncOperations();

    const downloadDecalVariant = async (decalName: string, variantName: string) => {
        return executeAsync({
            operation: async () => {
                const result = await downloadDecalVariantService({ elementType: selectedElement, decalName, variantName });
                if (!result.success || !result.variant_info) throw new Error(result.error || 'Failed to download decal variant');
                addVariant(decalName, result.variant_info);
                return result.message;
            },
            successMessage: `Downloaded variant ${variantName} of decal ${decalName}`,
            errorMessage: `Failed to download variant ${variantName} of decal ${decalName}`
        });
    };

    return {
        downloadDecalVariant,
        isLoading,
        isError,
    };
};
