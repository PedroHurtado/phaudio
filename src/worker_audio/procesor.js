class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.options = options.processorOptions;
    this.resampler = new Resampler({
      nativeSampleRate: sampleRate,
      targetSampleRate: 16000,
      targetFrameSize: 1536,
    });
  }

  process(inputs) {
    const input = inputs[0];
    //const output = outputs[0];

    const frames = this.resampler.process(input[0]);
    for (const frame of frames) {
      this.port.postMessage(frame.buffer);
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);

export class Resampler {
  constructor(options) {
    this.options = options;
    this.process = (audioFrame) => {
      const outputFrames = [];
      this.fillInputBuffer(audioFrame);
      while (this.hasEnoughDataForFrame()) {
        const outputFrame = this.generateOutputFrame();
        outputFrames.push(outputFrame);
      }
      return outputFrames;
    };

    this.inputBuffer = [];
  }
  fillInputBuffer(audioFrame) {
    for (const sample of audioFrame) {
      this.inputBuffer.push(sample);
    }
  }
  hasEnoughDataForFrame() {
    return (
      (this.inputBuffer.length * this.options.targetSampleRate) /
        this.options.nativeSampleRate >=
      this.options.targetFrameSize
    );
  }
  generateOutputFrame() {
    const outputFrame = new Float32Array(this.options.targetFrameSize);
    let outputIndex = 0;
    let inputIndex = 0;
    while (outputIndex < this.options.targetFrameSize) {
      let sum = 0;
      let num = 0;
      while (
        inputIndex <
        Math.min(
          this.inputBuffer.length,
          ((outputIndex + 1) * this.options.nativeSampleRate) /
            this.options.targetSampleRate
        )
      ) {
        const value = this.inputBuffer[inputIndex];
        if (value !== undefined) {
          sum += value;
          num++;
        }
        inputIndex++;
      }
      outputFrame[outputIndex] = sum / num;
      outputIndex++;
    }
    this.inputBuffer = this.inputBuffer.slice(inputIndex);
    return outputFrame;
  }
}