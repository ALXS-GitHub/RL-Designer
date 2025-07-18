import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';

interface GitHubDecalsResponse {
    success: boolean;
    decals: DecalTextures[];
    error?: string;
}

export const getDecalsFromGitHub = async (): Promise<GitHubDecalsResponse> => {
    try {
        const result = await invoke<GitHubDecalsResponse>('get_decals_from_github');
        return result;
    } catch (error) {
        console.error('Failed to fetch decals from GitHub:', error);
        return {
            success: false,
            decals: [],
            error: `Failed to invoke command: ${error}`
        };
    }
};