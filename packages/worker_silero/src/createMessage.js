
import wavFile, { serialize,  } from '@audiorecorder/common';
export function createMessage(audio,sessionRoom){
    const arraybuffer = wavFile.getFile(audio);
    return serialize(sessionRoom, new Int16Array(arraybuffer));    
}