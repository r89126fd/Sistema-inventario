/**
 * Middleware para la verificacion de tokens JWT
 * Protege rutas restringidas al validar que se incluya un token valido
 */
const jwt = require('jsonwebtoken');

// Clave secreta para verificar y firmar tokens JWT
const SECRET_KEY = "my_secret_key";
/**
 * 
 * @param {object} req - objeto de solicitud de Express 
 * @param {*object} res - objeto de respuesta Express
 * @param {*function} next - funcion para continuar al siguiente middleware
 */
function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization']; // Extraer el encabezado de autorizacion

    if(!authHeader){
        return res.status(401).json({error: 'Acceso denegado. Se requiere un token'}); 
    }
    // Extraer el token del encabezado (formato: Bearer <token>)
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) =>{
        if(err){
            return res.status(401).json({error: 'Token invalido o expirado'});
        }
        req.user = user; // informacion del usuario al request
        next();
    });
}

module.exports = authMiddleware;