export function getSession(url){
    const [peer_id,room_id,token] = new URL(url).pathname.split('/').splice(1);
    return {
        peer_id,
        room_id,
        token
    }
}