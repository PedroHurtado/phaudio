import { Silero } from "./silero.js";
import { FrameProcessor } from "./frameprocesor.js";
import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm";


let silero;
let options;
let frameProcesor;
self.onmessage = async ({ data }) => {
  
  const { type } = data;
  if (type === "start") {
    ort.env.wasm = data.ort.wasm;
    options = data.options;
    try {
      silero = await run(data.ort.model);      
      frameProcesor = getProcesor()
      self.postMessage("OK");
    } catch (err) {
      console.log(err);
    }
  } else if (type === "frame") {
    const {frame, sessionRoom } = data;    
    try {      
      const result = await frameProcesor.process(frame);
      const { msg, audio } = result;
      if (msg) {
        console.log(`${msg}->${Date.now()}`);
        self.postMessage({msg, audio });
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
