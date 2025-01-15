import { resolve } from "@audiorecorder/common";
const URL = process.env.URL_SERVER
const credentials = btoa(`${process.env.API_USER}:${process.env.API_TOKEN}`)
function getUrl(session,path){
    const {peer_id,room_id,token} = session;
    return `${URL}/${peer_id}/${room_id}/${token}/${path}`
}

async function processResponse(response){
    const {status} = response
    if(status === 200){
        return true
    }
    return await resolve(response);
}

const headers={
    Authorization:`Basic ${credentials}`
}
export async function validate(session){    
    const url = getUrl(session,'validate')
    const response = await fetch(url,{
        method:'GET',
        headers:headers,        
    })
    return await processResponse(response)
    
}
export async function transcript({sessionRoom}, data) {
    const url = getUrl(sessionRoom, 'transcript')
    const response = await fetch(url,{
        method:'POST',
        headers:{...headers,... {'content-type':'aplicación/json'}},
        body:JSON.stringify(data)
    })       
    return await processResponse(response)
}