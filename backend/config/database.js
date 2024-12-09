import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'team_board_user',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'team_collab_board',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 