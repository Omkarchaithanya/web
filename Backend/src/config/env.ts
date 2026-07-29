import 'dotenv/config';
import { z } from 'zod';

const boolFromEnv = z.preprocess((v) => {
  if (v === undefined || v === null || v === '') return false;
  if (typeof v === 'boolean') return v;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}, z.boolean());

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
  JWT_ISSUER: z.string().default('urbantree-api'),
  JWT_AUDIENCE: z.string().default('urbantree-client'),

  IOT_API_KEY: z.string().min(32),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  ENQUIRY_NOTIFY_EMAIL: z.string().email().optional().or(z.literal('')).transform((v) => v || undefined),

  SEED_DEFAULT_PASSWORD: z.string().min(8).optional(),
  SEED_SUPER_EMAIL: z.string().email().optional(),
  SEED_GOVT_EMAIL: z.string().email().optional(),
  SEED_TECH_EMAIL: z.string().email().optional(),

  SENTRY_DSN: z.string().optional().default(''),
  TRUST_PROXY: boolFromEnv,
  REGISTER_MAP_CONFIRMED: boolFromEnv,
  SENSOR_RETENTION_DAYS: z.coerce.number().int().positive().default(30),

  AWS_REGION: z.string().default('ap-south-1'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  PLC_MODE: z.enum(['simulated', 'live']).default('simulated'),
  PLC_COM_PORT: z.string().default('COM1'),
  PLC_BAUD_RATE: z.coerce.number().default(9600),
  PLC_SLAVE_ID: z.coerce.number().default(1),
  PLC_POLL_INTERVAL_MS: z.coerce.number().default(5000),
});

export type Env = z.infer<typeof envSchema>;

function looksLikePlaceholder(value: string): boolean {
  return /CHANGE_ME|changeme|your[_-]?secret|placeholder/i.test(value);
}

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    console.error('Invalid environment configuration:', formatted);
    throw new Error('Environment validation failed. Check .env against .env.example');
  }

  const data = result.data;

  if (data.NODE_ENV === 'production') {
    if (
      looksLikePlaceholder(data.JWT_ACCESS_SECRET) ||
      looksLikePlaceholder(data.JWT_REFRESH_SECRET) ||
      looksLikePlaceholder(data.IOT_API_KEY)
    ) {
      throw new Error('Production secrets must not use placeholder values');
    }
    if (data.PLC_MODE === 'live' && !data.REGISTER_MAP_CONFIRMED) {
      throw new Error('PLC_MODE=live requires REGISTER_MAP_CONFIRMED=true');
    }
  }

  return data;
}

export const env = loadEnv();

export const corsOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

export const isProduction = env.NODE_ENV === 'production';
