export const config = {
  options : {
    positiveSpeechThreshold: 0.5,
    negativeSpeechThreshold: 0.5 - 0.15,
    preSpeechPadFrames: 1,
    redemptionFrames: 8,
    frameSamples: 1536,
    minSpeechFrames: 3,
    submitUserSpeechOnPause: false,
  },
  processorOptions: {
    targetSampleRate: 16000,
    targetFrameSize: 1536,
  },
  url_worker_audio: "worker_audio/procesor.js",
  url_procesor: "",
  silero: {
    url: "worker_silero/index.js",
    ort: {
      wasm: {
        numThreads: 1,
        wasmPaths: "wasm/",
      },
      model: "model.onnx",
    },
  },
  recorder_options: {
    mimeType: "audio/webm",
    audioBitsPerSecond: 8000,
  },
};