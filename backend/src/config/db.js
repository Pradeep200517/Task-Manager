const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  database: process.env.PG_DATABASE || 'task_manager',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres'
});

pool.connect()
  .then(client => {
    client.release();
    console.log('Connected to PostgreSQL');
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL', err.message);
  });

module.exports = pool;

