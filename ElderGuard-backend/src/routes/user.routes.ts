import { Router } from 'express';
import { updateUserProfile, getCaregivers, createCaregiver, getDoctors, createDoctor } from '../controllers/user.controller';
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

// List available doctors
router.get('/doctors', getDoctors);

// Parent can provision a new doctor account
router.post('/doctors', authorize('parent'), createDoctor);

export default router;
