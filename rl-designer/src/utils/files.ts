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