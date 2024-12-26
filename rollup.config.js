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
  //common
  {
    input: "./packages/common/index.js",
    output: {
      file: "./packages/common/dist/index.js",
      format: "es",
      sourcemap: true
    },
    plugins: [del()],
  },
  //serve
  {
    input: "./packages/server/lib/160world-server.js",

    output: {
      file: "./packages/server/dist/160world-server",
      format: "es",
      sourcemap: true
    },
    external: [
        "express", 
        "cors", 
        "jsonwebtoken", 
        "@audiorecorder/common",
        "commander",
        "dotenv",
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
  {
    input: "./packages/client/src/main.js",
    output: {
      file: "./packages/client/dist/index.js",
      format: "es",
      sourcemap: true
    }, 
    external:[
      "@audiorecorder/common"
    ],   
    plugins: [
      del(),
      copy({
        hook: "writeBundle",
        targets: [
          {
            src: "scripts/install-deps.js",
            dest: "packages/client/scripts",
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
  //workletNode
  {
    input: "./packages/worker_audio/src/procesor.js",
    output: {
      file: "./packages/worker_audio/dist/index.js",
      format: "iife",
      sourcemap: true
    },    
    plugins: [del(),
      copy({
        hook: "writeBundle",
        targets: [          
          {
            src: "scripts/copy.mjs",
            dest: "packages/worker_audio/scripts",
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
      commonjs()
    ],
  },
  //worker silero
  {
    input: "./packages/worker_silero/src/worker.js",
    output: {
      file: "./packages/worker_silero/dist/index.js",
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
            dest: "packages/worker_silero/dist",
          },
          {
            src: "packages/worker_silero/src/wasm/*.*",
            dest: "packages/worker_silero/dist/wasm",
          },
          {
            src: "scripts/copy.mjs",
            dest: "packages/worker_silero/scripts",
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
