import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({   
    resolve: {
        alias: {            
            '@audiorecorder/common': path.resolve(__dirname, 'path/to/your/common')
        }
    },
    server: {
        hmr: true, // Activa Hot Module Replacement
        open: true, // Abre automáticamente en el navegador
    },
});