import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { swaggerSpec } from './config/swagger';
import { env, corsOrigins } from './config/env';
import { requestIdMiddleware } from './middleware/requestId';
import { globalRateLimiter } from './middleware/rateLimiter';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

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
import iotRoutes from './routes/iot.routes';

const app = express();

if (env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

Sentry.init({
  dsn: env.SENTRY_DSN || undefined,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
      },
    },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
  })
);
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

if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(globalRateLimiter);

if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health status
 */
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
app.use(`${env.API_PREFIX}/iot`, iotRoutes);

app.use(notFoundHandler);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

export default app;
