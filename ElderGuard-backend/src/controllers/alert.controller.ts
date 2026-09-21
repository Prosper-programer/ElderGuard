import { Response } from 'express';
import { Alert, ElderlyProfile, Notification } from '../models';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * ALERT CONTROLLER (Sequelize ORM)
 * 
 * Maps to UML: Alert
 * Attributes: alertId, description, dateTime
 * Method: sendAlert()
 * Relationship: Connected to Notification
 */

/**
 * GET /api/alerts/elderly/:elderlyId
 * Returns all alerts triggered for a specific elderly person via Sequelize.
 */
export async function getAlertsByElderly(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const alerts: any = await Alert.findAll({
      where: { elderly_id: elderlyId },
      include: [
        {
          model: ElderlyProfile,
          as: 'elderly',
          attributes: ['full_name'],
        },
      ],
      order: [['date_time', 'DESC']],
    });

    const formattedAlerts = alerts.map((a: any) => ({
      alert_id: a.alert_id,
      elderly_id: a.elderly_id,
      notification_id: a.notification_id,
      description: a.description,
      date_time: a.date_time,
      elderly_name: a.elderly?.full_name || null,
    }));

    res.status(200).json({
      status: 'success',
      count: formattedAlerts.length,
      data: formattedAlerts,
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
 * Views details of a single alert via Sequelize.
 */
export async function getAlertById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const alertId = Number(req.params.id);

    const alertRecord: any = await Alert.findByPk(alertId, {
      include: [
        {
          model: ElderlyProfile,
          as: 'elderly',
          attributes: ['full_name'],
        },
      ],
    });

    if (!alertRecord) {
      res.status(404).json({ message: 'Alert not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        alert_id: alertRecord.alert_id,
        elderly_id: alertRecord.elderly_id,
        notification_id: alertRecord.notification_id,
        description: alertRecord.description,
        date_time: alertRecord.date_time,
        elderly_name: alertRecord.elderly?.full_name || null,
      },
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
 * Sends a manual emergency alert for an elderly person via Sequelize.
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

    // Get parent and caregiver to notify via Sequelize
    const profile = await ElderlyProfile.findByPk(elderlyId);
    if (!profile) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const alertText = `[MANUAL ALERT for ${profile.full_name}]: ${description.trim()}`;

    // Create Notification for Parent
    const parentNotif = await Notification.create({
      user_id: profile.parent_id,
      title: 'EMERGENCY ALERT',
      message: alertText,
      status: 'unread',
    });

    // Create Notification for Caregiver if assigned
    if (profile.caregiver_id) {
      await Notification.create({
        user_id: profile.caregiver_id,
        title: 'EMERGENCY ALERT',
        message: alertText,
        status: 'unread',
      });
    }

    // Create Alert record
    const newAlert = await Alert.create({
      elderly_id: Number(elderlyId),
      notification_id: parentNotif.notification_id,
      description: alertText,
    });

    res.status(201).json({
      message: 'Emergency alert sent successfully.',
      status: 'success',
      data: {
        alert_id: newAlert.alert_id,
        elderly_id: newAlert.elderly_id,
        description: newAlert.description,
      },
    });
  } catch (error: any) {
    console.error('Send manual alert error:', error);
    res.status(500).json({
      message: 'Internal server error sending alert.',
      status: 'error'
    });
  }
}
