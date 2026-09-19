import { Request, Response, NextFunction } from 'express';
import { RulesEngineService } from '../services/rulesEngine.service';
import { sendSuccess, sendError } from '../utils/response';
import { prisma } from '../utils/prisma';

export class TelemetryController {
  public static async ingest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RulesEngineService.processTelemetry(req.body);
      sendSuccess(res, result, 'Telemetry ingested and processed successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async simulate(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyId, anomalyType } = req.body;
      
      // Default to the first elderly profile if not specified
      let targetElderlyId = elderlyId;
      if (!targetElderlyId) {
        const first = await prisma.elderlyProfile.findFirst();
        targetElderlyId = first?.id;
      }

      if (!targetElderlyId) {
        sendError(res, 'No elderly profile found to simulate against.', 404);
        return;
      }

      let payload: any = {
        elderlyId: targetElderlyId,
        deviceId: 'EG-IOT-4892',
        batteryPct: 84,
        steps: 1450,
        activity: 'Resting',
        location: {
          latitude: 51.5074,
          longitude: -0.1278,
          geofenceZone: 'Living Room',
        },
      };

      switch (anomalyType) {
        case 'fall':
          payload = {
            ...payload,
            heartRate: 104,
            spo2: 96,
            temperature: 36.8,
            gForce: 3.42,
            fallDetected: true,
            activity: 'Sudden Inactivity',
          };
          break;
        case 'tachycardia':
          payload = {
            ...payload,
            heartRate: 128,
            spo2: 97,
            temperature: 37.1,
            gForce: 1.02,
            fallDetected: false,
            activity: 'Resting',
          };
          break;
        case 'lowOxygen':
          payload = {
            ...payload,
            heartRate: 78,
            spo2: 89,
            temperature: 36.7,
            gForce: 1.01,
            fallDetected: false,
          };
          break;
        case 'normal':
        default:
          payload = {
            ...payload,
            heartRate: 72,
            spo2: 98,
            temperature: 36.7,
            gForce: 1.01,
            fallDetected: false,
          };
          break;
      }

      const result = await RulesEngineService.processTelemetry(payload);
      sendSuccess(res, result, `Simulation '${anomalyType}' processed successfully`);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
