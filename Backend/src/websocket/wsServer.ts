import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { UserRole } from '@prisma/client';
import { logger } from '../utils/logger';
import { verifyAccessToken } from '../utils/jwt';
import { WsBroadcaster } from './broadcast';

type AuthedSocket = WebSocket & {
  user?: { sub: string; email: string; role: UserRole };
};

const ALLOWED_TOPIC_PREFIXES = ['alerts', 'device:', 'zone:'];

function extractToken(req: { url?: string; headers: Record<string, unknown> }): string | null {
  const protocols = String(req.headers['sec-websocket-protocol'] || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  // Preferred: Sec-WebSocket-Protocol: urbantree, <jwt>
  if (protocols.length >= 2 && protocols[0] === 'urbantree') {
    return protocols[1];
  }
  // Also accept: access_token,<jwt>
  if (protocols.length >= 2 && protocols[0] === 'access_token') {
    return protocols[1];
  }

  const url = new URL(req.url || '', 'http://localhost');
  const queryToken = url.searchParams.get('token');
  if (queryToken) {
    logger.warn('WS auth via query token is deprecated; use Sec-WebSocket-Protocol');
    return queryToken;
  }
  return null;
}

function canSubscribe(role: UserRole, topic: string): boolean {
  if (!ALLOWED_TOPIC_PREFIXES.some((p) => topic === p || topic.startsWith(p))) {
    return false;
  }
  if (role === 'SUPER_ADMIN' || role === 'GOVT_ADMIN') return true;
  // Technicians: alerts + any device/zone topic (device-level ACL can be tightened later)
  if (role === 'TECHNICIAN') {
    return topic === 'alerts' || topic.startsWith('device:') || topic.startsWith('zone:');
  }
  return false;
}

export function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  wss.on('connection', (ws: AuthedSocket, req) => {
    const token = extractToken(req as any);

    if (!token) {
      logger.warn('WS connection attempt without token');
      ws.close(4001, 'Unauthorized');
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      ws.user = payload as AuthedSocket['user'];
    } catch {
      logger.warn('WS connection attempt with invalid token');
      ws.close(4001, 'Unauthorized');
      return;
    }

    logger.info(`WS Client connected: ${ws.user?.email}`);
    WsBroadcaster.subscribe('alerts', ws);

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(String(message));
        if (parsed.action === 'subscribe' && parsed.topic) {
          if (!ws.user || !canSubscribe(ws.user.role, parsed.topic)) {
            ws.send(JSON.stringify({ event: 'error', message: 'Topic not allowed' }));
            return;
          }
          WsBroadcaster.subscribe(parsed.topic, ws);
          ws.send(JSON.stringify({ event: 'subscribed', topic: parsed.topic }));
        } else if (parsed.action === 'unsubscribe' && parsed.topic) {
          WsBroadcaster.unsubscribe(parsed.topic, ws);
          ws.send(JSON.stringify({ event: 'unsubscribed', topic: parsed.topic }));
        }
      } catch (e) {
        logger.error('Invalid WS message received', e);
      }
    });

    ws.on('close', () => {
      logger.info(`WS Client disconnected: ${ws.user?.email}`);
      WsBroadcaster.removeClient(ws);
    });

    ws.on('error', (err) => {
      logger.error('WS client error', err);
      WsBroadcaster.removeClient(ws);
    });
  });

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
