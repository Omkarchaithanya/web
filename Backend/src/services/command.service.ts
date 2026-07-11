import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { DeviceCommandType, UserRole } from '@prisma/client';

export class CommandService {
  static async getAll() {
    return prisma.deviceCommand.findMany({
      include: {
        device: { select: { id: true, location: true } },
        issuer: { select: { name: true, role: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const command = await prisma.deviceCommand.findUnique({
      where: { id },
      include: { device: true, issuer: true },
    });
    if (!command) throw new AppError(404, 'Command not found', 'NOT_FOUND');
    return command;
  }

  static async create(data: any, userId: string, userRole: UserRole) {
    // RBAC check: TECHNICIAN cannot issue RESTART or EMERGENCY_MODE
    if (userRole === 'TECHNICIAN' && (data.commandType === DeviceCommandType.RESTART || data.commandType === DeviceCommandType.EMERGENCY_MODE)) {
      throw new AppError(403, 'Technicians are not authorized to issue RESTART or EMERGENCY_MODE commands.', 'FORBIDDEN');
    }

    // Verify device exists if deviceId is provided
    if (data.deviceId) {
      const device = await prisma.device.findUnique({ where: { id: data.deviceId } });
      if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');
    }

    const command = await prisma.deviceCommand.create({
      data: {
        ...data,
        issuedBy: userId,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ISSUE_COMMAND',
        resource: 'DEVICE',
        resourceId: data.deviceId,
        metadata: { commandType: data.commandType, payload: data.payload },
      },
    });

    return command;
  }
}
