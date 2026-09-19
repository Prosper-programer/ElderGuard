import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * DATABASE CONNECTION POOL
 * 
 * What is a Connection Pool?
 * Instead of opening and closing a new database connection for every single HTTP request,
 * a connection pool maintains a cache of active database connections that can be reused.
 * This makes our backend much faster and prevents database connection overload.
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'elderguard',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
