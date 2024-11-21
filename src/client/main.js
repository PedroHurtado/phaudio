import { AudioRecorder } from "./audiorecorder.js";

AudioRecorder.env.socket = new WebSocket("http://localhost:3000/ws");
AudioRecorder.env.options = {
  positiveSpeechThreshold: 0.5,
  negativeSpeechThreshold: 0.5 - 0.15,
  preSpeechPadFrames: 1,
  redemptionFrames: 8,
  frameSamples: 1536,
  minSpeechFrames: 3,
  submitUserSpeechOnPause: false,
};

async function init(params) {
  const audioRecorder = await AudioRecorder.new();
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      autoGainControl: true,
      noiseSuppression: true,
    },
    video: false,
  });  
  await audioRecorder.start(localStream); 
}
init();
