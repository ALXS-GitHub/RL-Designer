import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 9568,
    },
    resolve: {
        alias: {
            "@": "/src",
            "@docs": path.resolve(__dirname, "../docs"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "@/styles/custom-variables.scss" as *;',
            },
        },
    },
    assetsInclude: [
        "**/*.md",
        "**/*.svg",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.gif",
        "**/*.vert",
        "**/*.frag",
    ],
});
