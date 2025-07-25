import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';
import type { ElementType } from '@/constants/elements';

interface DownloadResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface DownloadDecalVariantParams {
  elementType: ElementType;
  decalName: string;
  variantName: string;
}

export const downloadDecalVariant = async ({elementType, decalName, variantName}: DownloadDecalVariantParams): Promise<DownloadResponse> => {
  try {
    const result = await invoke<DownloadResponse>(`download_${elementType}_decal_variant`, { decalName, variantName });
    return result;
  } catch (error) {
    console.error(`Failed to download ${elementType} decal variant:`, error);
    return {
      success: false,
      message: '',
      error: `Failed to invoke command: ${error}`
    };
  }
};