import jwt from 'jsonwebtoken'
export function authorization(){
    return function validate(req, res, next) {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token no proporcionado o formato incorrecto' });
        }
        
        const token = authHeader.split(' ')[1];    
        try {
            const decoded = jwt.verify(token, process.env.KEY);  
            req.user = decoded;  
            
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Token no válido', error: error.message });
        }
    }
    
}