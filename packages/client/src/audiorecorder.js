import { Context } from "./context.js";
import { Message,deserialize } from "@audiorecorder/common";

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

const createContext = function (data, transcription) {  
 
  //create audio
  const { file } = deserialize(data);
  AudioRecorder.env.socket.send(data);
  const blob = new Blob([file.buffer], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  document.createElement("audio");
  const audio = document.createElement("audio");
  audio.setAttribute("controls", "");
  audio.src = url;
  const container = document.getElementById("container");
  const pre= document.createElement('pre')
  pre.textContent = JSON.stringify(transcription);  
  container.appendChild(audio);
  container.appendChild(pre)
};

export class AudioRecorder {
  constructor(worker) {
    this.worker = worker;    
    this.worker.onmessage = async ({ data }) => {
      const { msg, serverData, transcription } = data;
      if (msg === Message.SpeechEnd) {
        createContext(serverData,transcription);
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
  static new(sessionRoom,diff) {
    return new Promise((resolve, reject) => {
      const worker = AudioRecorder.createSileroWorker(sessionRoom);
      worker.postMessage({
        type: "start",
        ort: AudioRecorder.env.silero.ort,
        options: AudioRecorder.env.options,
        sessionRoom,
        diff
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
