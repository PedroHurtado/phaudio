import { Context } from "./context.js";
import { Message } from "../common/message.js";
import { deserialize, serialize } from "./serializer.js";
import wavfile from "./wavfile.js";
const defaultOptions = {
  options: {},
  url_worker_audio: "worker_audio/procesor.js",
  url_procesor: "",
  silero: {
    url: "worker_silero/worker.js",
    ort: {
      wasm: {
        numThreads: 1,
        wasmPaths: "wasm/",
      },
      model: "model.onnx",
      //model:'https://www.vad.ricky0123.com/silero_vad.onnx'
      //model:'silero_vad.onnx'
    },
  },
  recorder_options: {
    mimeType: "audio/webm",
    //mimeType: "audio/mp4",
    audioBitsPerSecond: 8000,
  },
};
/*const createContext = (audio) => {
  

  const audioContext = new AudioContext();
  const buffer = audioContext.createBuffer(1, audio.length, 16000);
  buffer.copyToChannel(audio, 0);
  const bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = buffer;

  const destination = audioContext.createMediaStreamDestination();
  bufferSource.connect(destination);
  
  const mediaStream = destination.stream;
  const mediaRecorder = new MediaRecorder(
    mediaStream,
    defaultOptions.recorder_options
  );
  bufferSource.start();
  mediaRecorder.start();
  const start = performance.now();
  mediaRecorder.ondataavailable = async ({ data }) => {
    const end = performance.now();
    console.log(
      `start: ${start} end: ${end}, diference:${(end - start) / 1000}`
    );
    console.log(data.size);
    if (data.size > 0) {
      const array = await data.arrayBuffer();
      const url = URL.createObjectURL(data);
      const bytes = serialize({}, new Uint8Array(array));
      AudioRecorder.env.socket.send(bytes);
      AudioRecorder.env.socket.onmessage = async ({ data }) => {
        const array = await data.arrayBuffer();
        const vtt = new TextDecoder().decode(array)
        console.log(vtt);
        
        const audio = document.createElement("audio");
        audio.setAttribute("controls", "");
        audio.src = url;
        const container = document.getElementById("container");
        container.appendChild(audio);
        const pre = document.createElement("pre");
        pre.textContent = vtt
        container.appendChild(pre);
      };      
    }
  };
  console.log(`buffer duration ${buffer.duration}`);
  setTimeout(() => {
    mediaRecorder.stop();
  }, buffer.duration * 1000);
};*/

const createContext = function (buffer,sessionRoom) {
  const start = performance.now();
  const arraybuffer = wavfile.getFile(buffer);
  const data = serialize(sessionRoom, new Int16Array(arraybuffer));
  const { json, file } = deserialize(data);
  console.log(json);
  const end = performance.now();
  console.log(`start:${start} end:${end} dif:${end - start}`);
  AudioRecorder.env.socket.send(data);

  const blob = new Blob([file.buffer], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  document.createElement("audio");
  const audio = document.createElement("audio");
  audio.setAttribute("controls", "");
  audio.src = url;
  const container = document.getElementById("container");
  container.appendChild(audio);
};

export class AudioRecorder {
  constructor(worker) {
    this.worker = worker;    
    this.worker.onmessage = async ({ data }) => {
      const { msg, audio, sessionRoom } = data;
      if (msg === Message.SpeechEnd) {
        createContext(audio,sessionRoom);
      }
    };
  }
  async start(stream) {
    await Context.new(stream, this.worker, this.sessionRoom);
  }
  static createSileroWorker() {
    return new Worker(AudioRecorder.env.silero.url, {
      type: "module",      
    });
  }
  static new(sessionRoom) {
    return new Promise((resolve, reject) => {
      const worker = AudioRecorder.createSileroWorker(sessionRoom);
      worker.postMessage({
        type: "start",
        ort: AudioRecorder.env.silero.ort,
        options: AudioRecorder.env.options,
        sessionRoom
      });
      worker.onmessage = async ({ data }) => {
        if (data === "OK") {          
          resolve(new AudioRecorder(worker));
        }
      };
    });
  }
  static get env() {
    return defaultOptions;
  }
}
