const jwt = require('jsonwebtoken');
const knex = require('../conexões/postgres');
const bcrypt = require('bcrypt'); 

const SECRET_KEY = process.env.JWT_SECRET;

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    try {
        const usuario = await knex('usuarios').where({ email }).first();

        if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email }, 
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ mensagem: "Login realizado com sucesso.", token });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao realizar login.", erro: error.message });
    }
};

module.exports = {
    loginUsuario
};
