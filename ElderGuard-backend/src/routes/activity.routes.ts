import { Router } from 'express';
import {
  createActivity,
  getActivitiesByElderly,
  getActivityStatistics,
  recordActivity,
  updateActivity,
  deleteActivity
} from '../controllers/activity.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// View activities and statistics (Parent and Caregiver)
router.get('/elderly/:elderlyId', authorize('parent', 'caregiver'), getActivitiesByElderly);
router.get('/statistics/:elderlyId', authorize('parent', 'caregiver'), getActivityStatistics);

// Record/mark completion (Parent and Caregiver)
router.patch('/:id/record', authorize('parent', 'caregiver'), recordActivity);

// Create, update, delete activities (Parent only)
router.post('/', authorize('parent'), createActivity);
router.put('/:id', authorize('parent'), updateActivity);
router.delete('/:id', authorize('parent'), deleteActivity);

export default router;
