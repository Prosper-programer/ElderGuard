import { Router } from 'express';
import {
  getParents,
  getParentById,
  activateParent,
  deactivateParent,
  getSystemStats,
  getAllUsers,
  activateAccount,
  deactivateAccount
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All admin routes strictly require role === 'admin'
router.use(authenticate);
router.use(authorize('admin'));

// Parent Account Management
router.get('/parents', getParents);
router.get('/parents/:id', getParentById);
router.put('/parents/:id/activate', activateParent);
router.patch('/parents/:id/activate', activateParent);
router.put('/parents/:id/deactivate', deactivateParent);
router.patch('/parents/:id/deactivate', deactivateParent);

// Backwards-compatible routes
router.get('/users', getAllUsers);
router.put('/users/:id/activate', activateAccount);
router.patch('/users/:id/activate', activateAccount);
router.put('/users/:id/deactivate', deactivateAccount);
router.patch('/users/:id/deactivate', deactivateAccount);

// System statistics overview
router.get('/system-stats', getSystemStats);

export default router;
