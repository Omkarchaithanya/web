process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://urbantree:test@localhost:5432/urbantree_test?schema=public';
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'test_access_secret_min_32_chars_xxxxxx';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_min_32_chars_xxxxx';
process.env.IOT_API_KEY = process.env.IOT_API_KEY || 'test_iot_api_key_min_32_chars_xxxxxxx';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
process.env.PLC_MODE = 'simulated';
process.env.TRUST_PROXY = 'false';
process.env.REGISTER_MAP_CONFIRMED = 'false';
process.env.SENTRY_DSN = '';

import { vi } from 'vitest';

vi.mock('@sentry/node', () => ({
  init: vi.fn(),
  setupExpressErrorHandler: vi.fn(),
}));

vi.mock('@sentry/profiling-node', () => ({
  nodeProfilingIntegration: vi.fn(() => ({})),
}));
