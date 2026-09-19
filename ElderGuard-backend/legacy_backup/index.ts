import { Router } from 'express';
import authRoutes from './auth.routes';
import elderlyRoutes from './elderly.routes';
import vitalsRoutes from './vitals.routes';
import alertsRoutes from './alerts.routes';
import careRoutes from './care.routes';
import telemetryRoutes from './telemetry.routes';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'ElderGuard Cloud Gateway & Care Processing Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/elderly', elderlyRoutes);
apiRouter.use('/elderly', vitalsRoutes); // Mounts /elderly/:id/vitals/latest & /elderly/:id/vitals/history
apiRouter.use('/alerts', alertsRoutes);
apiRouter.use('/care', careRoutes);
apiRouter.use('/telemetry', telemetryRoutes);

export default apiRouter;
