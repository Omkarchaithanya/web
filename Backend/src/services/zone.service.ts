import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { paginationArgs, PaginationQuery } from '../validators/pagination.validator';

export class ZoneService {
  static async getAll(query: PaginationQuery = { page: 1, limit: 20 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const [data, total] = await Promise.all([
      prisma.zone.findMany({
        skip,
        take,
        include: {
          _count: {
            select: { devices: true, alerts: { where: { isRead: false } } },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.zone.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  }

  static async getById(id: string) {
    const zone = await prisma.zone.findUnique({
      where: { id },
      include: { devices: true },
    });
    if (!zone) throw new AppError(404, 'Zone not found', 'NOT_FOUND');
    return zone;
  }

  static async create(data: Record<string, unknown>) {
    const slug = String(data.slug);
    const existing = await prisma.zone.findUnique({ where: { slug } });
    if (existing) throw new AppError(400, 'Zone slug already exists', 'ALREADY_EXISTS');

    return prisma.zone.create({ data: data as any });
  }

  static async update(id: string, data: Record<string, unknown>) {
    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) throw new AppError(404, 'Zone not found', 'NOT_FOUND');

    return prisma.zone.update({ where: { id }, data: data as any });
  }

  static async delete(id: string) {
    const zone = await prisma.zone.findUnique({
      where: { id },
      include: { _count: { select: { devices: true } } },
    });
    if (!zone) throw new AppError(404, 'Zone not found', 'NOT_FOUND');
    if (zone._count.devices > 0) {
      throw new AppError(409, 'Cannot delete zone while devices are attached', 'CONFLICT');
    }

    await prisma.zone.delete({ where: { id } });
  }
}
