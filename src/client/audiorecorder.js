import { Context } from "./context.js";
import { fetcher_worker } from "./fetcher-worker.js";
import { Message } from "../common/message.js";
import { serialize } from "./serializer.js";
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

const createContext = function (buffer) {
  const start = performance.now();
  const arraybuffer = wavfile.getFile(buffer);
  const end = performance.now();

  console.log(`start:${start} end:${end} dif:${end-start}`)

  const blob = new Blob([arraybuffer], { type: "audio/wav" });
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
    this.contexts = new Map();
    this.worker = worker;
    this.worker.onmessage = async ({ data }) => {
      const { id, msg, audio } = data;
      const context = this.contexts.get(id);
      if (context.id === id) {
        if (msg === Message.SpeechStart) {
        } else if (msg === Message.SpeechEnd) {
          createContext(audio);
        }
      }
    };
  }
  async addSpeaker(speaKerId, stream) {
    if (!this.contexts.has(speaKerId)) {
      const context = await Context.new(speaKerId, stream, this.worker);
      this.contexts.set(speaKerId, context);
    }
  }
  removeSpeaker(speaKerId) {
    if (this.constexts.has(speaKerId)) {
      const context = this.constexts.get(speaKerId);
      //context stop
      this.contexts.delete(speaKerId);
    }
  }
  static createSileroWorker() {
    return new Worker(AudioRecorder.env.silero.url, {
      type: "module",
    });
  }
  static new() {
    return new Promise((resolve, reject) => {
      const worker = AudioRecorder.createSileroWorker();
      worker.postMessage({
        type: "start",
        ort: AudioRecorder.env.silero.ort,
        options: AudioRecorder.env.options,
      });
      worker.onmessage = async ({ data }) => {
        if (data === "OK") {
          AudioRecorder.env.url_procesor = await fetcher_worker();
          resolve(new AudioRecorder(worker));
        }
      };
    });
  }
  static get env() {
    return defaultOptions;
  }
}
