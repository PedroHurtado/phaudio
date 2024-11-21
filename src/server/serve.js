import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import {transcribe} from './openai.js'
import { deserialize } from '../client/serializer.js';
import { convertVTTToMilliseconds } from './vtt.js';
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

app.head('/timer', (req,res)=>{
  res.set('Server-Date', Date.now());
  res.end();
})

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
    const arrayBuffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength);
    const {json,file} = deserialize(arrayBuffer)    
    const response = convertVTTToMilliseconds(await transcribe(file))    
    const encoder = new TextEncoder()    
    ws.send(encoder.encode(JSON.stringify(response)),{binary:true})    
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
