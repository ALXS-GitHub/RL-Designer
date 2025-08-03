import axios from 'axios';

export const existsInPublic = async (path: string): Promise<boolean> => {
    // TODO : to fix and make compatible for prod app
    if (!path) return false;
    return true;
    // try {
    //     const response = await axios.get(path);
        
    //     if (!response || !response.data) {
    //         return false;
    //     }

    //     const contentType = response.headers['content-type'] || '';

    //     if (contentType.includes('text/html')) {
    //         return false;
    //     }

    //     return true;
    // } catch {
    //     return false;
    // }
};