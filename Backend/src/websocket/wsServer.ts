import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger';
import { verifyAccessToken } from '../utils/jwt';
import { WsBroadcaster } from './broadcast';

export function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: any) => {
    // 1. Authenticate connection
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      logger.warn('WS connection attempt without token');
      ws.close(4001, 'Unauthorized');
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      (ws as any).user = payload;
    } catch (err) {
      logger.warn('WS connection attempt with invalid token');
      ws.close(4001, 'Unauthorized');
      return;
    }

    logger.info(`WS Client connected: ${(ws as any).user.email}`);

    // Subscribe to global alerts by default
    WsBroadcaster.subscribe('alerts', ws);

    ws.on('message', (message: string) => {
      try {
        const parsed = JSON.parse(message);
        
        // Basic command handling over WS (e.g., subscribe to specific topics)
        if (parsed.action === 'subscribe' && parsed.topic) {
          WsBroadcaster.subscribe(parsed.topic, ws);
          ws.send(JSON.stringify({ event: 'subscribed', topic: parsed.topic }));
        }
        else if (parsed.action === 'unsubscribe' && parsed.topic) {
          WsBroadcaster.unsubscribe(parsed.topic, ws);
          ws.send(JSON.stringify({ event: 'unsubscribed', topic: parsed.topic }));
        }

      } catch (e) {
        logger.error('Invalid WS message received', e);
      }
    });

    ws.on('close', () => {
      logger.info(`WS Client disconnected: ${(ws as any).user.email}`);
      WsBroadcaster.removeClient(ws);
    });

    ws.on('error', (err) => {
      logger.error('WS client error', err);
      WsBroadcaster.removeClient(ws);
    });
  });

  // Heartbeat to keep connections alive
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  logger.info('WebSocket server attached to /ws');
}
