import { AudioRecorder } from "./audiorecorder.js";

export async function getTimeServer() {
    let ttfb=0
    const timerClient = Date.now()
    const response = await fetch(AudioRecorder.env.url_timer, { method: "HEAD" })
    const timeServer = Number(response.headers.get('server-date'))
    const diff = timeServer - timerClient
    const entry = await waitForEntry(AudioRecorder.env.url_timer)
    if(entry){
        ttfb = entry.responseStart - entry.requestStart
    }
    return diff+ttfb
}

async function waitForEntry(url, retries = 5, interval = 100) {
    for (let i = 0; i < retries; i++) {
        const entry = performance.getEntriesByName(url, 'resource')[0];
        if (entry) {
            return entry;
        }
        // Espera antes de intentar de nuevo
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return null; // No se encontró la entrada
}
