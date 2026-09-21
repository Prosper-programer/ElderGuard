import { Router } from 'express';
import {
  createElderlyProfile,
  getElderlyProfiles,
  getElderlyProfileById,
  updateElderlyProfile,
  deleteElderlyProfile
} from '../controllers/elderly.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All elderly profile operations require authentication
router.use(authenticate);

// 1. Parent, Caregiver, and Doctor can view profiles
router.get('/', authorize('parent', 'caregiver', 'doctor'), getElderlyProfiles);
router.get('/:id', authorize('parent', 'caregiver', 'doctor'), getElderlyProfileById);

// 2. Only Parent can create, update, or delete elderly profiles
router.post('/', authorize('parent'), createElderlyProfile);
router.put('/:id', authorize('parent'), updateElderlyProfile);
router.delete('/:id', authorize('parent'), deleteElderlyProfile);

export default router;
