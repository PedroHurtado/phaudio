import jwt from 'jsonwebtoken'
export function getJwt(session){
    const iat = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    const exp = iat + 3600;
    const {peer_id} = session
    const token = jwt.sign({
        sub:peer_id,
        iat,
        exp        
    },process.env.KEY, {algorithm:"HS256"})

    return {
        schema:'bearer',
        token,
        exp:3600
    }
}