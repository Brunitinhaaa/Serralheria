const { loginUsuario } = require('../controladores/LogarUsuario');
const { adicionarUsuario } = require('../controladores/AdicionarUsuario');

const processarAcao = async (req, res, next) => {
    console.log('Corpo da requisição:', req.body); // Log o corpo da requisição
    const { acao } = req.body;
    console.log('Ação recebida:', acao); // Log a ação recebida

    try {
        if (acao === 'login') {
            console.log('Processando login...');
            return await loginUsuario(req, res);
        } else if (acao === 'novo') {
            console.log('Processando novo usuário...');
            return await adicionarUsuario(req, res); 
        } else {
            console.log('Ação inválida:', acao);
            return res.status(400).json({ mensagem: "Ação inválida. Use 'login' ou 'novo'." });
        }
    } catch (error) {
        console.error('Erro ao processar ação:', error); 
        next(error);  
    }
};


module.exports = processarAcao;

