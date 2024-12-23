import express from "express";
import cors from "cors";
import { getJwt } from "./jwt.js";

import { createServer } from "http";
import { transcribe } from "./openai.js";
import { deserialize } from "@audiorecorder/common";
import { convertVTTToMilliseconds } from "./vtt.js";
import { validate, transcript } from "./160world.js";
import {authorization} from './authorization.js'
const corsOptions = {
  origin: "*",
  methods: ["POST", "HEAD"],
  exposedHeaders: ["server-date"],  
  maxAge:3600
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.head("/timer", (req, res) => {
  const date = Date.now();
  res.set("server-date", date);
  res.set("Timing-Allow-Origin", "*");
  res.status(204).send();
});



app.post("/login", async (req, res) => {
  const session = req.body;
  const result = await validate(session);
  if (result) {
    res.json(getJwt(session));
  } else {
    res.status(500).send("session no valida");
  }
});

app.post("/upload", authorization(), async (req, res) => {
  let chunks = [];
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    try {
      const buffer = Buffer.concat(chunks);
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );

      const { json, file } = deserialize(arrayBuffer);
      const response = convertVTTToMilliseconds(
        await transcribe(file),
        json.start
      );
      await transcript(json, response);
      res.json(response);
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      res.status(500).send("Error procesando los datos");
    }
  });

  req.on("error", (err) => {
    console.error("Error en la solicitud:", err);
    res.status(500).send("Error en el flujo de datos");
  });
});

export function startServer(port) {
  const PORT = port || 3000;
  // Crea el servidor HTTP
  const server = createServer(app); 
 
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}
