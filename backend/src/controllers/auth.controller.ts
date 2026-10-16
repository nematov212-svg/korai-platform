import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await authService.register(input);
      res.status(201).json({
        success: true,
        message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);
      res.status(200).json({
        success: true,
        message: 'Tizimga muvaffaqiyatli kirildi',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const input = refreshTokenSchema.parse(req.body);
      const result = await authService.refresh(input.refreshToken);
      res.status(200).json({
        success: true,
        message: 'Token muvaffaqiyatli yangilandi',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body?.refreshToken;
      await authService.logout(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Tizimdan muvaffaqiyatli chiqildi',
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.id);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
