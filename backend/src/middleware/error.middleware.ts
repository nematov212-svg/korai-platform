import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/errors.js';
import { config } from '../config/index.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return _next(err);
  }

  // 1. Handled ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        message: 'Kiritilgan ma’lumotlar tekshiruvdan o‘tmadi',
        details: formattedErrors,
      },
    });
  }

  // 3. Prisma Unique Constraint or Not Found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      return res.status(409).json({
        success: false,
        error: {
          message: `Bu ${target.join(', ') || 'qiymat'} bilan yozuv allaqachon mavjud`,
        },
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Qidirilgan yozuv ma’lumotlar bazasida topilmadi',
        },
      });
    }
  }

  // 4. Multer Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Fayl hajmi ruxsat etilgan me’yordan (${config.storage.maxFileSizeMb}MB) katta`,
        },
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        message: `Fayl yuklashda xatolik: ${err.message}`,
      },
    });
  }

  // 5. Unhandled Internal Server Errors
  console.error('Unhandled server error:', err);
  const isDev = config.env === 'development';
  return res.status(500).json({
    success: false,
    error: {
      message: 'Serverda kutilmagan xatolik yuz berdi',
      ...(isDev ? { stack: err.stack, raw: err.message } : {}),
    },
  });
}
