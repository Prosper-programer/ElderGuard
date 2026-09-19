import { Router } from 'express';
import { createClinicalNote, getClinicalNotesByElderly } from '../controllers/clinicalNote.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// List notes for an elderly profile (Parent, Caregiver, Doctor can view)
router.get('/elderly/:elderlyId', getClinicalNotesByElderly);

// Only Doctor can create clinical notes
router.post('/', authorize('doctor'), createClinicalNote);

export default router;
