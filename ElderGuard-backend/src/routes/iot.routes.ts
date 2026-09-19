import { Router } from 'express';
import {
  registerDevice,
  connectDevice,
  disconnectDevice,
  receiveDeviceData,
  getDevices
} from '../controllers/iot.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Device connection endpoints (used by IoT device hardware or test simulator)
router.post('/data', receiveDeviceData);
router.post('/:deviceId/connect', connectDevice);
router.post('/:deviceId/disconnect', disconnectDevice);

// Device management endpoints (used by Parent in the mobile app)
router.post('/register', authenticate, authorize('parent'), registerDevice);
router.get('/devices', authenticate, authorize('parent', 'caregiver'), getDevices);

export default router;
