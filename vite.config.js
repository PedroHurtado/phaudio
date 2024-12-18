import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@audiorecorder/client': new URL('./packages/client', import.meta.url).pathname,
            '@audiorecorder/common': new URL('./packages/common', import.meta.url).pathname,
        }
    },
    build: {
        rollupOptions: {
            external: ['@audiorecorder/common'], // Especifica que la dependencia común es externa
        },
    },
    server: {
        port:8080,
        hmr: true, // Activa Hot Module Replacement        
        open: '/1501/LJ9AWz7eak7kPNMd/6196030e666c49c5c23613ea6c340d220b8cefd65f4235e9c36c28be3144f425'
    },

});