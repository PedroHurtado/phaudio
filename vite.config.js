import { defineConfig } from 'vite';

import path from "path";
import { fileURLToPath } from "url";
import del from "rollup-plugin-del";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    build: {
        rollupOptions: {
            input: {
                server: "./packages/server/lib/160world-server.js",
                workerAudio: "./packages/worker_audio/src/procesor.js",
                workerSilero: "./packages/worker_silero/src/worker.js",
            },
            output: [
                {
                    file: "./packages/server/dist/160world-server.js",
                    format: "es",
                    sourcemap: true,
                },
                {
                    file: "./test/worker_audio/index.js",
                    format: "iife",
                    sourcemap: true,
                },
                {
                    file: "./test/worker_silero/index.js",
                    format: "es",
                    sourcemap: true,
                },
            ],
            external: [
                "express",
                "cors",
                "jsonwebtoken",
                "commander",
                "dotenv",
                "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm",
            ],
            plugins: [
                del(),
                alias({
                    entries: [
                        {
                            find: "@audiorecorder/common",
                            replacement: path.resolve(__dirname, "packages/common"),
                        },
                    ],
                }),
                json(),
                resolve(),
                commonjs(),
                copy({
                    hook: "writeBundle",
                    targets: [
                        {
                            src: "packages/worker_silero/src/*.onnx",
                            dest: "test/worker_silero",
                        },
                        {
                            src: "packages/worker_silero/src/wasm/*.*",
                            dest: "test/worker_silero/wasm",
                        },
                    ],
                }),
            ],
        },
    }

});