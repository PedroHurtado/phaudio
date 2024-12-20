import { Resampler } from "./resampler.js";
import {Emiter, Message} from '@audiorecorder/common'
class AudioProcessor extends AudioWorkletProcessor {  
  constructor(options) {
    super();
    this.options = options.processorOptions;
    this.resampler = new Resampler({
      nativeSampleRate: sampleRate,
      targetSampleRate: 16000,
      targetFrameSize: 1536,
    });
    this.emiter = new Emiter(this.port)
  }

  process(inputs) {
    const input = inputs[0];
    //const output = outputs[0];

    const frames = this.resampler.process(input[0]);
    for (const frame of frames) {
      this.emiter.emit(Message.Frame, {frame :frame.buffer})
      
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);

