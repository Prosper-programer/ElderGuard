import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Reminder, ElderlyProfile, Notification } from '../models';

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
    const profile = await ElderlyProfile.findByPk(elderlyId);
    if (!profile) return;

    const { parent_id, caregiver_id, full_name } = profile;
    const fullMessage = `[Reminder for ${full_name}] ${message}`;

    // 1. Notify Parent
    await Notification.create({
      user_id: parent_id,
      title,
      message: fullMessage,
      status: 'unread'
    });

    // 2. Notify Caregiver if assigned
    if (caregiver_id) {
      await Notification.create({
        user_id: caregiver_id,
        title,
        message: fullMessage,
        status: 'unread'
      });
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

    const reminderType = type || 'medication';

    const newReminder = await Reminder.create({
      elderly_id: elderlyId,
      title: title.trim(),
      date,
      time,
      description: description ? description.trim() : null,
      type: reminderType,
      status: 'active'
    });

    // Send notification (UML relationship: Reminder -> Notification)
    await sendReminderNotification(
      elderlyId,
      `Reminder Created: ${title.trim()}`,
      `A new reminder has been scheduled for ${date} at ${time}. ${description || ''}`
    );

    res.status(201).json({
      message: 'Reminder created successfully.',
      status: 'success',
      data: newReminder.toJSON()
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

    const rows = await Reminder.findAll({
      where: { elderly_id: elderlyId },
      order: [
        ['date', 'ASC'],
        ['time', 'ASC']
      ]
    });

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

    const reminder = await Reminder.findByPk(reminderId);
    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found.', status: 'error' });
      return;
    }

    await reminder.update({
      title: title !== undefined ? title.trim() : reminder.title,
      date: date !== undefined ? date : reminder.date,
      time: time !== undefined ? time : reminder.time,
      description: description !== undefined ? description : reminder.description,
      type: type !== undefined ? type : reminder.type,
      status: status !== undefined ? status : reminder.status,
    });

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

    const deleted = await Reminder.destroy({
      where: { reminder_id: reminderId }
    });

    if (deleted === 0) {
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
