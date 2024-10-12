import { Silero } from "./silero.js";
import { FrameProcessor } from "./frameprocesor.js";
import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/+esm";

const procesors = new Map()
let silero;
let options;

//console.log(ort.env.wasm)

//ort.env.wasm.numThreads = 1;
//ort.env.wasm.wasmPaths = 'wasm/';

self.onmessage = async ({ data }) => {
  
  const { type } = data;
  if (type === "start") {
    ort.env.wasm = data.ort.wasm;
    options = data.options
    try {
      silero = await run(data.ort.model);      
      self.postMessage("OK");
    } catch (err) {
      console.log(err);
    }
  }
  else if (type==='frame'){
    const {id,frame} = data
    try{    
      const frameProcesor = getProcesor(id)  
      const result = await frameProcesor.process(frame) 
      const {msg,audio} = result
      if(msg){
        console.log(`${msg}->${Date.now()}`)
        self.postMessage({id,msg,audio})   
      }        
    }
    catch(err){
      console.log(err)
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

function getProcesor(id){
  if (procesors.has(id)){
    return procesors.get(id)
  }
  else {
    const frameProcesor = new FrameProcessor(silero, options) 
    frameProcesor.resume()
    procesors.set(id,frameProcesor)
    return frameProcesor
  }
}
