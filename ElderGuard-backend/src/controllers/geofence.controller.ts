import { Response } from 'express';
import pool from '../config/database';
import { calculateDistanceMeters } from '../utils/geo';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * GEOFENCE CONTROLLER
 * 
 * Maps to UML: Geofence
 * Attributes: geofenceId, radius
 * Methods:
 * - createGeofence()
 * - updateGeofence()
 * - enableGeofence()
 * - disableGeofence()
 * - checkBoundary()
 */

/**
 * POST /api/geofences
 * Parent creates or replaces a geofence safe zone for an elderly person.
 * Maps to UML: createGeofence()
 */
export async function createGeofence(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parentId = req.user?.userId;
    const { elderlyId, centerLatitude, centerLongitude, radius } = req.body;

    if (!elderlyId || centerLatitude === undefined || centerLongitude === undefined || !radius) {
      res.status(400).json({
        message: 'elderlyId, centerLatitude, centerLongitude, and radius are required.',
        status: 'error'
      });
      return;
    }

    if (Number(radius) <= 0) {
      res.status(400).json({ message: 'Radius must be a positive number of meters.', status: 'error' });
      return;
    }

    // Verify parent manages this elderly person
    const [profiles]: any = await pool.query(
      'SELECT elderly_id FROM elderly_profiles WHERE elderly_id = ? AND parent_id = ?',
      [elderlyId, parentId]
    );

    if (profiles.length === 0) {
      res.status(403).json({ message: 'Forbidden: You do not manage this elderly person.', status: 'error' });
      return;
    }

    // Upsert geofence (Insert or update if already exists)
    await pool.query(
      `INSERT INTO geofences (elderly_id, center_latitude, center_longitude, radius, is_enabled)
       VALUES (?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE
        center_latitude = VALUES(center_latitude),
        center_longitude = VALUES(center_longitude),
        radius = VALUES(radius),
        is_enabled = TRUE`,
      [elderlyId, centerLatitude, centerLongitude, radius]
    );

    res.status(201).json({
      message: 'Geofence configured successfully.',
      status: 'success',
      data: {
        elderly_id: elderlyId,
        center_latitude: centerLatitude,
        center_longitude: centerLongitude,
        radius: Number(radius),
        is_enabled: true
      }
    });
  } catch (error: any) {
    console.error('Create geofence error:', error);
    res.status(500).json({
      message: 'Internal server error configuring geofence.',
      status: 'error'
    });
  }
}

/**
 * GET /api/geofences/:elderlyId
 * Retrieves geofence configuration for an elderly person.
 */
export async function getGeofence(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [rows]: any = await pool.query(
      'SELECT * FROM geofences WHERE elderly_id = ?',
      [elderlyId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'No geofence configured for this elderly person.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error: any) {
    console.error('Get geofence error:', error);
    res.status(500).json({
      message: 'Internal server error fetching geofence.',
      status: 'error'
    });
  }
}

/**
 * PATCH /api/geofences/:elderlyId/enable
 * Maps to UML: enableGeofence()
 */
export async function enableGeofence(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [result]: any = await pool.query(
      'UPDATE geofences SET is_enabled = TRUE WHERE elderly_id = ?',
      [elderlyId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Geofence not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      message: 'Geofence enabled successfully.',
      status: 'success',
      elderly_id: elderlyId,
      is_enabled: true
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error enabling geofence.', status: 'error' });
  }
}

/**
 * PATCH /api/geofences/:elderlyId/disable
 * Maps to UML: disableGeofence()
 */
export async function disableGeofence(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);

    const [result]: any = await pool.query(
      'UPDATE geofences SET is_enabled = FALSE WHERE elderly_id = ?',
      [elderlyId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Geofence not found.', status: 'error' });
      return;
    }

    res.status(200).json({
      message: 'Geofence disabled successfully.',
      status: 'success',
      elderly_id: elderlyId,
      is_enabled: false
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error disabling geofence.', status: 'error' });
  }
}

/**
 * POST /api/geofences/:elderlyId/check-boundary
 * Maps to UML: checkBoundary()
 * Evaluates current position against configured geofence radius.
 */
export async function checkBoundary(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const elderlyId = Number(req.params.elderlyId);
    const { latitude, longitude } = req.body;

    const [rows]: any = await pool.query('SELECT * FROM geofences WHERE elderly_id = ?', [elderlyId]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'No geofence configured for this elderly person.', status: 'error' });
      return;
    }

    const gf = rows[0];
    const distance = calculateDistanceMeters(
      Number(latitude),
      Number(longitude),
      Number(gf.center_latitude),
      Number(gf.center_longitude)
    );

    const isInside = distance <= Number(gf.radius);

    res.status(200).json({
      status: 'success',
      data: {
        elderly_id: elderlyId,
        distance_meters: distance,
        allowed_radius_meters: Number(gf.radius),
        is_inside_boundary: isInside,
        is_geofence_active: Boolean(gf.is_enabled)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error checking boundary.', status: 'error' });
  }
}
