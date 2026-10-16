import { Request, Response, NextFunction } from 'express';
import { diagnosisService } from '../services/diagnosis.service.js';
import {
  createDiagnosisSchema,
  answerQuestionsSchema,
  feedbackSchema,
  queryDiagnosisSchema,
} from '../schemas/diagnosis.schema.js';
import { ApiError } from '../utils/errors.js';

export class DiagnosisController {
  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createDiagnosisSchema.parse(req.body);
      const session = await diagnosisService.createSession(req.user!.id, input);
      res.status(201).json({
        success: true,
        message: 'Tashxis seansi yaratildi',
        data: { session },
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

      if (files.length === 0) {
        throw ApiError.badRequest('Fayllar yuklanmadi');
      }

      const images = await diagnosisService.uploadSessionImages(req.user!.id, id, files);
      res.status(200).json({
        success: true,
        message: `${images.length} ta rasm muvaffaqiyatli yuklandi`,
        data: { images },
      });
    } catch (err) {
      next(err);
    }
  }

  async analyzeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const session = await diagnosisService.runAiAnalysis(req.user!.id, id);
      res.status(200).json({
        success: true,
        message: 'AI tashxisi muvaffaqiyatli yakunlandi',
        data: { session },
      });
    } catch (err) {
      next(err);
    }
  }

  async answerQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = answerQuestionsSchema.parse(req.body);
      const session = await diagnosisService.answerFollowUpQuestions(req.user!.id, id, input);
      res.status(200).json({
        success: true,
        message: 'Javoblar qabul qilindi va tahlil yangilandi',
        data: { session },
      });
    } catch (err) {
      next(err);
    }
  }

  async listSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = queryDiagnosisSchema.parse(req.query);
      const result = await diagnosisService.listSessions(req.user!.id, query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const session = await diagnosisService.getSession(req.user!.id, id);
      res.status(200).json({
        success: true,
        data: { session },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await diagnosisService.deleteSession(req.user!.id, id);
      res.status(200).json({
        success: true,
        message: 'Tashxis va unga tegishli rasmlar muvaffaqiyatli o‘chirildi',
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await diagnosisService.toggleFavorite(req.user!.id, id);
      res.status(200).json({
        success: true,
        message: result.isFavorite ? 'Saralanganlarga qo‘shildi' : 'Saralanganlardan chiqarildi',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = feedbackSchema.parse(req.body);
      const feedback = await diagnosisService.submitFeedback(req.user!.id, id, input);
      res.status(200).json({
        success: true,
        message: 'Fikr-mulohazangiz uchun tashakkur',
        data: { feedback },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const diagnosisController = new DiagnosisController();
