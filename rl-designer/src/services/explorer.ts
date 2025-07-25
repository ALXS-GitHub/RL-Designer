import { invoke } from '@tauri-apps/api/core';
import type { DecalTextures } from '@/types';
import type { ElementType } from '@/constants/elements';

interface GitHubDecalsResponse {
    success: boolean;
    decals: DecalTextures[];
    error?: string;
}

export const getDecalsFromGitHub = async (element: ElementType): Promise<GitHubDecalsResponse> => {
    try {
        const result = await invoke<GitHubDecalsResponse>(`get_${element}_decals_from_github`);
        return result;
    } catch (error) {
        console.error(`Failed to fetch ${element} decals from GitHub:`, error);
        return {
            success: false,
            decals: [],
            error: `Failed to invoke command: ${error}`
        };
    }
};