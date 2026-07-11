import { prisma } from '../config/database';
import { AppError } from '../utils/http';

export class DeviceService {
  static async getAll() {
    return prisma.device.findMany({
      include: {
        zone: { select: { id: true, name: true } },
      },
    });
  }

  static async getById(id: string) {
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        zone: true,
        sensorReadings: {
          take: 10,
          orderBy: { recordedAt: 'desc' },
        },
        filterStatus: {
          take: 1,
          orderBy: { recordedAt: 'desc' },
        },
      },
    });
    if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');
    return device;
  }

  static async create(data: any) {
    const existing = await prisma.device.findUnique({ where: { id: data.id } });
    if (existing) throw new AppError(400, 'Device ID already exists', 'ALREADY_EXISTS');

    return prisma.device.create({ data });
  }

  static async update(id: string, data: any) {
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');

    return prisma.device.update({ where: { id }, data });
  }

  static async delete(id: string) {
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');

    await prisma.device.delete({ where: { id } });
  }
}
