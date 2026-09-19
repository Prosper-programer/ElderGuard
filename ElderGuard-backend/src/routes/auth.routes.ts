import { Router } from 'express';
import { register, login, adminLogin, logout, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/logout', logout);

// Protected routes (requires valid JWT token)
router.get('/profile', authenticate, getProfile);

export default router;
