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

export default [
  
  //serve
  {
    input: "./packages/server/lib/160world-server.js",

    output: {
      file: "./test/server/160world-server",
      format: "es",
      sourcemap: true
    },
    external: [        
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
    ],
  },
  //client 
  //workletNode
  {
    input: "./packages/worker_audio/src/procesor.js",
    output: {
      file: "./test/worker_audio/index.js",
      format: "iife",
      sourcemap: true
    },
    plugins: [del(), resolve(), commonjs()],
  },
  //worker silero
  {
    input: "./packages/worker_silero/src/worker.js",
    output: {
      file: "./test/worker_silero/index.js",
      format: "es",
      sourcemap: true
    },
    external: [      
      "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm"
    ],
    plugins: [
      del(),
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
      alias({
        entries: [
          {
            find: "@audiorecorder/common",
            replacement: path.resolve(__dirname, "packages/common"),
          },
        ],
      }),
      resolve(),
      commonjs(),     
    ],
  },
];
