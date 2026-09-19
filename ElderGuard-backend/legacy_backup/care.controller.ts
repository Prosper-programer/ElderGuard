import { Request, Response, NextFunction } from 'express';
import { CareService } from '../services/care.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class CareController {
  public static async getMedications(req: Request, res: Response, next: NextFunction) {
    try {
      const elderlyId = req.query.elderlyId as string;
      if (!elderlyId) {
        sendError(res, 'Query parameter elderlyId is required', 400);
        return;
      }
      const meds = await CareService.getMedications(elderlyId);
      sendSuccess(res, meds);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async createMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const med = await CareService.createMedication(req.body);
      sendSuccess(res, med, 'Medication created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getTodayDoses(req: Request, res: Response, next: NextFunction) {
    try {
      const elderlyId = req.query.elderlyId as string | undefined;
      const doses = await CareService.getTodayDoses(elderlyId);
      sendSuccess(res, doses);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async updateDoseStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes, loggedByName } = req.body;
      const user = loggedByName || req.user?.email || 'Caregiver';
      const updated = await CareService.updateDoseStatus(id, status, user, notes);
      sendSuccess(res, updated, 'Dose status updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const elderlyId = req.query.elderlyId as string;
      if (!elderlyId) {
        sendError(res, 'Query parameter elderlyId is required', 400);
        return;
      }
      const activities = await CareService.getActivities(elderlyId);
      sendSuccess(res, activities);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async updateActivityProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { increment, loggedByName } = req.body;
      const user = loggedByName || req.user?.email || 'Caregiver';
      const updated = await CareService.updateActivityProgress(id, increment || 1, user);
      sendSuccess(res, updated, 'Activity progress updated');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
