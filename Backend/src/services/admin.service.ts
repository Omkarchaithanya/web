import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { paginationArgs, PaginationQuery } from '../validators/pagination.validator';

export class AdminService {
  static async getAllUsers(query: PaginationQuery = { page: 1, limit: 20 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          region: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  }

  static async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    region?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(400, 'Email already exists', 'ALREADY_EXISTS');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password: _password, ...rest } = data;

    const user = await prisma.user.create({
      data: {
        ...rest,
        passwordHash,
      },
    });

    const { passwordHash: _ph, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateUser(
    id: string,
    data: Partial<{ email: string; name: string; role: UserRole; isActive: boolean }>,
  ) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, 'User not found', 'NOT_FOUND');

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    const { passwordHash: _ph, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  static async getAuditLogs(query: PaginationQuery = { page: 1, limit: 50 }) {
    const { page, limit, skip, take } = paginationArgs(query);
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, name: true } },
        },
      }),
      prisma.auditLog.count(),
    ]);
    return { data, pagination: { page, limit, total } };
  }
}
