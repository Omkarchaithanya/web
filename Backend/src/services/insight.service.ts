import { prisma } from '../config/database';
import { AppError } from '../utils/http';

export class InsightService {
  static async getAll() {
    return prisma.aiInsight.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      include: {
        zone: { select: { id: true, name: true } },
        device: { select: { id: true, location: true } },
      },
      orderBy: { predictedAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const insight = await prisma.aiInsight.findUnique({
      where: { id },
      include: { zone: true, device: true },
    });
    if (!insight) throw new AppError(404, 'Insight not found', 'NOT_FOUND');
    return insight;
  }

  static async create(data: any) {
    return prisma.aiInsight.create({ data });
  }

  static async delete(id: string) {
    const insight = await prisma.aiInsight.findUnique({ where: { id } });
    if (!insight) throw new AppError(404, 'Insight not found', 'NOT_FOUND');

    await prisma.aiInsight.delete({ where: { id } });
  }
}
