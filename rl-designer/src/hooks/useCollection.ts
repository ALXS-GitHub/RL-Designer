import { useCarCollectionStore } from '@/stores/collectionStore';
import { useAsyncOperations } from './useAsyncOperations';
import { useQuery } from '@tanstack/react-query';
import { getDecalFolders } from '@/services/collection';
import type { DecalTextures } from '@/types';
import { removeDecalVariant as removeDecalVariantService } from '@/services';
import type { ElementType } from '@/constants/elements';
import { ElementsMap } from '@/constants/elementsMap';
import useSelectedElementStore from '@/stores/selectedElementStore';

interface UseCollectionReturn {
  decals: DecalTextures[];
  addDecal: (decal: DecalTextures) => void;
  removeDecalVariant: (decalName: string, variantName: string) => Promise<void>;
  isLoading: boolean;
  isError: Error | null;
}

const useCollection = (): UseCollectionReturn => {
  const { selectedElement } = useSelectedElementStore();
  const { useStore } = ElementsMap[selectedElement];
  const { decals, setDecals, addDecal, removeVariant } = useStore();
  const { isLoading, isError, executeAsync } = useAsyncOperations();

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

  const removeDecalVariant = async (decalName: string, variantName: string) => {
    return executeAsync({
      operation: async () => {
        const result = await removeDecalVariantService({ elementType: selectedElement, decalName, variantName });
        if (!result.success) throw new Error(result.error || 'Failed to remove decal variant');
        removeVariant(decalName, variantName);
      },
      successMessage: `Removed variant ${variantName} from decal ${decalName}`,
      errorMessage: `Failed to remove variant ${variantName} from decal ${decalName}`
    });
  };

  useQuery({
    queryKey: ['decalFolders', selectedElement],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return { decals, addDecal, removeDecalVariant, isLoading, isError };
};

export default useCollection;
