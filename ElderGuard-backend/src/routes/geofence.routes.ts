import { Router } from 'express';
import {
  createGeofence,
  getGeofence,
  enableGeofence,
  disableGeofence,
  checkBoundary
} from '../controllers/geofence.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// View and check boundary (Parent and Caregiver)
router.get('/:elderlyId', authorize('parent', 'caregiver'), getGeofence);
router.post('/:elderlyId/check-boundary', authorize('parent', 'caregiver'), checkBoundary);

// Parent only: configure and enable/disable
router.post('/', authorize('parent'), createGeofence);
router.patch('/:elderlyId/enable', authorize('parent'), enableGeofence);
router.patch('/:elderlyId/disable', authorize('parent'), disableGeofence);

export default router;
