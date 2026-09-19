import { Router } from 'express';
import {
  createReminder,
  getRemindersByElderly,
  updateReminder,
  deleteReminder
} from '../controllers/reminder.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// View reminders (Parent and Caregiver)
router.get('/elderly/:elderlyId', authorize('parent', 'caregiver'), getRemindersByElderly);

// Manage reminders (Parent only)
router.post('/', authorize('parent'), createReminder);
router.put('/:id', authorize('parent'), updateReminder);
router.delete('/:id', authorize('parent'), deleteReminder);

export default router;
