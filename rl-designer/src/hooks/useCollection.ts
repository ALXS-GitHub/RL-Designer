import { useCollectionStore } from '@/stores/collectionStore';
import { useAsyncOperations } from './useAsyncOperations';
import { useQuery } from '@tanstack/react-query';
import { getDecalFolders } from '@/services/collection';
import type { DecalTextures } from '@/types';
import { removeDecalVariant as removeDecalVariantService } from '@/services';

interface UseCollectionReturn {
  decals: DecalTextures[];
  addDecal: (decal: DecalTextures) => void;
  removeDecalVariant: (decalName: string, variantName: string) => Promise<void>;
  isLoading: boolean;
  isError: Error | null;
}

const useCollection = (): UseCollectionReturn => {
  const { decals, setDecals, addDecal, removeVariant } = useCollectionStore();
  const { isLoading, isError, executeAsync } = useAsyncOperations();

  const fetchData = async () => {
    return executeAsync({
      operation: async () => {
        const result = await getDecalFolders();
        if (!result.success) throw new Error(result.error || 'Failed to fetch decals');
        setDecals(result.decals);
        return result.decals;
      }
    });
  };

  const removeDecalVariant = async (decalName: string, variantName: string) => {
    return executeAsync({
      operation: async () => {
        const result = await removeDecalVariantService(decalName, variantName);
        if (!result.success) throw new Error(result.error || 'Failed to remove decal variant');
        removeVariant(decalName, variantName);
      },
      successMessage: `Removed variant ${variantName} from decal ${decalName}`,
      errorMessage: `Failed to remove variant ${variantName} from decal ${decalName}`
    });
  };

  useQuery({
    queryKey: ['decalFolders'],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return { decals, addDecal, removeDecalVariant, isLoading, isError };
};

export default useCollection;
