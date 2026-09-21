import { Request, Response } from 'express';
import { IoTDevice, ElderlyProfile, Location, Notification, Alert } from '../models';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * IOT DEVICE CONTROLLER (Sequelize ORM)
 * 
 * Maps to UML: IOT device
 * Attributes: deviceId, deviceName, lastConnection
 * Methods: connect(), disconnect(), sendData()
 * 
 * Generates Alerts and Notifications when abnormal vital readings or falls are detected!
 */

/**
 * POST /api/iot/register
 * Registers a new IoT device and optionally links it to an elderly person via Sequelize.
 */
export async function registerDevice(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { deviceName, elderlyId } = req.body;

    if (!deviceName) {
      res.status(400).json({ message: 'deviceName is required.', status: 'error' });
      return;
    }

    const device = await IoTDevice.create({
      device_name: deviceName.trim(),
      elderly_id: elderlyId ? Number(elderlyId) : null,
      status: 'disconnected',
    });

    res.status(201).json({
      message: 'IoT device registered successfully.',
      status: 'success',
      data: device,
    });
  } catch (error: any) {
    console.error('Register device error:', error);
    res.status(500).json({
      message: 'Internal server error registering device.',
      status: 'error'
    });
  }
}

/**
 * POST /api/iot/:deviceId/connect
 * Maps to UML: IOT device.connect()
 */
export async function connectDevice(req: Request, res: Response): Promise<void> {
  try {
    const deviceId = Number(req.params.deviceId);

    const device = await IoTDevice.findByPk(deviceId);
    if (!device) {
      res.status(404).json({ message: 'IoT device not found.', status: 'error' });
      return;
    }

    await device.update({ status: 'connected', last_connection: new Date() });

    res.status(200).json({
      message: 'IoT device connected successfully.',
      status: 'success',
      device_id: deviceId,
    });
  } catch (error: any) {
    console.error('Connect device error:', error);
    res.status(500).json({
      message: 'Internal server error connecting device.',
      status: 'error'
    });
  }
}

/**
 * POST /api/iot/:deviceId/disconnect
 * Maps to UML: IOT device.disconnect()
 */
export async function disconnectDevice(req: Request, res: Response): Promise<void> {
  try {
    const deviceId = Number(req.params.deviceId);

    const device = await IoTDevice.findByPk(deviceId);
    if (!device) {
      res.status(404).json({ message: 'IoT device not found.', status: 'error' });
      return;
    }

    await device.update({ status: 'disconnected', last_connection: new Date() });

    res.status(200).json({
      message: 'IoT device disconnected.',
      status: 'success',
      device_id: deviceId,
    });
  } catch (error: any) {
    console.error('Disconnect device error:', error);
    res.status(500).json({
      message: 'Internal server error disconnecting device.',
      status: 'error'
    });
  }
}

/**
 * POST /api/iot/data
 * Maps to UML: IOT device.sendData() -> Alert.sendAlert()
 * 
 * Receives telemetry from IoT device / simulation via Sequelize:
 * - heartRate (bpm)
 * - spo2 (%)
 * - temperature (°C)
 * - fallDetected (boolean)
 * - latitude, longitude (optional location update)
 */
export async function receiveDeviceData(req: Request, res: Response): Promise<void> {
  try {
    const { deviceId, elderlyId, heartRate, spo2, temperature, fallDetected, latitude, longitude } = req.body;

    if (!deviceId || !elderlyId) {
      res.status(400).json({
        message: 'deviceId and elderlyId are required.',
        status: 'error'
      });
      return;
    }

    // Update device last_connection timestamp
    const device = await IoTDevice.findByPk(deviceId);
    if (device) {
      await device.update({ last_connection: new Date() });
    }

    // Record location if provided
    if (latitude !== undefined && longitude !== undefined) {
      await Location.create({
        elderly_id: Number(elderlyId),
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    }

    // Find elderly person, parent, and caregiver
    const profile = await ElderlyProfile.findByPk(elderlyId);
    if (!profile) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const { parent_id, caregiver_id, full_name } = profile;
    const generatedAlerts: string[] = [];

    // Vital signs threshold check
    if (fallDetected === true) {
      generatedAlerts.push(`CRITICAL FALL DETECTED for ${full_name}! Immediate assistance required.`);
    }
    if (heartRate && (heartRate < 50 || heartRate > 115)) {
      generatedAlerts.push(`Abnormal Heart Rate detected for ${full_name}: ${heartRate} bpm (Normal: 60-100 bpm).`);
    }
    if (spo2 && spo2 < 92) {
      generatedAlerts.push(`Low Blood Oxygen (SpO2) detected for ${full_name}: ${spo2}% (Normal: 95-100%).`);
    }
    if (temperature && (temperature > 38.0 || temperature < 35.5)) {
      generatedAlerts.push(`Abnormal Body Temperature detected for ${full_name}: ${temperature}°C.`);
    }

    // Save Alert and notify Parent & Caregiver if abnormal
    for (const alertDesc of generatedAlerts) {
      // 1. Create Notification for Parent
      const parentNotif = await Notification.create({
        user_id: parent_id,
        title: 'EMERGENCY HEALTH ALERT',
        message: alertDesc,
        status: 'unread',
      });

      // 2. Also notify assigned Caregiver if available
      if (caregiver_id) {
        await Notification.create({
          user_id: caregiver_id,
          title: 'EMERGENCY HEALTH ALERT',
          message: alertDesc,
          status: 'unread',
        });
      }

      // 3. Create Alert record linked to elderly and notification
      await Alert.create({
        elderly_id: Number(elderlyId),
        notification_id: parentNotif.notification_id,
        description: alertDesc,
      });
    }

    res.status(200).json({
      message: 'IoT sensor data processed successfully.',
      status: 'success',
      is_abnormal: generatedAlerts.length > 0,
      alerts_triggered: generatedAlerts,
    });
  } catch (error: any) {
    console.error('Receive IoT data error:', error);
    res.status(500).json({
      message: 'Internal server error processing device data.',
      status: 'error'
    });
  }
}

/**
 * GET /api/iot/devices
 * Lists all registered IoT devices via Sequelize.
 */
export async function getDevices(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const devices: any = await IoTDevice.findAll({
      include: [
        {
          model: ElderlyProfile,
          as: 'elderly',
          attributes: ['full_name'],
        },
      ],
      order: [['device_id', 'ASC']],
    });

    const formattedDevices = devices.map((d: any) => ({
      device_id: d.device_id,
      elderly_id: d.elderly_id,
      device_name: d.device_name,
      last_connection: d.last_connection,
      status: d.status,
      created_at: d.created_at,
      elderly_name: d.elderly?.full_name || null,
    }));

    res.status(200).json({
      status: 'success',
      count: formattedDevices.length,
      data: formattedDevices,
    });
  } catch (error: any) {
    console.error('Get devices error:', error);
    res.status(500).json({
      message: 'Internal server error fetching devices.',
      status: 'error'
    });
  }
}
