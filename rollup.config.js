import path from "path";
import { fileURLToPath } from "url";
import del from "rollup-plugin-del";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  //common
  {
    input: "./packages/common/index.js",
    output: {
      file: "./packages/common/build/index.esm.js",
      format: "es",
    },
    plugins: [del()],
  },
  //serve
  {
    input: "./packages/server/src/serve.js",
    output: [
      {
        file: "./packages/server/build/serve.esm.js",
        format: "es",
      },
      {
        file: "./packages/server/build/serve.cjs.js",
        format: "cjs",
      }
    ],    
    external:["express","cors","jsonwebtoken","@audiorecorder/common"],
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
      file: "./packages/client/build/index.esm.js",
      format: "es",
    },
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
      resolve(),
      commonjs(),     
    ],
  },
  //workletNode
  {
    input: "./packages/worker_audio/src/procesor.js",
    output: {
      file: "./packages/worker_audio/build/index.js",
      format: "iife",
    },
    plugins: [
      del(),      
      resolve(),
      commonjs(),     
    ],
  },
  //worker silero
  {
    input: "./packages/worker_silero/src/worker.js",
    output: {
      file: "./packages/worker_silero/build/index.esm.js",
      format: "es",
    },
    external:["https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm"],
    plugins: [
      del(),
      copy({       
        hook:"writeBundle",
        targets: [
          {
            src: "packages/worker_silero/src/*.onnx",
            dest: "packages/worker_silero/build",
          },
          {
            src: "packages/worker_silero/src/wasm/*.*",
            dest: "packages/worker_silero/build/wasm",
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
      visualizer({ filename: 'stats.html' }),
    ],
  },
];
