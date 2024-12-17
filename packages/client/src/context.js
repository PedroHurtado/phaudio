import { config } from "./config";
import { Emiter, Message } from "@audiorecorder/common";


export class Context {
  constructor(audioContext, procesor, worker, workerEmiter) {
    this.audioContext = audioContext;    
    this.procesor = procesor;    
    this.worker = worker;   
    this.emiter = new Emiter(this.procesor.port);
    this.workerEmiter = workerEmiter;

    this.emiter.on(Message.Frame, (data)=>{
      const frame = new Float32Array(data);      
      this.workerEmiter.emit(Message.Frame, {frame})
    })    
  }  
  static async createWorkletNode(audioContext) {
    await audioContext.audioWorklet.addModule(
      config.url_worker_audio
    );

    return new AudioWorkletNode(audioContext, "audio-processor", {
      processorOptions: {
        options: config.options,
      },
    });
  }
  static async new(stream, worker, workerEmiter) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    
    const highPassFilter = audioContext.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = 400;    

    
    const procesor = await this.createWorkletNode(audioContext);  
    //source.connect(highPassFilter).connect(procesor);    
    source.connect(procesor)
    const context = new Context(audioContext, procesor, worker, workerEmiter);    
    return context;
  }
}
