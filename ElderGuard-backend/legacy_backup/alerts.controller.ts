import { Request, Response, NextFunction } from 'express';
import { AlertsService } from '../services/alerts.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AlertsController {
  public static async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const elderlyId = req.query.elderlyId as string | undefined;
      const status = req.query.status as string | undefined;
      const alerts = await AlertsService.getAlerts(elderlyId, status);
      sendSuccess(res, alerts);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async getAlertById(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertsService.getAlertById(req.params.id);
      sendSuccess(res, alert);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  public static async triggerAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertsService.triggerAlert(req.body);
      sendSuccess(res, alert, 'Alert triggered successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async acknowledgeAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const responderName = req.body.acknowledgedBy || req.user?.email || 'Care Team';
      const alert = await AlertsService.acknowledgeAlert(req.params.id, responderName);
      sendSuccess(res, alert, 'Alert acknowledged');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async resolveAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { notes, resolvedBy } = req.body;
      const responderName = resolvedBy || req.user?.email || 'Care Team';
      const alert = await AlertsService.resolveAlert(req.params.id, responderName, notes || 'Resolved by user.');
      sendSuccess(res, alert, 'Alert resolved');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
