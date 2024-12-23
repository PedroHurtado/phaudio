import { AudioRecorder } from "./audiorecorder.js";
import { getSession } from "./getsession.js";
import { login } from "./login.js";
import { getTimeServer } from "./timeserver.js";
import { config } from "./config.js";
import {add, globalHandler, remove} from '@audiorecorder/common'

config.options = {
  positiveSpeechThreshold: 0.5,
  negativeSpeechThreshold: 0.5 - 0.15,
  preSpeechPadFrames: 1,
  redemptionFrames: 8,
  frameSamples: 1536,
  minSpeechFrames: 3,
  submitUserSpeechOnPause: false,
};
async function init() {
  const dispose = globalHandler(window);
  const session = getSession(location.href)
  const diff = await getTimeServer()  
  const user = await login(session) 

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
  add("user", user);
  return ()=>{
    remove("user");
    dispose();    
  }
}
export {init,config}

