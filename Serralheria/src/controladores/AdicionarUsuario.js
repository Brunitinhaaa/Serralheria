const knex = require('../conexões/postgres');
const bcrypt = require('bcrypt');  

const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
};

const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); 
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; 

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
};

const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
    // A senha deve ter:
    // - Pelo menos 8 caracteres
    // - Pelo menos 1 letra maiúscula
    // - Pelo menos 1 letra minúscula
    // - Pelo menos 1 número
    // - Pelo menos 1 caractere especial
    return regex.test(senha);
};

const adicionarUsuario = async (req, res) => {
    const { email, cpf, senha } = req.body;

    if (!email || !cpf || !senha) {
        return res.status(400).json({ mensagem: "Email, CPF e senha são obrigatórios." });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ mensagem: "O email informado não é válido." });
    }

    if (!validarCPF(cpf)) {
        return res.status(400).json({ mensagem: "O CPF informado não é válido." });
    }

    if (!validarSenha(senha)) {
        return res.status(400).json({
            mensagem: "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
        });
    }

    try {
        const senhaCriptografada = bcrypt.hashSync(senha, 10);

        const novoUsuario = await knex('usuarios').insert({ email, cpf, senha: senhaCriptografada }).returning('*');
        return res.status(201).json(novoUsuario[0]);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(400).json({ mensagem: "Email ou CPF já está em uso." });
        }
        return res.status(500).json({ mensagem: "Erro ao adicionar usuário.", erro: error.message });
    }
};

module.exports = {
    adicionarUsuario
};

