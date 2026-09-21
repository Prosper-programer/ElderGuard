import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * SEQUELIZE ORM INSTANCE
 * 
 * Provides object-relational mapping with intuitive models
 * (User.findAll, User.findOne, ElderlyProfile.create, etc.)
 */
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'elderguard',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false, // Keep console output clean
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false, // Schema manages created_at directly
      underscored: true,
      freezeTableName: true,
    },
  }
);

/**
 * Test database connectivity helper
 */
export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database via Sequelize:', error);
    return false;
  }
}

/**
 * Legacy/direct mysql2 connection pool fallback
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
