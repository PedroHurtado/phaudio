import express from "express";
import { createServer } from "http";
import { transcribe } from "./openai.js";
import { deserialize } from "../client/serializer.js";
import { convertVTTToMilliseconds } from "./vtt.js";
import cors from "cors";
import { validate, transcript } from "./160world.js";
import { getJwt } from "./jwt.js";

const corsOptions = {
  origin: "*",
  methods: ["POST", "HEAD"],
  exposedHeaders: ["server-date"],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());




app.head("/timer", (req, res) => {
  const date = Date.now();
  res.set("server-date", date);
  res.set("Timing-Allow-Origin", "*");
  res.end();
});

function autorization() {
  return function (req, res, next) {
    next();
  };
}

app.post("/login", async (req, res) => {
  const session = req.body;
  const result = await validate(session);
  if (result) {
    res.json(getJwt(session));
  } else {
    res.status(500).send("session no valida");
  }
});

app.post("/upload", autorization(), async (req, res) => {
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

// Crea el servidor HTTP
const server = createServer(app);


// Escucha en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
