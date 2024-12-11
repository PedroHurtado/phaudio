import { config } from "./config"

export async function getTimeServer() {
    let ttfb=0
    const url = `${config.url_server}/timer`
    const timerClient = Date.now()
    const response = await fetch(url, { method: "HEAD" })
    const timeServer = Number(response.headers.get('server-date'))
    const diff = timeServer - timerClient
    const entry = await waitForEntry(url)
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
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return null; // No se encontró la entrada
}
