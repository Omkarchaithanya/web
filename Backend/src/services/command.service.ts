import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { DeviceCommandType, UserRole } from '@prisma/client';
import { paginationArgs, PaginationQuery } from '../validators/pagination.validator';
import { createAuditLog } from './audit.service';

export class CommandService {
  static async getAll(query: PaginationQuery = { page: 1, limit: 20 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const [data, total] = await Promise.all([
      prisma.deviceCommand.findMany({
        skip,
        take,
        include: {
          device: { select: { id: true, location: true } },
          issuer: { select: { name: true, role: true } },
        },
        orderBy: { issuedAt: 'desc' },
      }),
      prisma.deviceCommand.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  }

  static async getById(id: string) {
    const command = await prisma.deviceCommand.findUnique({
      where: { id },
      include: { device: true, issuer: true },
    });
    if (!command) throw new AppError(404, 'Command not found', 'NOT_FOUND');
    return command;
  }

  static async create(
    data: { commandType: DeviceCommandType; deviceId?: string; payload?: unknown },
    userId: string,
    userRole: UserRole,
  ) {
    if (
      userRole === 'TECHNICIAN' &&
      (data.commandType === DeviceCommandType.RESTART ||
        data.commandType === DeviceCommandType.EMERGENCY_MODE)
    ) {
      throw new AppError(
        403,
        'Technicians are not authorized to issue RESTART or EMERGENCY_MODE commands.',
        'FORBIDDEN',
      );
    }

    if (data.deviceId) {
      const device = await prisma.device.findUnique({ where: { id: data.deviceId } });
      if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');
    }

    const command = await prisma.deviceCommand.create({
      data: {
        commandType: data.commandType,
        deviceId: data.deviceId,
        payload: data.payload as any,
        issuedBy: userId,
      },
    });

    await createAuditLog({
      userId,
      action: 'ISSUE_COMMAND',
      resource: 'DEVICE',
      resourceId: data.deviceId,
      metadata: { commandType: data.commandType, payload: data.payload },
    });

    return command;
  }
}
