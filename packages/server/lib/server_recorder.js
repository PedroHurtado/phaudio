#!/usr/bin/env node
import { program } from "commander";
import { startServer } from "../src/serve.js";
program.option("-p, --port <port>", "Port number").action((options) => {
  startServer(options.port);
});

program.parse(process.argv);
