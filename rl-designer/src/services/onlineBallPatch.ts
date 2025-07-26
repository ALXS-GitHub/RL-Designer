import { invoke } from '@tauri-apps/api/core';

interface InstallBallPatchResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const installBallPatch = async (): Promise<InstallBallPatchResponse> => {
  try {
    const result = await invoke<InstallBallPatchResponse>('install_ball_patch');
    return result;
  } catch (error) {
    console.error('Failed to install ball patch:', error);
    return {
      success: false,
      message: '',
      error: `Failed to invoke command: ${error}`
    };
  }
};