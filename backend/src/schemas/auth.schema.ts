import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak').max(80),
  email: z.string().email('Noto‘g‘ri email formati'),
  password: z
    .string()
    .min(8, 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak')
    .max(100)
    .regex(/[A-Za-z]/, 'Parolda kamida bitta harf bo‘lishi kerak')
    .regex(/[0-9]/, 'Parolda kamida bitta raqam bo‘lishi kerak'),
});

export const loginSchema = z.object({
  email: z.string().email('Noto‘g‘ri email formati'),
  password: z.string().min(1, 'Parol kiritilishi shart'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token talab qilinadi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
