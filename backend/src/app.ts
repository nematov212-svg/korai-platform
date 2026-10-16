import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/index.js';
import { generalLimiter } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import diagnosisRoutes from './routes/diagnosis.routes.js';
import billingRoutes from './routes/billing.routes.js';
import healthRoutes from './routes/health.routes.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request logging
  if (config.env !== 'test') {
    app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
  }

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads serving
  const uploadDir = path.resolve(process.cwd(), config.storage.uploadDir);
  app.use('/uploads', express.static(uploadDir));

  // General rate limiting on all API routes
  app.use(config.apiPrefix, generalLimiter);

  // Health check endpoint (both on /health and /api/v1/health)
  app.use('/health', healthRoutes);
  app.use(`${config.apiPrefix}/health`, healthRoutes);

  // API v1 Routes
  app.use(`${config.apiPrefix}/auth`, authRoutes);
  app.use(`${config.apiPrefix}/diagnoses`, diagnosisRoutes);
  app.use(`${config.apiPrefix}/billing`, billingRoutes);

  // 404 for unmatched API routes
  app.use(`${config.apiPrefix}/*`, (_req, res) => {
    res.status(404).json({
      success: false,
      error: { message: 'Bunday API oxirgi nuqtasi (endpoint) topilmadi' },
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
