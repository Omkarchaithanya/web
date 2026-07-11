import { prisma } from '../config/database';
import { AppError } from '../utils/http';

export class AlertService {
  static async getAll(isRead?: boolean) {
    return prisma.alert.findMany({
      where: isRead !== undefined ? { isRead } : undefined,
      include: {
        device: { select: { id: true, location: true } },
        zone: { select: { id: true, name: true } },
        resolver: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const alert = await prisma.alert.findUnique({
      where: { id },
      include: { device: true, zone: true, resolver: true },
    });
    if (!alert) throw new AppError(404, 'Alert not found', 'NOT_FOUND');
    return alert;
  }

  static async create(data: any) {
    return prisma.alert.create({ data });
  }

  static async update(id: string, data: any, userId: string) {
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) throw new AppError(404, 'Alert not found', 'NOT_FOUND');

    const updateData: any = {};
    if (data.isRead !== undefined) updateData.isRead = data.isRead;
    
    if (data.resolved) {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = userId;
      updateData.isRead = true; // resolving auto-reads it
    }

    return prisma.alert.update({
      where: { id },
      data: updateData,
    });
  }
}
