import { Router } from 'express';
import {
  generateReport,
  getReportsByElderly,
  viewReport,
  downloadReport
} from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// View and download reports (Parent and Caregiver)
router.get('/elderly/:elderlyId', authorize('parent', 'caregiver'), getReportsByElderly);
router.get('/:id', authorize('parent', 'caregiver'), viewReport);
router.get('/:id/download', authorize('parent', 'caregiver'), downloadReport);

// Parent only: generate reports
router.post('/generate', authorize('parent'), generateReport);

export default router;
