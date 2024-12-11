import { config } from "./config"
export async function login(session){
     const url = `${config.url_server}/login`
     const response = await fetch(url, {
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(session)
     })
     console.log(response)
}