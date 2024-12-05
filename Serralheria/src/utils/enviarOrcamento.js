const expressHandlebars = require('express-handlebars');
const path = require('path');
const knex = require('../conexões/postgres');
const sgMail = require('@sendgrid/mail');

// Configuração da API do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configuração do template de e-mail
const hbs = expressHandlebars.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: path.resolve(__dirname, 'views/template/'),
});

const enviarOrcamentoPorEmail = async (orcamentoId, usuarioId) => {
  try {
    // Busca o usuário pelo ID
    const usuario = await knex('usuarios').where('id', usuarioId).first();

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    console.log("Usuário encontrado:", usuario);

    // Verificação do e-mail
    if (typeof usuario.email !== 'string' || !usuario.email.includes('@')) {
      throw new Error('E-mail inválido.');
    }

    const orcamento = await knex('orcamentos')
      .where('id', orcamentoId)
      .andWhere('usuario_id', usuarioId)
      .first();

    if (!orcamento) {
      throw new Error('Orçamento não encontrado ou não pertence ao usuário.');
    }

    const dados = {
      tipo_servico: orcamento.tipo_servico,
      altura: orcamento.altura,
      largura: orcamento.largura,
      comprimento: orcamento.comprimento,
      material: orcamento.material,
      detalhes: orcamento.detalhes || 'Nenhum detalhe',
      preco_final: orcamento.preco_final,
      descricao: orcamento.descricao || 'Sem descrição fornecida',
    };

    // Renderiza o template de e-mail
    const html = await hbs.renderView('views/template.hbs', dados);

    // Configuração do e-mail
    const msg = {
      to: usuario.email,
      from: 'serralheriabandeirantessb@gmail.com',
      subject: 'Orçamento Calculado com Sucesso',
      html: html,
    };

    // Envia o e-mail
    const info = await sgMail.send(msg);
    console.log('E-mail enviado:', info[0].statusCode); // 202 indica sucesso
  } catch (err) { // Alterado de 'error' para 'err' (nome variável)
    console.error('Erro ao enviar o orçamento por e-mail:', err); // Exibe o erro completo no log
    throw err; // Repassa o erro para o controlador lidar
  }
};


module.exports = enviarOrcamentoPorEmail;
