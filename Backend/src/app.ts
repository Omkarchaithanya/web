import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { env, corsOrigins } from './config/env';
import { requestIdMiddleware } from './middleware/requestId';
import { globalRateLimiter } from './middleware/rateLimiter';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

// Route imports
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import zoneRoutes from './routes/zone.routes';
import deviceRoutes from './routes/device.routes';
import alertRoutes from './routes/alert.routes';
import insightRoutes from './routes/insight.routes';
import commandRoutes from './routes/command.routes';
import adminRoutes from './routes/admin.routes';
import enquiryRoutes from './routes/enquiry.routes';
import newsletterRoutes from './routes/newsletter.routes';


import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

Sentry.setupExpressErrorHandler(app);
// Security and utility middlewares
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    }
  },
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true,
}));
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(requestIdMiddleware);

// Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Apply global rate limiting
app.use(globalRateLimiter);

// Swagger Documentation
if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
app.use('/health', healthRoutes);
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/zones`, zoneRoutes);
app.use(`${env.API_PREFIX}/devices`, deviceRoutes);
app.use(`${env.API_PREFIX}/alerts`, alertRoutes);
app.use(`${env.API_PREFIX}/insights`, insightRoutes);
app.use(`${env.API_PREFIX}/commands`, commandRoutes);
app.use(`${env.API_PREFIX}/admin`, adminRoutes);
app.use(`${env.API_PREFIX}/enquiry`, enquiryRoutes);
app.use(`${env.API_PREFIX}/newsletter`, newsletterRoutes);

// Catch 404
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
