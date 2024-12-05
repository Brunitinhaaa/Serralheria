const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const autenticarUsuario = (req, res, next) => {
    const token = req.headers?.authorization?.startsWith('Bearer ') 
        ? req.headers.authorization.replace('Bearer ', '') 
        : null;

        console.log("Token recebido:", token); // Verifique o que está sendo recebido


    if (!token) {
        return res.status(401).json({ mensagem: "Token não fornecido ou inválido." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded;  
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado." });
    }
};

module.exports = autenticarUsuario;
