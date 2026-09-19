import { Request, Response, NextFunction } from 'express';
import { VitalsService } from '../services/vitals.service';
import { sendSuccess, sendError } from '../utils/response';

export class VitalsController {
  public static async getLatest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vitals = await VitalsService.getLatestVitals(id);
      sendSuccess(res, vitals);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  public static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const period = (req.query.period as string) || '24h';
      const metric = req.query.metric as string | undefined;
      const history = await VitalsService.getVitalsHistory(id, metric, period);
      sendSuccess(res, history);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }
}
