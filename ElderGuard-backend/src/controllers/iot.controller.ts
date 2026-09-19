import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * IOT DEVICE CONTROLLER
 * 
 * Maps to UML: IOT device
 * Attributes: deviceId, deviceName, lastConnection
 * Methods: connect(), disconnect(), sendData()
 * 
 * Generates Alerts and Notifications when abnormal vital readings or falls are detected!
 */

/**
 * POST /api/iot/register
 * Registers a new IoT device and optionally links it to an elderly person.
 */
export async function registerDevice(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { deviceName, elderlyId } = req.body;

    if (!deviceName) {
      res.status(400).json({ message: 'deviceName is required.', status: 'error' });
      return;
    }

    const [result]: any = await pool.query(
      'INSERT INTO iot_devices (device_name, elderly_id, status) VALUES (?, ?, "disconnected")',
      [deviceName.trim(), elderlyId || null]
    );

    res.status(201).json({
      message: 'IoT device registered successfully.',
      status: 'success',
      data: {
        device_id: result.insertId,
        device_name: deviceName.trim(),
        elderly_id: elderlyId || null,
        status: 'disconnected'
      }
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

    const [result]: any = await pool.query(
      'UPDATE iot_devices SET status = "connected", last_connection = NOW() WHERE device_id = ?',
      [deviceId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'IoT device not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      message: 'IoT device connected successfully.',
      status: 'success',
      device_id: deviceId
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

    const [result]: any = await pool.query(
      'UPDATE iot_devices SET status = "disconnected", last_connection = NOW() WHERE device_id = ?',
      [deviceId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'IoT device not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      message: 'IoT device disconnected.',
      status: 'success',
      device_id: deviceId
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
 * Receives telemetry from IoT device / simulation:
 * - heartRate (bpm)
 * - spo2 (%)
 * - temperature (°C)
 * - fallDetected (boolean)
 * - latitude, longitude (optional location update)
 * 
 * If any metric is abnormal, it automatically:
 * 1. Creates an Alert in the alerts table
 * 2. Creates a Notification in the notifications table for Parent and Caregiver
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
    await pool.query('UPDATE iot_devices SET last_connection = NOW() WHERE device_id = ?', [deviceId]);

    // Check if location was included, if so, record in locations table
    if (latitude !== undefined && longitude !== undefined) {
      await pool.query(
        'INSERT INTO locations (elderly_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())',
        [elderlyId, latitude, longitude]
      );
    }

    // Find elderly person, parent, and caregiver
    const [profiles]: any = await pool.query(
      'SELECT parent_id, caregiver_id, full_name FROM elderly_profiles WHERE elderly_id = ?',
      [elderlyId]
    );

    if (profiles.length === 0) {
      res.status(404).json({ message: 'Elderly profile not found.', status: 'error' });
      return;
    }

    const { parent_id, caregiver_id, full_name } = profiles[0];
    const generatedAlerts: string[] = [];

    // Vital signs check logic
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

    // If any abnormal condition was detected, save Alert and notify Parent & Caregiver
    for (const alertDesc of generatedAlerts) {
      // 1. Create Notification for Parent
      const [notifResult]: any = await pool.query(
        'INSERT INTO notifications (user_id, title, message, status) VALUES (?, "EMERGENCY HEALTH ALERT", ?, "unread")',
        [parent_id, alertDesc]
      );
      const notifId = notifResult.insertId;

      // 2. Also notify assigned Caregiver if available
      if (caregiver_id) {
        await pool.query(
          'INSERT INTO notifications (user_id, title, message, status) VALUES (?, "EMERGENCY HEALTH ALERT", ?, "unread")',
          [caregiver_id, alertDesc]
        );
      }

      // 3. Create Alert record linked to elderly and notification
      await pool.query(
        'INSERT INTO alerts (elderly_id, notification_id, description, date_time) VALUES (?, ?, ?, NOW())',
        [elderlyId, notifId, alertDesc]
      );
    }

    res.status(200).json({
      message: 'IoT sensor data processed successfully.',
      status: 'success',
      is_abnormal: generatedAlerts.length > 0,
      alerts_triggered: generatedAlerts
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
 * Lists all registered IoT devices.
 */
export async function getDevices(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const [rows]: any = await pool.query(
      `SELECT d.*, e.full_name AS elderly_name
       FROM iot_devices d
       LEFT JOIN elderly_profiles e ON d.elderly_id = e.elderly_id
       ORDER BY d.device_id ASC`
    );

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get devices error:', error);
    res.status(500).json({
      message: 'Internal server error fetching devices.',
      status: 'error'
    });
  }
}
