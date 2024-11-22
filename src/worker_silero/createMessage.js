import wavFile from '../client/wavfile.js'
import { serialize } from '../client/serializer.js';
export function createMessage(audio,sessionRoom){
    const arraybuffer = wavFile.getFile(audio);
    return serialize(sessionRoom, new Int16Array(arraybuffer));    
}