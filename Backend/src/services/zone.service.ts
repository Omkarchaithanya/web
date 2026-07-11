import { prisma } from '../config/database';
import { AppError } from '../utils/http';

export class ZoneService {
  static async getAll() {
    return prisma.zone.findMany({
      include: {
        _count: {
          select: { devices: true, alerts: { where: { isRead: false } } },
        },
      },
    });
  }

  static async getById(id: string) {
    const zone = await prisma.zone.findUnique({
      where: { id },
      include: { devices: true },
    });
    if (!zone) throw new AppError(404, 'Zone not found', 'NOT_FOUND');
    return zone;
  }

  static async create(data: any) {
    const existing = await prisma.zone.findUnique({ where: { slug: data.slug } });
    if (existing) throw new AppError(400, 'Zone slug already exists', 'ALREADY_EXISTS');

    return prisma.zone.create({ data });
  }

  static async update(id: string, data: any) {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) throw new AppError(404, 'Zone not found', 'NOT_FOUND');

    return prisma.zone.update({ where: { id }, data });
  }

  static async delete(id: string) {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) throw new AppError(404, 'Zone not found', 'NOT_FOUND');

    await prisma.zone.delete({ where: { id } });
  }
}
