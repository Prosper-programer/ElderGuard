import { Response, NextFunction } from 'express';
import { ElderlyService } from '../services/elderly.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ElderlyController {
  public static async getProfiles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const userRole = req.user?.role || '';
      const profiles = await ElderlyService.getProfilesForUser(userId, userRole);
      sendSuccess(res, profiles);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async getProfileById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await ElderlyService.getProfileById(req.params.id);
      sendSuccess(res, profile);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  public static async createProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const parentManagerId = req.user?.role === 'parent' ? req.user.userId : req.body.parentManagerId;
      const profile = await ElderlyService.createProfile({
        ...req.body,
        parentManagerId,
      });
      sendSuccess(res, profile, 'Elderly profile created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await ElderlyService.updateProfile(req.params.id, req.body);
      sendSuccess(res, profile, 'Elderly profile updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
