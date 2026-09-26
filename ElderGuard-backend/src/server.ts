import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, pool } from './config/database';

// Load environment variables from .env
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS allows requests from other domains/ports (like our mobile app or test tools)
app.use(cors());

// express.json() parses incoming JSON request bodies so we can access req.body
app.use(express.json());

// Import API Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import elderlyRoutes from './routes/elderly.routes';
import activityRoutes from './routes/activity.routes';
import reminderRoutes from './routes/reminder.routes';
import notificationRoutes from './routes/notification.routes';
import iotRoutes from './routes/iot.routes';
import alertRoutes from './routes/alert.routes';
import locationRoutes from './routes/location.routes';
import geofenceRoutes from './routes/geofence.routes';
import reportRoutes from './routes/report.routes';
import adminRoutes from './routes/admin.routes';
import clinicalNoteRoutes from './routes/clinicalNote.routes';
import prescriptionRoutes from './routes/prescription.routes';

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/elderly', elderlyRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clinical-notes', clinicalNoteRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

/**
 * Basic Root Health Check Route
 * GET /
 * Purpose: Allows anyone to verify that the Express backend server is alive and responding.
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'GUYNOVA GUARD Backend API is running',
    status: 'success'
  });
});

/**
 * Database Test Route
 * GET /api/test-db
 * Purpose: Verifies that our Node.js backend can successfully communicate with MySQL via Sequelize.
 */
app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    const [rows] = await sequelize.query('SELECT 1 + 1 AS result');
    
    res.status(200).json({
      message: 'Database connection successful (Sequelize ORM)',
      status: 'success',
      data: rows
    });
  } catch (error: any) {
    console.error('Database connection error:', error.message);
    res.status(500).json({
      message: 'Database connection failed',
      status: 'error',
      error: error.message
    });
  }
});

import http from 'http';
import { initSocket } from './config/socket';

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

// Start the HTTP and WebSocket server
server.listen(PORT, async () => {
  console.log(`=====================================================`);
  console.log(`  GUYNOVA GUARD Backend Server is running on:`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Database ORM: Sequelize (MySQL)`);
  console.log(`  WebSocket (Socket.io) real-time events enabled`);
  console.log(`=====================================================`);

  // Verify database connection at startup
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database successfully via Sequelize ORM!');
    const { Prescription } = await import('./models');
    await Prescription.sync();
  } catch (error: any) {
    console.error('❌ Failed to connect to MySQL database at startup:');
    console.error(error.message);
  }
});

export { app, server };
export default app;

