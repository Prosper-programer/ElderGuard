import { Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * REMINDER CONTROLLER
 * 
 * Maps to UML: Reminder
 * Methods:
 * - createReminder()
 * - updateReminder()
 * - deleteReminder()
 * - sendReminder()
 * 
 * Connected to Notification:
 * Creating/triggering a reminder generates a Notification for the relevant users.
 */

/**
 * Helper function to create notifications for parent and caregiver
 * Maps to UML: Reminder.sendReminder() -> notification.createNotification()
 */
async function sendReminderNotification(elderlyId: number, title: string, message: string) {
  try {
    // Find parent and caregiver for this elderly person
    const [profiles]: any = await pool.query(
      'SELECT parent_id, caregiver_id, full_name FROM elderly_profiles WHERE elderly_id = ?',
      [elderlyId]
    );

    if (profiles.length === 0) return;

    const { parent_id, caregiver_id, full_name } = profiles[0];
    const fullMessage = `[Reminder for ${full_name}] ${message}`;

    // 1. Notify Parent
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, status) VALUES (?, ?, ?, "unread")',
      [parent_id, title, fullMessage]
    );

    // 2. Notify Caregiver if assigned
    if (caregiver_id) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, status) VALUES (?, ?, ?, "unread")',
        [caregiver_id, title, fullMessage]
      );
    }
  } catch (error) {
    console.error('Error in sendReminderNotification:', error);
  }
}

/**
 * POST /api/reminders
 * Parent creates a reminder for an elderly person.
 * Maps to UML: createReminder()
 */
export async function createReminder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = req.user?.userId;
    const { elderlyId, title, date, time, description, type } = req.body;

    if (!elderlyId || !title || !date || !time) {
      res.status(400).json({
        message: 'elderlyId, title, date, and time are required.',
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

    const reminderType = type || 'medication';

    const [result]: any = await pool.query(
      `INSERT INTO reminders (elderly_id, title, date, time, description, type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [elderlyId, title.trim(), date, time, description ? description.trim() : null, reminderType]
    );

    const reminderId = result.insertId;

    // Send notification (UML relationship: Reminder -> Notification)
    await sendReminderNotification(
      elderlyId,
      `Reminder Created: ${title.trim()}`,
      `A new reminder has been scheduled for ${date} at ${time}. ${description || ''}`
    );

    res.status(201).json({
      message: 'Reminder created successfully.',
      status: 'success',
      data: {
        reminder_id: reminderId,
        elderly_id: elderlyId,
        title: title.trim(),
        date,
        time,
        description: description || null,
        type: reminderType,
        status: 'active'
      }
    });
  } catch (error: any) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      message: 'Internal server error creating reminder.',
      status: 'error'
    });
  }
}

/**
 * GET /api/reminders/elderly/:elderlyId
 * Lists reminders for an elderly person.
 */
export async function getRemindersByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [rows]: any = await pool.query(
      'SELECT * FROM reminders WHERE elderly_id = ? ORDER BY date ASC, time ASC',
      [elderlyId]
    );

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      message: 'Internal server error fetching reminders.',
      status: 'error'
    });
  }
}

/**
 * PUT /api/reminders/:id
 * Parent updates a reminder.
 * Maps to UML: updateReminder()
 */
export async function updateReminder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const reminderId = Number(req.params.id);
    const { title, date, time, description, type, status } = req.body;

    const [existing]: any = await pool.query('SELECT * FROM reminders WHERE reminder_id = ?', [reminderId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Reminder not found.', status: 'error' });
      return;
    }

    const current = existing[0];

    await pool.query(
      `UPDATE reminders SET
        title = ?, date = ?, time = ?, description = ?, type = ?, status = ?
       WHERE reminder_id = ?`,
      [
        title !== undefined ? title.trim() : current.title,
        date !== undefined ? date : current.date,
        time !== undefined ? time : current.time,
        description !== undefined ? description : current.description,
        type !== undefined ? type : current.type,
        status !== undefined ? status : current.status,
        reminderId
      ]
    );

    res.status(200).json({
      message: 'Reminder updated successfully.',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      message: 'Internal server error updating reminder.',
      status: 'error'
    });
  }
}

/**
 * DELETE /api/reminders/:id
 * Parent deletes a reminder.
 * Maps to UML: deleteReminder()
 */
export async function deleteReminder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const reminderId = Number(req.params.id);

    const [result]: any = await pool.query('DELETE FROM reminders WHERE reminder_id = ?', [reminderId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Reminder not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      message: 'Reminder deleted successfully.',
      status: 'success'
    });
  } catch (error: any) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      message: 'Internal server error deleting reminder.',
      status: 'error'
    });
  }
}
