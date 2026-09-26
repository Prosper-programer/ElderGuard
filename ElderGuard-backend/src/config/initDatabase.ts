import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import pool from './database';

/**
 * DATABASE INITIALIZATION SCRIPT
 * 
 * What this file does:
 * 1. Connects to MySQL using our connection pool.
 * 2. Reads the SQL statements from schema.sql.
 * 3. Creates all 11 tables matching the GUYNOVA GUARD UML class diagram.
 * 4. Seeds a default Admin user if none exists (with a securely hashed password).
 * 
 * Why we need it:
 * To set up or reset our relational database tables cleanly and automatically.
 */
export async function initializeDatabase() {
  console.log('🔄 Initializing GUYNOVA GUARD database tables...');

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    let sqlContent = fs.readFileSync(schemaPath, 'utf8');

    // Remove single-line comments (-- ...) and multi-line comments (/* ... */)
    sqlContent = sqlContent
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    // Split SQL by semicolon to execute statement by statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    const connection = await pool.getConnection();

    try {
      for (const statement of statements) {
        await connection.query(statement);
      }
      console.log('✅ All 11 tables created successfully matching UML class diagram!');

      // Check if a default Admin account exists, if not, create one
      const [adminRows]: any = await connection.query('SELECT * FROM admins WHERE email = ?', ['admin@GUYNOVA GUARD.com']);
      if (adminRows.length === 0) {
        const defaultAdminPassword = await bcrypt.hash('admin123456', 10);
        await connection.query(
          'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
          ['System Administrator', 'admin@GUYNOVA GUARD.com', defaultAdminPassword]
        );
        console.log('👤 Default Admin created: admin@GUYNOVA GUARD.com / admin123456');
      } else {
        console.log('👤 Admin account already exists.');
      }
    } finally {
      connection.release();
    }

    console.log('🎉 Database initialization complete!');
  } catch (error: any) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Run directly if called from command line: tsx src/config/initDatabase.ts
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

