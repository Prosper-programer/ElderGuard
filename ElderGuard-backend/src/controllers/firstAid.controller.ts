import { Request, Response } from 'express';
import { getFirstAidResponse } from '../services/firstAid.service';
import { getAllProtocolTypes } from '../data/firstAidProtocols';

/**
 * FIRST AID CONTROLLER
 *
 * GET /api/first-aid/protocols/:type
 * Public endpoint — no authentication required.
 * Returns the predefined protocol for the given emergency type,
 * optionally enhanced with a Gemini contextual tip.
 *
 * Query params:
 *   ai=false  →  skip the Gemini tip entirely (faster, fully offline response)
 */
export async function getProtocolByType(req: Request, res: Response): Promise<void> {
  const type = (req.params.type || '').toLowerCase().trim();
  const skipAi = req.query.ai === 'false';

  const validTypes = getAllProtocolTypes();

  if (!type || !validTypes.includes(type)) {
    res.status(400).json({
      status: 'error',
      message: `Invalid emergency type. Supported types: ${validTypes.join(', ')}`,
    });
    return;
  }

  try {
    const protocol = await getFirstAidResponse(type, !skipAi);

    if (!protocol) {
      res.status(404).json({
        status: 'error',
        message: `Protocol for type "${type}" not found.`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: protocol,
    });
  } catch (error: any) {
    console.error('First aid controller error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error loading first-aid protocol.',
    });
  }
}

/**
 * GET /api/first-aid/protocols
 * Returns a list of all supported emergency types.
 */
export async function listProtocolTypes(req: Request, res: Response): Promise<void> {
  const types = getAllProtocolTypes();
  res.status(200).json({
    status: 'success',
    data: {
      supportedTypes: types,
      count: types.length,
    },
  });
}
