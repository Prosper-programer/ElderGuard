import { Router } from 'express';
import {
  updateLocation,
  getCurrentLocation,
  getLocationHistory,
  calculateDistance
} from '../controllers/location.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Update location from device or simulator
router.post('/', updateLocation);

// Helper calculation
router.post('/distance', calculateDistance);

// Protected routes for Parents & Caregivers to monitor
router.get('/current/:elderlyId', authenticate, getCurrentLocation);
router.get('/history/:elderlyId', authenticate, getLocationHistory);

export default router;
