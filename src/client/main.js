import { AudioRecorder } from "./audiorecorder.js";
import { getSession } from "./getsession.js";
import { getTimeServer } from "./timeserver.js";
AudioRecorder.env.socket = new WebSocket("http://localhost:3000/ws");
//Solo a efectos de probar una getSesion, suprimir en produccion
AudioRecorder.env.urlRoom = 'https://wip.160worldmeet.net/1501/LJ9AWz7eak7kPNMd/6196030e666c49c5c23613ea6c340d220b8cefd65f4235e9c36c28be3144f425'
AudioRecorder.env.options = {
  positiveSpeechThreshold: 0.5,
  negativeSpeechThreshold: 0.5 - 0.15,
  preSpeechPadFrames: 1,
  redemptionFrames: 8,
  frameSamples: 1536,
  minSpeechFrames: 3,
  submitUserSpeechOnPause: false,
};
AudioRecorder.env.url_timer = 'http://localhost:3000/timer'

async function init(params) {
  const diff = await getTimeServer()
  const audioRecorder = await AudioRecorder.new(
    getSession(AudioRecorder.env.urlRoom || location.href),
    diff
  );
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
