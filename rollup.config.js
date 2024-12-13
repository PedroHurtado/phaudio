import path from "path";
import { fileURLToPath } from "url";
import del from "rollup-plugin-del";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  //common
  {
    input: "./packages/common/index.js",
    output: {
      file: "./packages/common/dist/index.esm.js",
      format: "es",
    },
    plugins: [del()],
  },
  //serve
  {
    input: "./packages/server/lib/160world-server.js",

    output: {
      file: "./packages/server/dist/160world-server",
      format: "es",
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
      file: "./packages/client/dist/index.esm.js",
      format: "es",
    },
    external: ["@audiorecorder/common"],
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
      file: "./packages/worker_audio/dist/index.js",
      format: "iife",
    },
    plugins: [del(), resolve(), commonjs()],
  },
  //worker silero
  {
    input: "./packages/worker_silero/src/worker.js",
    output: {
      file: "./packages/worker_silero/dist/index.esm.js",
      format: "es",
    },
    external: ["https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm"],
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
      visualizer({ filename: "stats.html" }),
    ],
  },
];
