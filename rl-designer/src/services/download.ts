import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';

interface DownloadResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const downloadDecalVariant = async (decalName: string, variantName: string): Promise<DownloadResponse> => {
  try {
    const result = await invoke<DownloadResponse>('download_decal_variant', { decalName, variantName });
    return result;
  } catch (error) {
    console.error('Failed to download decal variant:', error);
    return {
      success: false,
      message: '',
      error: `Failed to invoke command: ${error}`
    };
  }
};