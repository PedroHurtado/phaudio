import { Silero } from "./silero.js";
import { FrameProcessor } from "./frameprocesor.js";
import { Message } from "@audiorecorder/common";
import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm";
import { createMessage } from "./createMessage.js";
import { sendData } from "./sendData.js";

let silero;
let options;
let frameProcesor;
let sessionRoom;
let diff;
let start;

self.onmessage = async ({ data }) => {
  const { type } = data;
  if (type === "start") {
    ort.env.wasm = data.ort.wasm;
    options = data.options;
    sessionRoom = data.sessionRoom;
    diff = data.diff;
    try {
      silero = await run(data.ort.model);
      frameProcesor = getProcesor();
      self.postMessage("OK");
    } catch (err) {
      console.log(err);
    }
  } else if (type === "frame") {
    const { frame } = data;
    try {
      const result = await frameProcesor.process(frame);
      const { msg, audio } = result;
      if (msg === Message.SpeechStart) {
        start = Date.now();
      } else if (msg === Message.SpeechEnd) {
        const serverData = createMessage(audio,{sessionRoom,start,start: start + diff})
        const transcription = await sendData('http://localhost:3000/upload',serverData)
        self.postMessage({ msg, serverData, transcription });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

async function run(model_url) {
  const response = await fetch(model_url);
  const model = await response.arrayBuffer();
  const silero = new Silero(ort, model);
  await silero.init();
  return silero;
}

function getProcesor() {
  const frameProcesor = new FrameProcessor(silero, options);
  frameProcesor.resume();
  return frameProcesor;
}