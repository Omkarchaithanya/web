import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { paginationArgs, PaginationQuery } from '../validators/pagination.validator';

export class DeviceService {
  static async getAll(query: PaginationQuery = { page: 1, limit: 20 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const [data, total] = await Promise.all([
      prisma.device.findMany({
        skip,
        take,
        include: {
          zone: { select: { id: true, name: true } },
        },
        orderBy: { id: 'asc' },
      }),
      prisma.device.count(),
    ]);
    return { data, pagination: { page, limit, total } };
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

  static async create(data: {
    id: string;
    zoneId: string;
    location: string;
    [key: string]: unknown;
  }) {
    const existing = await prisma.device.findUnique({ where: { id: data.id } });
    if (existing) throw new AppError(400, 'Device ID already exists', 'ALREADY_EXISTS');

    return prisma.device.create({ data: data as any });
  }

  static async update(id: string, data: Record<string, unknown>) {
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');

    return prisma.device.update({ where: { id }, data: data as any });
  }

  static async delete(id: string) {
    const device = await prisma.device.findUnique({ where: { id } });
    if (!device) throw new AppError(404, 'Device not found', 'NOT_FOUND');

    await prisma.device.delete({ where: { id } });
  }
}
