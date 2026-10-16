import bcrypt from 'bcryptjs';
import { prisma } from '../prisma.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { ApiError } from '../utils/errors.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/jwt.js';

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw ApiError.badRequest('Ushbu email bilan ro‘yxatdan o‘tgan foydalanuvchi mavjud');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    });

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt,
      },
    });

    return { user, accessToken, refreshToken };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw ApiError.unauthorized('Email yoki parol noto‘g‘ri kiritildi');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Email yoki parol noto‘g‘ri kiritildi');
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt,
      },
    });

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      createdAt: user.createdAt,
    };

    return { user: userSafe, accessToken, refreshToken };
  }

  async refresh(rawRefreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch (err) {
      throw ApiError.unauthorized('Refresh token yaroqsiz yoki muddati tugagan');
    }

    const hashed = hashToken(rawRefreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashed },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token bekor qilingan yoki topilmadi');
    }

    // Revoke old token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, plan: true },
    });

    if (!user) {
      throw ApiError.unauthorized('Foydalanuvchi topilmadi');
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(newRefreshToken),
        userId: user.id,
        expiresAt,
      },
    });

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const hashed = hashToken(rawRefreshToken);
      await prisma.refreshToken
        .update({
          where: { tokenHash: hashed },
          data: { revoked: true },
        })
        .catch(() => {});
    }
    return { success: true };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('Foydalanuvchi topilmadi');
    }

    return user;
  }
}

export const authService = new AuthService();
