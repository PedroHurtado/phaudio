import { AudioRecorder } from "./audiorecorder.js"
export async function login(session){
     const url = `${AudioRecorder.env.url_server}/login`
     const response = await fetch(url, {
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(session)
     })
     console.log(response)
}