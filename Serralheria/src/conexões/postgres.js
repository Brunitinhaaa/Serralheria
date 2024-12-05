const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASS),
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false, 
    },
  },
});
  
module.exports = knex;

