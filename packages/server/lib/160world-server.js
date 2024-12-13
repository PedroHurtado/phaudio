#!/usr/bin/env node
import fs from "node:fs";
import dotenv from "dotenv";
import path from "node:path";
import { program } from "commander";
import { startServer } from "../src/serve.js";
program
  .option("-p, --port <port>", "Port number",3000)
  .option("--envFile <path>", "Path to the environment file", ".env")
  .action((options) => {
    readEnvFile(options)
    startServer(options.port);
  });

program.parse(process.argv);

function readEnvFile({envFile}){
  if (fs.existsSync(envFile)) {
    const envPath = path.resolve(envFile);
    dotenv.config({ path: envPath });    
  } else {
    console.error(`Environment file not found: ${envFile}`);
    process.exit(1);
  }
}
