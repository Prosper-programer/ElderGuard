import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

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
    const [profiles]: any = await pool.query(
      'SELECT elderly_id FROM elderly_profiles WHERE elderly_id = ? AND parent_id = ?',
      [elderlyId, parentId]
    );

    if (profiles.length === 0) {
      res.status(403).json({
        message: 'Forbidden: You do not manage this elderly person.',
        status: 'error'
      });
      return;
    }

    const [result]: any = await pool.query(
      `INSERT INTO daily_activities (elderly_id, name, date, start_time, end_time, description, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [elderlyId, name.trim(), date, startTime, endTime, description ? description.trim() : null]
    );

    res.status(201).json({
      message: 'Daily activity created successfully.',
      status: 'success',
      data: {
        activity_id: result.insertId,
        elderly_id: elderlyId,
        name: name.trim(),
        date,
        start_time: startTime,
        end_time: endTime,
        description: description || null,
        status: 'pending'
      }
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

    let query = 'SELECT * FROM daily_activities WHERE elderly_id = ?';
    const params: any[] = [elderlyId];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY date ASC, start_time ASC';

    const [rows]: any = await pool.query(query, params);

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

    const [rows]: any = await pool.query(
      `SELECT 
        COUNT(*) AS total_activities,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_activities,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_activities
       FROM daily_activities 
       WHERE elderly_id = ?`,
      [elderlyId]
    );

    const stats = rows[0];
    const total = Number(stats.total_activities) || 0;
    const completed = Number(stats.completed_activities) || 0;
    const pending = Number(stats.pending_activities) || 0;
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

    const [result]: any = await pool.query(
      'UPDATE daily_activities SET status = ? WHERE activity_id = ?',
      [newStatus, activityId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Activity not found.', status: 'error' });
      return;
    }

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

    const [existing]: any = await pool.query('SELECT * FROM daily_activities WHERE activity_id = ?', [activityId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Activity not found.', status: 'error' });
      return;
    }

    const current = existing[0];

    await pool.query(
      `UPDATE daily_activities SET
        name = ?, date = ?, start_time = ?, end_time = ?, description = ?
       WHERE activity_id = ?`,
      [
        name !== undefined ? name.trim() : current.name,
        date !== undefined ? date : current.date,
        startTime !== undefined ? startTime : current.start_time,
        endTime !== undefined ? endTime : current.end_time,
        description !== undefined ? description : current.description,
        activityId
      ]
    );

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

    const [result]: any = await pool.query('DELETE FROM daily_activities WHERE activity_id = ?', [activityId]);
    if (result.affectedRows === 0) {
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
