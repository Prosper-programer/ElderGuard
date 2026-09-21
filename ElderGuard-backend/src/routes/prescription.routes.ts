import { Router } from 'express';
import {
  createPrescription,
  getPrescriptionsByElderly,
  administerPrescription,
  updatePrescriptionStatus,
} from '../controllers/prescription.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// List prescriptions for an elderly person (Doctor, Parent, Caregiver can view)
router.get('/elderly/:elderlyId', getPrescriptionsByElderly);

// Only Doctor can create clinical prescriptions
router.post('/', authorize('doctor'), createPrescription);

// Caregiver (or Parent) clicks "Done" after administering medication
router.patch('/:id/administer', authorize('caregiver', 'parent'), administerPrescription);

// Update status (e.g. discontinue or complete)
router.patch('/:id/status', authorize('doctor', 'parent'), updatePrescriptionStatus);

export default router;
