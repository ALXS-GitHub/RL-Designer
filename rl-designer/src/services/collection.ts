import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';
import type { ElementType } from '@/constants/elements';

interface FetchResult {
  success: boolean;
  decals: DecalTextures[];
  error?: string;
}

export const getDecalFolders = async (element: ElementType): Promise<FetchResult> => {
  try {
    const result = await invoke<FetchResult>(`get_element_decal_texture_folder`, { element });
    return result;
  } catch (error) {
    console.error(`Failed to fetch ${element} decal folders:`, error);
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
  element: ElementType;
  decalName: string;
  variantName: string;
}

export const removeDecalVariant = async ({element, decalName, variantName}: RemoveDecalVariantParams): Promise<RemoveResult> => {
  try {
    const result = await invoke<RemoveResult>(`remove_element_decal_variant`, { element, decalName, variantName });
    return result;
  } catch (error) {
    console.error(`Failed to remove ${element} decal variant:`, error);
    return {
      success: false,
      error: `Failed to invoke command: ${error}`
    };
  }
};