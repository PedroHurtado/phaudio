import { AudioRecorder } from "./audiorecorder.js";
import { getSession } from "./getsession.js";
import { login } from "./login.js";
import { getTimeServer } from "./timeserver.js";
import { config } from "./config.js";

config.urlRoom = 'https://wip.160worldmeet.net/1501/LJ9AWz7eak7kPNMd/6196030e666c49c5c23613ea6c340d220b8cefd65f4235e9c36c28be3144f425'
config.options = {
  positiveSpeechThreshold: 0.5,
  negativeSpeechThreshold: 0.5 - 0.15,
  preSpeechPadFrames: 1,
  redemptionFrames: 8,
  frameSamples: 1536,
  minSpeechFrames: 3,
  submitUserSpeechOnPause: false,
};
config.url_server = 'http://localhost:3000'

async function init(params) {
  const session = getSession(config.urlRoom || location.href)
  const diff = await getTimeServer()  
  await login(session)
  const audioRecorder = await AudioRecorder.new(
    session,
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
export {init,config}

