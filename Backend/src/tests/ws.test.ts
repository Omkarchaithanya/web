import http from 'http';
import WebSocket from 'ws';
import { attachWebSocketServer } from '../websocket/wsServer';
import * as jwtUtils from '../utils/jwt';

jest.mock('../config/env', () => ({
  env: {
    NODE_ENV: 'test',
  }
}));

jest.mock('../utils/jwt');

describe('WebSocket Auth', () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = http.createServer();
    attachWebSocketServer(server);
    server.listen(0, () => {
      port = (server.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject connection without token', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}/ws`);
    ws.on('close', (code, reason) => {
      expect(code).toBe(4001);
      expect(reason.toString()).toBe('Unauthorized');
      done();
    });
  });

  it('should reject connection with invalid token', (done) => {
    (jwtUtils.verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const ws = new WebSocket(`ws://localhost:${port}/ws?token=invalid`);
    ws.on('close', (code, reason) => {
      expect(code).toBe(4001);
      expect(reason.toString()).toBe('Unauthorized');
      done();
    });
  });

  it('should accept connection with valid token', (done) => {
    (jwtUtils.verifyAccessToken as jest.Mock).mockReturnValue({ email: 'test@example.com' });

    const ws = new WebSocket(`ws://localhost:${port}/ws?token=valid`);
    ws.on('open', () => {
      ws.close();
      done();
    });
  });
});
