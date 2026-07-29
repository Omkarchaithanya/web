import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { paginationArgs, PaginationQuery } from '../validators/pagination.validator';

export class AlertService {
  static async getAll(isRead?: boolean, query: PaginationQuery = { page: 1, limit: 20 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const where = isRead !== undefined ? { isRead } : undefined;
    const [data, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take,
        include: {
          device: { select: { id: true, location: true } },
          zone: { select: { id: true, name: true } },
          resolver: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.alert.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  }

  static async getById(id: string) {
    const alert = await prisma.alert.findUnique({
      where: { id },
      include: { device: true, zone: true, resolver: true },
    });
    if (!alert) throw new AppError(404, 'Alert not found', 'NOT_FOUND');
    return alert;
  }

  static async create(data: Record<string, unknown>) {
    return prisma.alert.create({ data: data as any });
  }

  static async update(id: string, data: { isRead?: boolean; resolved?: boolean }, userId: string) {
    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) throw new AppError(404, 'Alert not found', 'NOT_FOUND');

    const updateData: Record<string, unknown> = {};
    if (data.isRead !== undefined) updateData.isRead = data.isRead;

    if (data.resolved) {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = userId;
      updateData.isRead = true;
    }

    return prisma.alert.update({
      where: { id },
      data: updateData,
    });
  }
}
