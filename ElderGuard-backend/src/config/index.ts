import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'elderguard_jwt_super_secret_key_2026_dev_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  
  // Biometric Thresholds
  thresholds: {
    fallGForce: 3.0,
    tachycardiaBpm: 115,
    bradycardiaBpm: 50,
    hypoxemiaSpo2: 92,
    feverTempC: 38.0,
    hypothermiaTempC: 35.5,
    lowBatteryPct: 20,
  },
};
