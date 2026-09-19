import { Request, Response } from 'express';
import pool from '../config/database';
import { calculateDistanceMeters } from '../utils/geo';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * LOCATION CONTROLLER
 * 
 * Maps to UML: Location
 * Attributes: locationId, latitude, longitude, timestamp
 * Methods:
 * - getCurrentLocation()
 * - calculateDistance()
 * - updateLocation()
 */

/**
 * POST /api/locations
 * Updates location for an elderly person and automatically checks geofence boundary!
 * Maps to UML: updateLocation() -> checkBoundary()
 */
export async function updateLocation(req: Request, res: Response): Promise<void> {
  try {
    const { elderlyId, latitude, longitude } = req.body;

    if (!elderlyId || latitude === undefined || longitude === undefined) {
      res.status(400).json({
        message: 'elderlyId, latitude, and longitude are required.',
        status: 'error'
      });
      return;
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    // 1. Store location record in MySQL
    const [insertResult]: any = await pool.query(
      'INSERT INTO locations (elderly_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())',
      [elderlyId, lat, lon]
    );

    // 2. Check if a Geofence is active for this elderly person
    const [geofences]: any = await pool.query(
      'SELECT * FROM geofences WHERE elderly_id = ? AND is_enabled = TRUE',
      [elderlyId]
    );

    let geofenceBreached = false;
    let distanceToCenter = 0;

    if (geofences.length > 0) {
      const gf = geofences[0];
      distanceToCenter = calculateDistanceMeters(
        lat,
        lon,
        Number(gf.center_latitude),
        Number(gf.center_longitude)
      );

      // If distance exceeds allowed radius, trigger geofence breach alert!
      if (distanceToCenter > Number(gf.radius)) {
        geofenceBreached = true;

        // Get parent and caregiver
        const [profiles]: any = await pool.query(
          'SELECT parent_id, caregiver_id, full_name FROM elderly_profiles WHERE elderly_id = ?',
          [elderlyId]
        );

        if (profiles.length > 0) {
          const { parent_id, caregiver_id, full_name } = profiles[0];
          const alertMessage = `GEOFENCE BREACH: ${full_name} is ${Math.round(distanceToCenter)}m away from center (Safe limit: ${gf.radius}m).`;

          // Create notification for Parent
          const [notifResult]: any = await pool.query(
            'INSERT INTO notifications (user_id, title, message, status) VALUES (?, "GEOFENCE ALERT", ?, "unread")',
            [parent_id, alertMessage]
          );

          if (caregiver_id) {
            await pool.query(
              'INSERT INTO notifications (user_id, title, message, status) VALUES (?, "GEOFENCE ALERT", ?, "unread")',
              [caregiver_id, alertMessage]
            );
          }

          // Create Alert record
          await pool.query(
            'INSERT INTO alerts (elderly_id, notification_id, description, date_time) VALUES (?, ?, ?, NOW())',
            [elderlyId, notifResult.insertId, alertMessage]
          );
        }
      }
    }

    res.status(201).json({
      message: 'Location recorded successfully.',
      status: 'success',
      data: {
        location_id: insertResult.insertId,
        elderly_id: elderlyId,
        latitude: lat,
        longitude: lon,
        geofence_checked: geofences.length > 0,
        geofence_breached: geofenceBreached,
        distance_to_center_meters: distanceToCenter
      }
    });
  } catch (error: any) {
    console.error('Update location error:', error);
    res.status(500).json({
      message: 'Internal server error updating location.',
      status: 'error'
    });
  }
}

/**
 * GET /api/locations/current/:elderlyId
 * Maps to UML: getCurrentLocation()
 */
export async function getCurrentLocation(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [rows]: any = await pool.query(
      'SELECT * FROM locations WHERE elderly_id = ? ORDER BY timestamp DESC LIMIT 1',
      [elderlyId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'No location data found for this elderly person.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error: any) {
    console.error('Get current location error:', error);
    res.status(500).json({
      message: 'Internal server error getting current location.',
      status: 'error'
    });
  }
}

/**
 * GET /api/locations/history/:elderlyId
 * Returns historical GPS coordinates.
 */
export async function getLocationHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const [rows]: any = await pool.query(
      'SELECT * FROM locations WHERE elderly_id = ? ORDER BY timestamp DESC LIMIT ?',
      [elderlyId, limit]
    );

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  } catch (error: any) {
    console.error('Get location history error:', error);
    res.status(500).json({
      message: 'Internal server error fetching location history.',
      status: 'error'
    });
  }
}

/**
 * POST /api/locations/distance
 * Maps to UML: calculateDistance()
 */
export function calculateDistance(req: Request, res: Response): void {
  try {
    const { lat1, lon1, lat2, lon2 } = req.body;

    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
      res.status(400).json({
        message: 'lat1, lon1, lat2, and lon2 are required numbers.',
        status: 'error'
      });
      return;
    }

    const distance = calculateDistanceMeters(Number(lat1), Number(lon1), Number(lat2), Number(lon2));

    res.status(200).json({
      status: 'success',
      distance_meters: distance,
      distance_km: Math.round((distance / 1000) * 100) / 100
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error calculating distance.', status: 'error' });
  }
}
