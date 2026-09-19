import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * ALERT CONTROLLER
 * 
 * Maps to UML: Alert
 * Attributes: alertId, description, dateTime
 * Method: sendAlert()
 * Relationship: Connected to Notification
 */

/**
 * GET /api/alerts/elderly/:elderlyId
 * Returns all alerts triggered for a specific elderly person.
 */
export async function getAlertsByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [rows]: any = await pool.query(
      `SELECT a.*, e.full_name AS elderly_name
       FROM alerts a
       JOIN elderly_profiles e ON a.elderly_id = e.elderly_id
       WHERE a.elderly_id = ?
       ORDER BY a.date_time DESC`,
      [elderlyId]
    );

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      message: 'Internal server error fetching alerts.',
      status: 'error'
    });
  }
}

/**
 * GET /api/alerts/:id
 * Views details of a single alert.
 */
export async function getAlertById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const alertId = Number(req.params.id);

    const [rows]: any = await pool.query(
      `SELECT a.*, e.full_name AS elderly_name
       FROM alerts a
       JOIN elderly_profiles e ON a.elderly_id = e.elderly_id
       WHERE a.alert_id = ?`,
      [alertId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'Alert not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error: any) {
    console.error('Get alert by id error:', error);
    res.status(500).json({
      message: 'Internal server error fetching alert.',
      status: 'error'
    });
  }
}

/**
 * POST /api/alerts
 * Sends a manual emergency alert for an elderly person.
 * Maps to UML: sendAlert()
 */
export async function sendManualAlert(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { elderlyId, description } = req.body;

    if (!elderlyId || !description) {
      res.status(400).json({
        message: 'elderlyId and description are required.',
        status: 'error'
      });
      return;
    }

    // Get parent and caregiver to notify
    const [profiles]: any = await pool.query(
      'SELECT parent_id, caregiver_id, full_name FROM elderly_profiles WHERE elderly_id = ?',
      [elderlyId]
    );

    if (profiles.length === 0) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const { parent_id, caregiver_id, full_name } = profiles[0];
    const alertText = `[MANUAL ALERT for ${full_name}]: ${description.trim()}`;

    // Create Notification
    const [notifResult]: any = await pool.query(
      'INSERT INTO notifications (user_id, title, message, status) VALUES (?, "EMERGENCY ALERT", ?, "unread")',
      [parent_id, alertText]
    );

    if (caregiver_id) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, status) VALUES (?, "EMERGENCY ALERT", ?, "unread")',
        [caregiver_id, alertText]
      );
    }

    // Create Alert record
    const [alertResult]: any = await pool.query(
      'INSERT INTO alerts (elderly_id, notification_id, description, date_time) VALUES (?, ?, ?, NOW())',
      [elderlyId, notifResult.insertId, alertText]
    );

    res.status(201).json({
      message: 'Emergency alert sent successfully.',
      status: 'success',
      data: {
        alert_id: alertResult.insertId,
        elderly_id: elderlyId,
        description: alertText
      }
    });
  } catch (error: any) {
    console.error('Send manual alert error:', error);
    res.status(500).json({
      message: 'Internal server error sending alert.',
      status: 'error'
    });
  }
}
