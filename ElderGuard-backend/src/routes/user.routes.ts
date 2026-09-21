import { Router } from 'express';
import {
  updateUserProfile,
  getCaregivers,
  createCaregiver,
  updateCaregiver,
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Update own profile
router.put('/profile', updateUserProfile);

// List available caregivers (for parents to choose an assigned caregiver)
router.get('/caregivers', getCaregivers);

// Parent can provision a new caregiver account
router.post('/caregivers', authorize('parent'), createCaregiver);

// Parent can manage/update an assigned caregiver
router.put('/caregivers/:id', authorize('parent'), updateCaregiver);

// List available doctors
router.get('/doctors', getDoctors);

// Parent can provision a new doctor account
router.post('/doctors', authorize('parent'), createDoctor);

// Parent can manage/update an assigned doctor
router.put('/doctors/:id', authorize('parent'), updateDoctor);

// Parent can delete/remove a caregiver or doctor
router.delete('/:id', authorize('parent'), deleteUser);

export default router;

