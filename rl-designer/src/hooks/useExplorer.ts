import { useAsyncOperations } from './useAsyncOperations'
import { downloadDecalVariant as downloadDecalVariantService } from '@/services'
import { useCollectionStore } from '@/stores/collectionStore'

interface UseExplorerReturn {
    downloadDecalVariant: (decalName: string, variantName: string) => Promise<string | undefined>;
    isLoading: boolean;
    isError: Error | null;
}

export const useExplorer = (): UseExplorerReturn => {
    const { isLoading, isError, executeAsync } = useAsyncOperations();
    const { addVariant } = useCollectionStore();

    const downloadDecalVariant = async (decalName: string, variantName: string) => {
        return executeAsync({
            operation: async () => {
                const result = await downloadDecalVariantService(decalName, variantName);
                if (!result.success) throw new Error(result.error || 'Failed to download decal variant');
                addVariant(decalName, variantName);
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
