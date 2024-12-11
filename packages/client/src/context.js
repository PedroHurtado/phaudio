import { config } from "./config";

export class Context {
  constructor(audioContext, procesor, worker) {
    this.audioContext = audioContext;    
    this.procesor = procesor;    
    this.worker = worker;    
    this.procesor.port.onmessage = ({ data }) => {
      const frame = new Float32Array(data);      
      this.worker.postMessage({ type: "frame",  frame});
    };    
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
  static async new(stream, worker, sessionRoom) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    
    const highPassFilter = audioContext.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = 400;    

    
    const procesor = await this.createWorkletNode(audioContext);  
    //source.connect(highPassFilter).connect(procesor);    
    source.connect(procesor)
    const context = new Context(audioContext, procesor, worker);    
    return context;
  }
}
