import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api/v1'),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  IOT_API_KEY: z.string().min(32),

  CORS_ORIGIN: z.string().default('http://localhost:8000'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  ENQUIRY_NOTIFY_EMAIL: z.string().email().optional(),

  AWS_REGION: z.string().default('ap-south-1'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  PLC_MODE: z.enum(['simulated', 'live']).default('simulated'),
  PLC_COM_PORT: z.string().default('COM1'),
  PLC_BAUD_RATE: z.coerce.number().default(9600),
  PLC_SLAVE_ID: z.coerce.number().default(1),
  PLC_POLL_INTERVAL_MS: z.coerce.number().default(5000),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    console.error('Invalid environment configuration:', formatted);
    throw new Error('Environment validation failed. Check .env against .env.example');
  }
  return result.data;
}

export const env = loadEnv();

export const corsOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

export const isProduction = env.NODE_ENV === 'production';
