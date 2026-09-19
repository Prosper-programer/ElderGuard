import { Router } from 'express';
import { VitalsController } from '../controllers/vitals.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Note: Latest vitals and history can be queried with or without strict auth for device polling & mobile apps
router.get('/:id/vitals/latest', VitalsController.getLatest);
router.get('/:id/vitals/history', VitalsController.getHistory);

export default router;
