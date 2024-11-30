const URL = process.env.URL_SERVER
const credentials = `${btoa(process.env.API_USER)}:${btoa(process.env.API_TOKEN)}`
function getUrl(session,path){
    const {peer_id,room_id,token} = session;
    return `${URL}/${peer_id}/${room_id}/${token}/${path}`
}

const headers={
        autorization:`basic ${credentials}`
}
export async function valiate(session){
    const url = getUrl(session,'validate')
    const response = await fetch(url,{
        method:'GET',
        headers:headers,        
    })
    return (response.status === 200)        
}
export async function transcript({sessionRoom}, data) {
    const url = getUrl(sessionRoom, 'transcript')
    const response = await fetch(url,{
        method:'POST',
        headers:{...headers,... {'content-type':'aplicación/json'}},
        body:JSON.stringify(data)
    })
    const text = await response.text()
    console.log(text)
}