import { useCarCollectionStore } from '@/stores/collectionStore';
import { useAsyncOperations } from './useAsyncOperations';
import { useQuery } from '@tanstack/react-query';
import { getDecalFolders } from '@/services/collection';
import type { DecalTextures } from '@/types';
import { removeDecalVariant as removeDecalVariantService } from '@/services';
import { ElementsMap } from '@/constants/elementsMap';
import useSelectedElementStore from '@/stores/selectedElementStore';

export interface UseCollectionDataReturn {
    decals: DecalTextures[];
    isLoading:boolean;
    isError: Error | null;
}

export const useCollectionData = (): UseCollectionDataReturn => {
    const { selectedElement } = useSelectedElementStore();
    const { useStore } = ElementsMap[selectedElement];
    const { decals, setDecals } = useStore();
    const { executeAsync } = useAsyncOperations();

    const fetchData = async () => {
        return executeAsync({
        operation: async () => {
            const result = await getDecalFolders(selectedElement);
            if (!result.success) throw new Error(result.error || 'Failed to fetch decals');
            setDecals(result.decals);
            return result.decals;
        },
        errorMessage: `Failed to fetch collection decals for ${selectedElement}`,
        });
    };

    const { isLoading, error } = useQuery({
        queryKey: ['decalFolders', selectedElement],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return { decals, isLoading, isError: error };
}

export interface UseCollectionActionsReturn {
    decals: DecalTextures[]; // store decals
    removeDecalVariant: (decalName: string, variantName: string) => Promise<void>;
    isLoading: boolean;
    isError: Error | null;
}

export const useCollectionActions = (): UseCollectionActionsReturn => {
    const { selectedElement } = useSelectedElementStore();
    const { useStore } = ElementsMap[selectedElement];
    const { decals, removeVariant } = useStore();
    const { isLoading, isError, executeAsync } = useAsyncOperations();

    const removeDecalVariant = async (decalName: string, variantName: string) => {
        return executeAsync({
            operation: async () => {
                const result = await removeDecalVariantService({ element: selectedElement, decalName, variantName });
                if (!result.success) throw new Error(result.error || 'Failed to remove decal variant');
                removeVariant(decalName, variantName);
            },
            successMessage: `Removed variant ${variantName} from decal ${decalName}`,
            errorMessage: `Failed to remove variant ${variantName} from decal ${decalName}`
        });
    };

    return {
        decals,
        removeDecalVariant,
        isLoading,
        isError,
    };
};
