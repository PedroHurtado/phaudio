import path from "path";
import { fileURLToPath } from "url";
import del from "rollup-plugin-del";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default [
  {
    input: "./packages/common/index.js",
    output: {
      file: "./packages/common/build/index.esm.js",
      format: "es",
    },
    plugins: [del()],
  },
  {
    input: "./packages/server/src/serve.js",
    output: {
      file: "./packages/server/build/server.esm.js",
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
      json(),
      resolve(),
      commonjs(),
    ],
  },
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

  {
    input: "./packages/worker_silero/src/worker.js",
    output: {
      file: "./packages/worker_silero/build/index.esm.js",
      format: "es",
    },
    external:["https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm"],
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
      copy({
        targets:[
          {src:"./packages/worker_silero/**/*.onmx", dest:"./packages/worker_silero/build"},          
        ]
      })    
    ],
  },
];
