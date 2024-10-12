import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import {transcribe} from './openai.js'
import { deserialize } from '../client/serializer.js';
//https://github.com/Microsoft/cognitive-services-speech-sdk-js
//https://github.com/Azure-Samples/AzureSpeechReactSample



// Inicializa la aplicación Express
const app = express();

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta de ejemplo para la solicitud HTTP en "/"
app.get('/', (req, res) => {
	res.senfile("index.html");
});

// Crea el servidor HTTP
const server = createServer(app);

// Configura el servidor WebSocket en la ruta "/ws"
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Maneja las conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Enviar un mensaje al cliente
  //ws.send('Conexión WebSocket establecida');

  // Escuchar mensajes del cliente
  ws.on('message', async (message) => {
    const {boject,binaryData} = deserialize(message)    
    const response = await transcribe(binaryData)    
    const encoder = new TextEncoder()    
    ws.send(encoder.encode(response),{binary:true})    
  });

  // Maneja la desconexión del cliente
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Escucha en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
