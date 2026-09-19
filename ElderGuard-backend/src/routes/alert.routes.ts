import { Router } from 'express';
import {
  getAlertsByElderly,
  getAlertById,
  sendManualAlert
} from '../controllers/alert.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// View alerts for an elderly person
router.get('/elderly/:elderlyId', getAlertsByElderly);
router.get('/:id', getAlertById);

// Send manual emergency alert
router.post('/', sendManualAlert);

export default router;
