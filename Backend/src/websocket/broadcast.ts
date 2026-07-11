import { WebSocket } from 'ws';
import { logger } from '../utils/logger';

// Store connected clients grouped by topic
const topics = new Map<string, Set<WebSocket>>();

export class WsBroadcaster {
  /**
   * Subscribe a client to a topic
   */
  static subscribe(topic: string, ws: WebSocket) {
    if (!topics.has(topic)) {
      topics.set(topic, new Set());
    }
    topics.get(topic)!.add(ws);
    logger.debug(`WS client subscribed to topic: ${topic}`);
  }

  /**
   * Unsubscribe a client from a topic
   */
  static unsubscribe(topic: string, ws: WebSocket) {
    const clients = topics.get(topic);
    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        topics.delete(topic);
      }
    }
  }

  /**
   * Broadcast a message to all clients subscribed to a topic
   */
  static broadcast(topic: string, event: string, data: any) {
    const clients = topics.get(topic);
    if (!clients) return;

    const payload = JSON.stringify({ topic, event, data });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Remove client from all topics
   */
  static removeClient(ws: WebSocket) {
    topics.forEach((clients, topic) => {
      if (clients.has(ws)) {
        this.unsubscribe(topic, ws);
      }
    });
  }
}
