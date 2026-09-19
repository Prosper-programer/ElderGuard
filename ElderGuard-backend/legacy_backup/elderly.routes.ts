import { Router } from 'express';
import { ElderlyController } from '../controllers/elderly.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', ElderlyController.getProfiles);
router.get('/:id', ElderlyController.getProfileById);
router.post('/', ElderlyController.createProfile);
router.patch('/:id', ElderlyController.updateProfile);

export default router;
