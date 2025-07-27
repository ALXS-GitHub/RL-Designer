import { convertFileSrc } from "@tauri-apps/api/core";

export const resolveImagePath = (path: string, defaultMethod: 'convert' | 'copy' = 'convert') => {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path; // Return external URLs as is
    }

    return defaultMethod === 'convert' ? convertFileSrc(path) : path;
};