import { Router } from 'express';
import {
  getNotifications,
  consultNotification,
  markAsRead
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Authenticated users (Parent / Caregiver) can view and mark their notifications
router.get('/', getNotifications);
router.get('/:id', consultNotification);
router.patch('/:id/read', markAsRead);

export default router;
