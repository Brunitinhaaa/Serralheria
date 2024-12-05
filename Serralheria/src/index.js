require('dotenv').config()

const express = require('express')
const rotas = require('./rotas')
const knex = require('./conexões/postgres');

const app = express()

app.use(express.json())
app.use(rotas)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
