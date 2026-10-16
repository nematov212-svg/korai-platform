import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'So‘rovlar soni oshib ketdi. Iltimos, birozdan keyin qayta urinib ko‘ring.',
    },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // max 30 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Kirish urinishlari soni oshib ketdi. Xavfsizlik yuzasidan 15 daqiqadan so‘ng urinib ko‘ring.',
    },
  },
});

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.aiMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit per authenticated user ID if logged in, otherwise by IP
    return req.user?.id || req.ip || 'anonymous';
  },
  message: {
    success: false,
    error: {
      message: 'AI tahlil so‘rovlari me’yori tugadi. Iltimos, 15 daqiqadan so‘ng yangi tahlil boshlang.',
    },
  },
});
