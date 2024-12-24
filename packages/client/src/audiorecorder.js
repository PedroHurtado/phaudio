import { Context } from "./context.js";
import { Message, deserialize } from "@audiorecorder/common";
import { config } from "./config.js";
import { Emiter } from "@audiorecorder/common";



const createContext = function (data, transcription) {

  const { file } = deserialize(data);
  const blob = new Blob([file.buffer], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  document.createElement("audio");
  const audio = document.createElement("audio");
  audio.setAttribute("controls", "");
  audio.src = url;
  const container = document.getElementById("container");
  const pre = document.createElement('pre')
  pre.textContent = JSON.stringify(transcription);
  container.appendChild(audio);
  container.appendChild(pre)
};

export class AudioRecorder {
  constructor(worker,emiter) {
    this.worker = worker;
    this.emiter = emiter;
    this.emiter.on(Message.SpeechEnd, (data)=>{
      const {serverData, transcription } = data;
      createContext(serverData, transcription);
    })    
  }
  async start(stream) {
     this.context = await Context.new(stream, this.worker, this.emiter );
  }
  stop() {    
    this.emiter.emit(Message.Stop, {});
    this.emiter.dispose();    
    this.context.dispose();
    this.emiter = null;
    this.context = null;
  }
  static createSileroWorker() {
    return new Worker(config.silero.url, {
      type: "module",
    });
  }
  static new(sessionRoom, diff) {
    return new Promise((resolve, reject) => {
      const worker = AudioRecorder.createSileroWorker(sessionRoom);
      const emiter = new Emiter(worker);

      emiter.emit(Message.Start, {
        ort: config.silero.ort,
        options: config.options,
        sessionRoom,
        diff,
        url_server:config.url_server
      })

      emiter.on(Message.Ok, async()=>{
        resolve(new AudioRecorder(worker,emiter));
      })            
      
    });
  }  
}
