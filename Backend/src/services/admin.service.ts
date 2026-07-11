import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import bcrypt from 'bcryptjs';

export class AdminService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true, region: true, isActive: true, lastLoginAt: true, createdAt: true,
      },
    });
  }

  static async createUser(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(400, 'Email already exists', 'ALREADY_EXISTS');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password, ...rest } = data;

    const user = await prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
    });

    const { passwordHash: _ph, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateUser(id: string, data: any) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, 'User not found', 'NOT_FOUND');

    const updated = await prisma.user.update({
      where: { id },
      data,
    });
    
    const { passwordHash: _ph, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  static async getAuditLogs(limit: number = 50) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
      },
    });
  }
}
