import http from 'http';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import WebSocket from 'ws';
import { attachWebSocketServer } from '../websocket/wsServer';
import * as jwtUtils from '../utils/jwt';

vi.mock('../utils/jwt', () => ({
  verifyAccessToken: vi.fn(),
}));

describe('WebSocket Auth', () => {
  let server: http.Server;
  let port: number;

  beforeAll(async () => {
    server = http.createServer();
    attachWebSocketServer(server);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        port = (server.address() as any).port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('rejects connection without token', async () => {
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
      ws.on('close', (code) => {
        expect(code).toBe(4001);
        resolve();
      });
      ws.on('error', () => {
        /* expected during reject */
      });
      setTimeout(() => reject(new Error('timeout')), 3000);
    });
  });

  it('rejects connection with invalid token', async () => {
    (jwtUtils.verifyAccessToken as any).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws?token=invalid`);
      ws.on('close', (code) => {
        expect(code).toBe(4001);
        resolve();
      });
      ws.on('error', () => {});
      setTimeout(() => reject(new Error('timeout')), 3000);
    });
  });

  it('accepts connection with valid query token (deprecated)', async () => {
    (jwtUtils.verifyAccessToken as any).mockReturnValue({
      sub: 'u1',
      email: 'test@example.com',
      role: 'SUPER_ADMIN',
      type: 'access',
    });

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws?token=valid`);
      ws.on('open', () => {
        ws.close();
        resolve();
      });
      ws.on('error', reject);
      setTimeout(() => reject(new Error('timeout')), 3000);
    });
  });

  it('accepts connection via Sec-WebSocket-Protocol', async () => {
    (jwtUtils.verifyAccessToken as any).mockReturnValue({
      sub: 'u1',
      email: 'test@example.com',
      role: 'SUPER_ADMIN',
      type: 'access',
    });

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`, ['urbantree', 'valid-jwt']);
      ws.on('open', () => {
        ws.close();
        resolve();
      });
      ws.on('error', reject);
      setTimeout(() => reject(new Error('timeout')), 3000);
    });
  });
});
