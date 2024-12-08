export class Silero {
    constructor(ort, model) {
        this.ort = ort;
        this.model = model;
        this.init = async () => {            
            
            this._session = await this.ort.InferenceSession.create(this.model);
            this._sr = new this.ort.Tensor("int64", [16000n]);
            this.reset_state();
            
        };
        this.reset_state = () => {
            const zeroes = Array(2 * 64).fill(0);
            this._h = new this.ort.Tensor("float32", zeroes, [2, 1, 64]);
            this._c = new this.ort.Tensor("float32", zeroes, [2, 1, 64]);
        };
        this.process = async (audioFrame) => {
            const t = new this.ort.Tensor("float32", audioFrame, [1, audioFrame.length]);
            const inputs = {
                input: t,                
                sr:this._sr,
                h: this._h,
                c: this._c,
                sr: this._sr,
            };
            const out = await this._session.run(inputs);
            this._h = out.hn;
            this._c = out.cn;
            const [isSpeech] = out.output.data;
            const notSpeech = 1 - isSpeech;
            return { notSpeech, isSpeech };
        };
    }
}
