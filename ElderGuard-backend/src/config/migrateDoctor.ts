import pool from './database';
import bcrypt from 'bcrypt';

async function migrate() {
  console.log('🔄 Starting Doctor Phase 1 & 2 migration...');

  try {
    // 1. Modify users role enum to include 'doctor'
    await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('parent', 'caregiver', 'doctor') NOT NULL DEFAULT 'parent'");
    console.log('✅ users role enum updated to include doctor');

    // 2. Inspect elderly_profiles columns
    const [columns]: any = await pool.query('DESCRIBE elderly_profiles');
    const colNames = columns.map((c: any) => c.Field);

    if (!colNames.includes('doctor_id')) {
      await pool.query('ALTER TABLE elderly_profiles ADD COLUMN doctor_id INT NULL, ADD FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE SET NULL');
      console.log('✅ elderly_profiles.doctor_id added');
    }
    if (!colNames.includes('doctor_name')) {
      await pool.query('ALTER TABLE elderly_profiles ADD COLUMN doctor_name VARCHAR(100) NULL');
      console.log('✅ elderly_profiles.doctor_name added');
    }
    if (!colNames.includes('doctor_phone')) {
      await pool.query('ALTER TABLE elderly_profiles ADD COLUMN doctor_phone VARCHAR(50) NULL');
      console.log('✅ elderly_profiles.doctor_phone added');
    }
    if (!colNames.includes('doctor_specialty')) {
      await pool.query('ALTER TABLE elderly_profiles ADD COLUMN doctor_specialty VARCHAR(100) NULL');
      console.log('✅ elderly_profiles.doctor_specialty added');
    }
    if (!colNames.includes('doctor_hospital')) {
      await pool.query('ALTER TABLE elderly_profiles ADD COLUMN doctor_hospital VARCHAR(150) NULL');
      console.log('✅ elderly_profiles.doctor_hospital added');
    }
    if (!colNames.includes('doctor_email')) {
      await pool.query('ALTER TABLE elderly_profiles ADD COLUMN doctor_email VARCHAR(150) NULL');
      console.log('✅ elderly_profiles.doctor_email added');
    }

    // 3. Create clinical_notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clinical_notes (
        note_id INT AUTO_INCREMENT PRIMARY KEY,
        elderly_id INT NOT NULL,
        doctor_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        note_content TEXT NOT NULL,
        recommendations TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (elderly_id) REFERENCES elderly_profiles(elderly_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ clinical_notes table created or verified');

    // 4. Seed demo doctor if not present
    const [docRows]: any = await pool.query('SELECT user_id FROM users WHERE email = ?', ['doctor@GUYNOVA GUARD.com']);
    let docId = 0;
    if (docRows.length === 0) {
      const hashed = await bcrypt.hash('password123', 10);
      const [ins]: any = await pool.query(
        'INSERT INTO users (full_name, email, phone_number, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Dr. James Hargreaves', 'doctor@GUYNOVA GUARD.com', '+44 20 7946 0000', hashed, 'doctor', 'active']
      );
      docId = ins.insertId;
      console.log('👤 Seeded demo doctor: doctor@GUYNOVA GUARD.com (ID: ' + docId + ')');
    } else {
      docId = docRows[0].user_id;
      console.log('👤 Demo doctor exists (ID: ' + docId + ')');
    }

    // 5. Update existing elderly profiles with doctor info
    await pool.query(`
      UPDATE elderly_profiles 
      SET doctor_id = ?, 
          doctor_name = 'Dr. James Hargreaves',
          doctor_phone = '+44 20 7946 0000',
          doctor_specialty = 'Geriatric Medicine',
          doctor_hospital = 'St. Thomas\\' Hospital, London',
          doctor_email = 'doctor@GUYNOVA GUARD.com'
      WHERE doctor_name IS NULL OR doctor_id IS NULL
    `, [docId]);
    console.log('✅ Assigned default doctor to existing elderly profiles');

    console.log('🎉 Doctor migration completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();

