import { convertFileSrc } from "@tauri-apps/api/core";
import axios from 'axios'

export const existsInPublic = async (path: string): Promise<boolean> => {
    // TODO : for now it is manually made but should be better made and more general
    // TODO : what if we need a real html file ?
    if (!path) return false;
    // return true;
    try {
        const response = await axios.get(path);
        
        if (!response || !response.data) {
            return false;
        }

        const contentType = response.headers['content-type'] || '';

        if (contentType.includes('text/html') && response.data.includes('<!doctype html>')) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
};

export const getBaseName = (filePath: string): string => {
    return filePath.replace(/^.*[\\/]/, "");
};

export const getFileExtension = (filePath: string): string => {
    return filePath.split('.').pop() || '';
};

export const decodeFileName = (encodedString: string): string => {
  try {
    return decodeURIComponent(encodedString);
  } catch (error) {
    console.warn('Failed to decode filename:', encodedString, error);
    return encodedString;
  }
};

export const resolvePath = (path: string, defaultMethod: 'convert' | 'copy' = 'convert', allowPublic: boolean = true) => {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path; // Return external URLs as is
    }

    if (path.startsWith('/') && allowPublic) {
        return path;
    }

    return defaultMethod === 'convert' ? convertFileSrc(path) : path;
};

export const getFileContent = async (path: string): Promise<any | null> => {
    if (!path) return null;

    try {
        const response = await axios.get(path);
        return response.data;
    } catch {
        return null;
    }
};