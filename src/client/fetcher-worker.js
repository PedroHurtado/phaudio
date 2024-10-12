import { AudioRecorder } from "./audiorecorder.js";
export async function fetcher_worker(){
    const response = await fetch(AudioRecorder.env.url_worker_audio)
    const js = await response.text()
    const blob = new Blob([js], {type:'application/javascript'})
    return URL.createObjectURL(blob)
}