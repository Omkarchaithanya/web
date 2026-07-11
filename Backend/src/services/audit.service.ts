import { prisma } from '../config/database';
import { logger } from '../utils/logger';

interface AuditEntry {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        metadata: (entry.metadata ?? undefined) as any,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    logger.error('Failed to write audit log', {
      error: error instanceof Error ? error.message : 'Unknown',
      entry,
    });
  }
}

export function getClientMeta(req: { ip?: string; headers: Record<string, unknown> }) {
  return {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] as string | undefined,
  };
}
