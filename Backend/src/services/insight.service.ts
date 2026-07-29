import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { paginationArgs, PaginationQuery } from '../validators/pagination.validator';

export class InsightService {
  static async getAll(query: PaginationQuery = { page: 1, limit: 20 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const where = { expiresAt: { gt: new Date() } };
    const [data, total] = await Promise.all([
      prisma.aiInsight.findMany({
        where,
        skip,
        take,
        include: {
          zone: { select: { id: true, name: true } },
          device: { select: { id: true, location: true } },
        },
        orderBy: { predictedAt: 'desc' },
      }),
      prisma.aiInsight.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  }

  static async getById(id: string) {
    const insight = await prisma.aiInsight.findUnique({
      where: { id },
      include: { zone: true, device: true },
    });
    if (!insight) throw new AppError(404, 'Insight not found', 'NOT_FOUND');
    return insight;
  }

  static async create(data: Record<string, unknown>) {
    return prisma.aiInsight.create({ data: data as any });
  }

  static async delete(id: string) {
    const insight = await prisma.aiInsight.findUnique({ where: { id } });
    if (!insight) throw new AppError(404, 'Insight not found', 'NOT_FOUND');

    await prisma.aiInsight.delete({ where: { id } });
  }
}
