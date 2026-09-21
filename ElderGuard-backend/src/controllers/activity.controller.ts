import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { DailyActivity, ElderlyProfile } from '../models';

/**
 * DAILY ACTIVITY CONTROLLER
 * 
 * Maps to UML: DailyActivity
 * Methods:
 * - createActivity()
 * - updateActivity()
 * - getStatistics()
 * - recordActivity()
 * - deleteActivity()
 */

/**
 * POST /api/activities
 * Parent creates an activity for an elderly person.
 * Maps to UML: createActivity()
 */
export async function createActivity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = req.user?.userId;
    const { elderlyId, name, date, startTime, endTime, description } = req.body;

    if (!elderlyId || !name || !date || !startTime || !endTime) {
      res.status(400).json({
        message: 'elderlyId, name, date, startTime, and endTime are required.',
        status: 'error'
      });
      return;
    }

    // Verify parent manages this elderly person
    const profile = await ElderlyProfile.findOne({
      where: { elderly_id: elderlyId, parent_id: parentId }
    });

    if (!profile) {
      res.status(403).json({
        message: 'Forbidden: You do not manage this elderly person.',
        status: 'error'
      });
      return;
    }

    const newActivity = await DailyActivity.create({
      elderly_id: elderlyId,
      name: name.trim(),
      date,
      start_time: startTime,
      end_time: endTime,
      description: description ? description.trim() : null,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Daily activity created successfully.',
      status: 'success',
      data: newActivity.toJSON()
    });
  } catch (error: any) {
    console.error('Create activity error:', error);
    res.status(500).json({
      message: 'Internal server error creating activity.',
      status: 'error'
    });
  }
}

/**
 * GET /api/activities/elderly/:elderlyId
 * Lists activities for a specific elderly person.
 */
export async function getActivitiesByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);
    const { date } = req.query;

    const whereClause: any = { elderly_id: elderlyId };
    if (date) {
      whereClause.date = date;
    }

    const rows = await DailyActivity.findAll({
      where: whereClause,
      order: [
        ['date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving activities.',
      status: 'error'
    });
  }
}

/**
 * GET /api/activities/statistics/:elderlyId
 * Returns activity summary statistics for an elderly person.
 * Maps to UML: getStatistics()
 */
export async function getActivityStatistics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [total, completed, pending] = await Promise.all([
      DailyActivity.count({ where: { elderly_id: elderlyId } }),
      DailyActivity.count({ where: { elderly_id: elderlyId, status: 'completed' } }),
      DailyActivity.count({ where: { elderly_id: elderlyId, status: 'pending' } }),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      status: 'success',
      data: {
        elderly_id: elderlyId,
        total_activities: total,
        completed_activities: completed,
        pending_activities: pending,
        completion_rate_percentage: completionRate
      }
    });
  } catch (error: any) {
    console.error('Activity statistics error:', error);
    res.status(500).json({
      message: 'Internal server error fetching statistics.',
      status: 'error'
    });
  }
}

/**
 * PATCH /api/activities/:id/record
 * Records an activity completion (Caregiver or Parent).
 * Maps to UML: recordActivity()
 */
export async function recordActivity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const activityId = Number(req.params.id);
    const { status } = req.body; // 'completed' or 'pending'

    const newStatus = status === 'completed' ? 'completed' : 'pending';

    const activity = await DailyActivity.findByPk(activityId);
    if (!activity) {
      res.status(404).json({ message: 'Activity not found.', status: 'error' });
      return;
    }

    await activity.update({ status: newStatus });

    res.status(200).json({
      message: `Activity marked as ${newStatus}.`,
      status: 'success',
      activity_id: activityId,
      new_status: newStatus
    });
  } catch (error: any) {
    console.error('Record activity error:', error);
    res.status(500).json({
      message: 'Internal server error recording activity.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/activities/:id
 * Parent updates an activity.
 * Maps to UML: updateActivity()
 */
export async function updateActivity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const activityId = Number(req.params.id);
    const { name, date, startTime, endTime, description } = req.body;

    const activity = await DailyActivity.findByPk(activityId);
    if (!activity) {
      res.status(404).json({ message: 'Activity not found.', status: 'error' });
      return;
    }

    await activity.update({
      name: name !== undefined ? name.trim() : activity.name,
      date: date !== undefined ? date : activity.date,
      start_time: startTime !== undefined ? startTime : activity.start_time,
      end_time: endTime !== undefined ? endTime : activity.end_time,
      description: description !== undefined ? description : activity.description,
    });

    res.status(200).json({
      message: 'Activity updated successfully.',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Update activity error:', error);
    res.status(500).json({
      message: 'Internal server error updating activity.',
      status: 'error'
    });
  }
}

/**
 * DELETE /api/activities/:id
 * Parent deletes an activity.
 * Maps to UML: deleteActivity()
 */
export async function deleteActivity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const activityId = Number(req.params.id);

    const deleted = await DailyActivity.destroy({
      where: { activity_id: activityId }
    });

    if (deleted === 0) {
      res.status(404).json({ message: 'Activity not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      message: 'Activity deleted successfully.',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      message: 'Internal server error deleting activity.',
      status: 'error'
    });
  }
}
