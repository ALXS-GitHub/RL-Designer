import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';

interface FetchResult {
  success: boolean;
  decals: DecalTextures[];
  error?: string;
}

export const getDecalFolders = async (): Promise<FetchResult> => {
  try {
    const result = await invoke<FetchResult>('get_decal_texture_folders');
    return result;
  } catch (error) {
    console.error('Failed to fetch decal folders:', error);
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

export const removeDecalVariant = async (decalName: string, variantName: string): Promise<RemoveResult> => {
  try {
    const result = await invoke<RemoveResult>('remove_decal_variant', { decalName, variantName });
    return result;
  } catch (error) {
    console.error('Failed to remove decal variant:', error);
    return {
      success: false,
      error: `Failed to invoke command: ${error}`
    };
  }
};