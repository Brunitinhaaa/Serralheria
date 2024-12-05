const express = require('express');
const processarAcao = require('./middlewares/ProcessarAcao');
const autenticarUsuario = require('./middlewares/AutenticarUsuario');
const fazerOrcamento = require('./controladores/FazerOrcamento');

const rotas = express.Router();

rotas.post('/login', processarAcao);
rotas.post('/orcamento',autenticarUsuario,fazerOrcamento);

module.exports = rotas;
 