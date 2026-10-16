import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../prisma.js';
import { ApiError } from '../utils/errors.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Kirish uchun token taqdim etilmadi'));
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token muddati tugagan. Iltimos, yangilang'));
      }
      return next(ApiError.unauthorized('Noto‘g‘ri yoki buzilgan token'));
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, plan: true },
    });

    if (!user) {
      return next(ApiError.unauthorized('Foydalanuvchi hisobi topilmadi'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Ushbu resursga kirish huquqi yo‘q'));
    }
    next();
  };
}
