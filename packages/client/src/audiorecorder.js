import { Context } from "./context.js";
import { Message,deserialize } from "@audiorecorder/common";
import { config } from "./config.js";



const createContext = function (data, transcription) {   
  
  const { file } = deserialize(data); 
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
    return new Worker(config.silero.url, {
      type: "module",      
    });
  }
  static new(sessionRoom,diff) {
    return new Promise((resolve, reject) => {
      const worker = AudioRecorder.createSileroWorker(sessionRoom);
      worker.postMessage({
        type: "start",
        ort: config.silero.ort,
        options: config.options,
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
