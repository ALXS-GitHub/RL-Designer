import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures, VariantFrontInfo } from '@/types';
import type { ElementType } from '@/constants/elements';

interface DownloadResponse {
  success: boolean;
  message: string;
  variant_info?: VariantFrontInfo;
  error?: string;
}

interface DownloadDecalVariantParams {
  element: ElementType;
  decalName: string;
  variantName: string;
}

export const downloadDecalVariant = async ({element, decalName, variantName}: DownloadDecalVariantParams): Promise<DownloadResponse> => {
  try {
    const result = await invoke<DownloadResponse>(`download_element_decal_variant`, { element, decalName, variantName });
    return result;
  } catch (error) {
    console.error(`Failed to download ${element} decal variant:`, error);
    return {
      success: false,
      message: '',
      error: `Failed to invoke command: ${error}`
    };
  }
};