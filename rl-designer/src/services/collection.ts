import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';
import type { ElementType } from '@/constants/elements';

interface FetchResult {
  success: boolean;
  decals: DecalTextures[];
  error?: string;
}

export const getDecalFolders = async (elementType: ElementType): Promise<FetchResult> => {
  try {
    const result = await invoke<FetchResult>(`get_${elementType}_decal_texture_folder`);
    return result;
  } catch (error) {
    console.error(`Failed to fetch ${elementType} decal folders:`, error);
    return {
      success: false,
      decals: [],
      error: `Failed to invoke command: ${error}`
    };
  }
}

interface RemoveResult {
  success: boolean;
  error?: string;
}

interface RemoveDecalVariantParams {
  elementType: ElementType;
  decalName: string;
  variantName: string;
}

export const removeDecalVariant = async ({elementType, decalName, variantName}: RemoveDecalVariantParams): Promise<RemoveResult> => {
  try {
    const result = await invoke<RemoveResult>(`remove_${elementType}_decal_variant`, { decalName, variantName });
    return result;
  } catch (error) {
    console.error(`Failed to remove ${elementType} decal variant:`, error);
    return {
      success: false,
      error: `Failed to invoke command: ${error}`
    };
  }
};