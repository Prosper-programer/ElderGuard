import { Request, Response } from 'express';
import { calculateDistanceMeters } from '../utils/geo';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Location, Geofence, ElderlyProfile, Notification, Alert } from '../models';

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
    const newLocation = await Location.create({
      elderly_id: elderlyId,
      latitude: lat,
      longitude: lon,
    });

    // 2. Check if a Geofence is active for this elderly person
    const geofence = await Geofence.findOne({
      where: { elderly_id: elderlyId, is_enabled: true }
    });

    let geofenceBreached = false;
    let distanceToCenter = 0;

    if (geofence) {
      distanceToCenter = calculateDistanceMeters(
        lat,
        lon,
        Number(geofence.center_latitude),
        Number(geofence.center_longitude)
      );

      // If distance exceeds allowed radius, trigger geofence breach alert!
      if (distanceToCenter > Number(geofence.radius)) {
        geofenceBreached = true;

        // Get parent and caregiver
        const profile = await ElderlyProfile.findByPk(elderlyId);

        if (profile) {
          const { parent_id, caregiver_id, full_name } = profile;
          const alertMessage = `GEOFENCE BREACH: ${full_name} is ${Math.round(distanceToCenter)}m away from center (Safe limit: ${geofence.radius}m).`;

          // Create notification for Parent
          const parentNotif = await Notification.create({
            user_id: parent_id,
            title: 'GEOFENCE ALERT',
            message: alertMessage,
            status: 'unread'
          });

          if (caregiver_id) {
            await Notification.create({
              user_id: caregiver_id,
              title: 'GEOFENCE ALERT',
              message: alertMessage,
              status: 'unread'
            });
          }

          // Create Alert record
          await Alert.create({
            elderly_id: elderlyId,
            notification_id: parentNotif.notification_id,
            description: alertMessage,
          });
        }
      }
    }

    res.status(201).json({
      message: 'Location recorded successfully.',
      status: 'success',
      data: {
        location_id: newLocation.location_id,
        elderly_id: elderlyId,
        latitude: lat,
        longitude: lon,
        geofence_checked: !!geofence,
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

    const loc = await Location.findOne({
      where: { elderly_id: elderlyId },
      order: [['timestamp', 'DESC']]
    });

    if (!loc) {
      res.status(404).json({ message: 'No location data found for this elderly person.', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: loc.toJSON()
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

    const rows = await Location.findAll({
      where: { elderly_id: elderlyId },
      order: [['timestamp', 'DESC']],
      limit
    });

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
