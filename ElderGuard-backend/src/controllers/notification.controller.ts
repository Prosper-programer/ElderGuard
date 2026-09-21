import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Notification } from '../models';

/**
 * NOTIFICATION CONTROLLER
 * 
 * Maps to UML: Notification
 * Methods:
 * - createNotification()
 * - markAsRead()
 * - consultNotification()
 * - sendNotification()
 */

/**
 * GET /api/notifications
 * Returns all notifications for the authenticated user.
 * Maps to UML: users.receiveAlert(), consultNotification()
 */
export async function getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    const rows = await Notification.findAll({
      where: { user_id: userId },
      order: [['date_time', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      message: 'Internal server error fetching notifications.',
      status: 'error'
    });
  }
}

/**
 * GET /api/notifications/:id
 * Views details of a specific notification.
 * Maps to UML: consultNotification()
 */
export async function consultNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const notificationId = Number(req.params.id);
    const userId = req.user?.userId;

    const notif = await Notification.findOne({
      where: { notification_id: notificationId, user_id: userId }
    });

    if (!notif) {
      res.status(404).json({ message: 'Notification not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: notif.toJSON()
    });
  } catch (error: any) {
    console.error('Consult notification error:', error);
    res.status(500).json({
      message: 'Internal server error fetching notification.',
      status: 'error'
    });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a notification as read.
 * Maps to UML: markAsRead()
 */
export async function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const notificationId = Number(req.params.id);
    const userId = req.user?.userId;

    const notif = await Notification.findOne({
      where: { notification_id: notificationId, user_id: userId }
    });

    if (!notif) {
      res.status(404).json({ message: 'Notification not found.', status: 'error' });
      return;
    }

    await notif.update({ status: 'read' });

    res.status(200).json({
      message: 'Notification marked as read.',
      status: 'success',
      notification_id: notificationId
    });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      message: 'Internal server error updating notification.',
      status: 'error'
    });
  }
}
