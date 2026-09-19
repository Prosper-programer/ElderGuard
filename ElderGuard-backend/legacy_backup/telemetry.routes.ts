import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetry.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { telemetryIngestSchema, simulateSchema } from '../utils/validators';

const router = Router();

// Wearable sensor packet ingestion endpoint (called by hardware gateway / base station)
router.post('/ingest', validateBody(telemetryIngestSchema), TelemetryController.ingest);

// Anomaly simulation endpoint (called by developer strip or simulation testing)
router.post('/simulate', validateBody(simulateSchema), TelemetryController.simulate);

export default router;
