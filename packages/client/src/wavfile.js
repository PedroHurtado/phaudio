function float32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));  // Limitar los valores entre -1 y 1
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;      // Escalar al rango de Int16 (-32768 a 32767)
    }
    
    return int16Array;
}
export class WavFile {    
    constructor() {
      
      this._sampleRate =16000;       
  
      this._channels =1
      
    }  
    getFile(buffer) {
        return this.getWavInt16Array(float32ToInt16(buffer))
    }
    getWavInt16Array(buffer) {
      const intBuffer = new Int16Array(buffer.length + 23); 
  
      intBuffer[0] = 0x4952; // "RI"
      intBuffer[1] = 0x4646; // "FF"
  
      intBuffer[2] = (2 * buffer.length + 15) & 0x0000ffff; // RIFF size
      intBuffer[3] = ((2 * buffer.length + 15) & 0xffff0000) >> 16; // RIFF size
  
      intBuffer[4] = 0x4157; // "WA"
      intBuffer[5] = 0x4556; // "VE"
  
      intBuffer[6] = 0x6d66; // "fm"
      intBuffer[7] = 0x2074; // "t "
  
      intBuffer[8] = 0x0012; // fmt chunksize: 18
      intBuffer[9] = 0x0000; //
  
      intBuffer[10] = 0x0001; // format tag : 1
      intBuffer[11] = this._channels; // channels: 2
  
      intBuffer[12] = this._sampleRate & 0x0000ffff; // sample per sec
      intBuffer[13] = (this._sampleRate & 0xffff0000) >> 16; // sample per sec
  
      intBuffer[14] = (2 * this._channels * this._sampleRate) & 0x0000ffff; // byte per sec
      intBuffer[15] =
        ((2 * this._channels * this._sampleRate) & 0xffff0000) >> 16; // byte per sec
  
      intBuffer[16] = 0x0004; // block align
      intBuffer[17] = 0x0010; // bit per sample
      intBuffer[18] = 0x0000; // cb size
      intBuffer[19] = 0x6164; // "da"
      intBuffer[20] = 0x6174; // "ta"
      intBuffer[21] = (2 * buffer.length) & 0x0000ffff; // data size[byte]
      intBuffer[22] = ((2 * buffer.length) & 0xffff0000) >> 16; // data size[byte]
  
      intBuffer.set(buffer,23)  
  
      return intBuffer.buffer;
    } 
  }
  
export default new WavFile();