import { AudioRecorder } from "./audiorecorder.js";

export class Context {
  constructor(audioContext, procesor, worker, sessionRoom) {
    this.audioContext = audioContext;    
    this.procesor = procesor;    
    this.worker = worker;
    this.sessionRoom = sessionRoom
    this.procesor.port.onmessage = ({ data }) => {
      const frame = new Float32Array(data);      
      this.worker.postMessage({ type: "frame",  frame, sessionRoom:this.sessionRoom });
    };    
  }  
  static async createWorkletNode(audioContext) {
    await audioContext.audioWorklet.addModule(
      AudioRecorder.env.url_worker_audio
    );

    return new AudioWorkletNode(audioContext, "audio-processor", {
      processorOptions: {
        options: AudioRecorder.env.options,
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
    const context = new Context(audioContext, procesor, worker, sessionRoom);    
    return context;
  }
}
