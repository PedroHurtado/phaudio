import { defineConfig } from 'vite';
import watchOutput from './scripts/vite_plugins/vite-plugin-watch-output'

export default defineConfig({
    resolve: {
        alias: {
            '@audiorecorder/client': new URL('./packages/client', import.meta.url).pathname,
            '@audiorecorder/common': new URL('./packages/common', import.meta.url).pathname,
        }
    },
    server: {
        port: 8080,
        hmr: true, // Activa Hot Module Replacement        
        open: '/1501/LJ9AWz7eak7kPNMd/6196030e666c49c5c23613ea6c340d220b8cefd65f4235e9c36c28be3144f425'
    },
    plugins: [
        watchOutput([
            "./test/worker_audio", 
            "./test/worker_silero", 
        ])
    ]

});