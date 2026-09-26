import { Router } from 'express';
import { getProtocolByType, listProtocolTypes } from '../controllers/firstAid.controller';

/**
 * FIRST AID ROUTES
 *
 * These routes are intentionally PUBLIC (no authenticate middleware).
 *
 * Rationale: In an emergency, the caregiver's JWT session may have expired.
 * The protocol data itself is generic first-aid guidance — not patient-specific data —
 * so there is no privacy concern with making it publicly accessible.
 *
 * Routes:
 *   GET /api/first-aid/protocols         → list all supported emergency types
 *   GET /api/first-aid/protocols/:type   → get protocol for a specific type
 *
 * Optional query params on /:type:
 *   ?ai=false   → skip Gemini tip, return pure offline protocol instantly
 */
const router = Router();

router.get('/protocols', listProtocolTypes);
router.get('/protocols/:type', getProtocolByType);

export default router;
