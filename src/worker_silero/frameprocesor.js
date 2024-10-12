import { Message } from "./message.js";

function concatArray(audioBuffer) {
  console.log(audioBuffer.length * 1536);

  let firstSpeechIndex = audioBuffer.findIndex((item) => item.isSpeech);
  let lastSpeechIndex =
    audioBuffer.length -
    1 -
    audioBuffer
      .slice()
      .reverse()
      .findIndex((item) => item.isSpeech);

  if (firstSpeechIndex === -1 || lastSpeechIndex === -1) return Float32Array(0);

  const generator = function* () {
    yield* new Float32Array(1536);
    for (let i = firstSpeechIndex; i <= lastSpeechIndex; i++) {
      const { frame, isSpeech } = audioBuffer[i];
      if (isSpeech) {
        yield* frame;
      } else {
        yield* new Float32Array(128);
      }
    }
    yield* new Float32Array(1536);
  };

  const array = new Float32Array(generator());
  console.log(array.length);
  return array;
}

export class FrameProcessor {
  constructor(model, options) {
    this.model = model;
    this.options = options;
    this.speaking = false;
    this.redemptionCounter = 0;
    this.active = false;
    this.reset = () => {
      this.speaking = false;
      this.audioBuffer = [];
      this.model.reset_state();
      this.redemptionCounter = 0;
    };
    this.pause = () => {
      this.active = false;
      if (this.options.submitUserSpeechOnPause) {
        return this.endSegment();
      } else {
        this.reset();
        return {};
      }
    };
    this.resume = () => {
      this.active = true;
    };
    this.endSegment = () => {
      const audioBuffer = this.audioBuffer;
      this.audioBuffer = [];
      const speaking = this.speaking;
      this.reset();
      const speechFrameCount = audioBuffer.reduce((acc, item) => {
        return acc + +item.isSpeech;
      }, 0);
      if (speaking) {
        if (speechFrameCount >= this.options.minSpeechFrames) {
          return { msg: Message.SpeechEnd };
        } else {
          return { msg: Message.VADMisfire };
        }
      }
      return {};
    };
    this.process = async (frame) => {
      if (!this.active) {
        return {};
      }
      const probs = await this.model.process(frame);
      this.audioBuffer.push({
        frame,
        isSpeech: probs.isSpeech >= this.options.positiveSpeechThreshold,
      });
      if (
        probs.isSpeech >= this.options.positiveSpeechThreshold &&
        this.redemptionCounter
      ) {
        this.redemptionCounter = 0;
      }
      if (
        probs.isSpeech >= this.options.positiveSpeechThreshold &&
        !this.speaking
      ) {
        this.speaking = true;
        return { probs, msg: Message.SpeechStart };
      }
      if (
        probs.isSpeech < this.options.negativeSpeechThreshold &&
        this.speaking &&
        ++this.redemptionCounter >= this.options.redemptionFrames
      ) {
        this.redemptionCounter = 0;
        this.speaking = false;
        const audioBuffer = this.audioBuffer;
        this.audioBuffer = [];
        const speechFrameCount = audioBuffer.reduce((acc, item) => {
          return acc + +item.isSpeech;
        }, 0);
        if (speechFrameCount >= this.options.minSpeechFrames) {
          return {
            probs,
            msg: Message.SpeechEnd,
            audio: concatArray(audioBuffer),
          };
        } else {
          return { probs, msg: Message.VADMisfire };
        }
      }
      if (!this.speaking) {
        while (this.audioBuffer.length > this.options.preSpeechPadFrames) {
          this.audioBuffer.shift();
        }
      }
      return { probs };
    };
    this.audioBuffer = [];
    this.reset();
  }
}
