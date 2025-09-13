import mysql from 'mysql2/promise';
import envConfig from './env.config';

const pool = mysql.createPool({
  host: envConfig.dbHost,
  user: envConfig.dbUser,
  password: envConfig.dbPassword,
  database: envConfig.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
