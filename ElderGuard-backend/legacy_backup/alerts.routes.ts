import { Router } from 'express';
import { AlertsController } from '../controllers/alerts.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { acknowledgeAlertSchema, resolveAlertSchema } from '../utils/validators';

const router = Router();

router.get('/', AlertsController.getAlerts);
router.get('/:id', AlertsController.getAlertById);
router.post('/', authenticate, AlertsController.triggerAlert);
router.patch('/:id/acknowledge', authenticate, validateBody(acknowledgeAlertSchema), AlertsController.acknowledgeAlert);
router.post('/:id/resolve', authenticate, validateBody(resolveAlertSchema), AlertsController.resolveAlert);

export default router;
