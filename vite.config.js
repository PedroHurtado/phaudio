import { defineConfig } from 'vite';

export default defineConfig({   
    resolve: {
        alias: {                 
            '@audiorecorder/client': new URL('./packages/client', import.meta.url).pathname,      
            '@audiorecorder/common': new URL('./packages/common', import.meta.url).pathname,      
        }
    },
    server: {
        hmr: true, // Activa Hot Module Replacement
        open: true, // Abre automáticamente en el navegador
    },

});