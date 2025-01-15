import { Resampler } from "./resampler.js";
import { Emiter, Message } from '@audiorecorder/common'
class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.active = true;    
    const {targetSampleRate,targetFrameSize}=  options.processorOptions;
    this.resampler = new Resampler({
      nativeSampleRate: sampleRate,
      targetSampleRate,
      targetFrameSize,
    });
    this.emiter = new Emiter(this.port)
    this.emiter.on(Message.Close, () => {
      this.active = false;
    })
  }
  process(inputs) {
    if (this.active === false) {
      return false;
    }
    const input = inputs[0];
    const frames = this.resampler.process(input[0]);
    for (const frame of frames) {
      this.emiter.emit(Message.Frame, { frame: frame.buffer })

    }
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);

