import { convertFileSrc } from "@tauri-apps/api/core";

export const resolveImagePath = (path: string, defaultMethod: 'convert' | 'copy' = 'convert', allowPublic: boolean = true) => {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path; // Return external URLs as is
    }

    if (path.startsWith('/') && allowPublic) {
        return path;
    }

    return defaultMethod === 'convert' ? convertFileSrc(path) : path;
};