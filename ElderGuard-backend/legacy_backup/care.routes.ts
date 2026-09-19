import { Router } from 'express';
import { CareController } from '../controllers/care.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createMedicationSchema, updateDoseStatusSchema } from '../utils/validators';

const router = Router();

// Medications
router.get('/medications', CareController.getMedications);
router.post('/medications', authenticate, validateBody(createMedicationSchema), CareController.createMedication);

// Doses
router.get('/doses/today', CareController.getTodayDoses);
router.patch('/doses/:id/status', authenticate, validateBody(updateDoseStatusSchema), CareController.updateDoseStatus);

// Activities
router.get('/activities', CareController.getActivities);
router.patch('/activities/:id/progress', authenticate, CareController.updateActivityProgress);

export default router;
