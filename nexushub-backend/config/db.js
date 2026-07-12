const { Pool } = require('pg');
require('dotenv').config();

const isLocal = !process.env.DATABASE_URL || process.env.DB_HOST === 'localhost';

const pool = isLocal
  ? new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    })
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

module.exports = pool;