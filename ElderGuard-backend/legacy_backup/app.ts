import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';

export const createApp = () => {
  const app = express();

  // Security & Logging Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root welcome
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'ElderGuard Backend API',
      description: 'Intelligent Elderly Monitoring, Fall Detection & Care Ecosystem',
      apiDocs: '/api/v1/health',
      timestamp: new Date().toISOString(),
    });
  });

  // API v1 Routes
  app.use('/api/v1', apiRouter);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};
