import express from "express";
import cors from "cors";
import { getJwt } from "./jwt.js";
import { createServer } from "http";
import { transcribe } from "./openai.js";
import { deserialize, ErrorBase } from "@audiorecorder/common";
import { convertVTTToMilliseconds } from "./vtt.js";
import { validate, transcript } from "./160world.js";
import { authorization } from './authorization.js';

const corsOptions = {
  origin: "*",
  methods: ["POST", "HEAD"],
  exposedHeaders: ["server-date"],
  maxAge: 3600
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

const wrapAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const addRoute = (method, path, handler) => {
  app[method](path, wrapAsync(handler));
};

addRoute("post", "/login", async (req, res) => {  
  const session = req.body;
  const result = await validate(session);
  if (result) {
    res.json(getJwt(session));
  } else {
    res.status(500).send("session no valida");
  }
});

const aut=authorization();
const processUpload = async (req, res,next) => {
  aut(req,res,next)
  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve());
    req.on("error", err => reject(new ErrorBase(500, err.message)));
  });

  const buffer = Buffer.concat(chunks);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  const { json, file } = deserialize(arrayBuffer);
  const vttResponse = await transcribe(file);
  const response = convertVTTToMilliseconds(vttResponse, json.start);
  await transcript(json, response);

  res.json(response);
}


addRoute("post", "/upload", processUpload );

addRoute("head", "/timer", async (_, res) => {
  const date = Date.now();
  res.set("server-date", date);
  res.set("Timing-Allow-Origin", "*");
  res.status(204).end(); 
});

app.use((err, req, res, next) => {
  console.error('Error:', err);

  const error = {
    path: req.path,
    timestamp: new Date().toISOString(),
    status: err instanceof ErrorBase ? err.code : 500,
    message: err instanceof ErrorBase ? err.message : 'Error interno del servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.status).json(error);
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
  });
});

export function startServer(port) {
  const PORT = port || 3000;
  const server = createServer(app);

  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}
