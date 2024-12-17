export const config = {
    options: {},
    url_worker_audio: "worker_audio/procesor.js",
    url_procesor: "",
    silero: {
      url: "worker_silero/worker.js",
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
      //mimeType: "audio/mp4",
      audioBitsPerSecond: 8000,
    },
  };