import { Router } from 'express';
import { diagnosisController } from '../controllers/diagnosis.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rate-limit.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// All diagnosis routes require authentication
router.use(authenticate);

router.post('/', (req, res, next) => diagnosisController.createSession(req, res, next));
router.get('/', (req, res, next) => diagnosisController.listSessions(req, res, next));
router.get('/:id', (req, res, next) => diagnosisController.getSession(req, res, next));
router.delete('/:id', (req, res, next) => diagnosisController.deleteSession(req, res, next));
router.post('/:id/favorite', (req, res, next) => diagnosisController.toggleFavorite(req, res, next));
router.post('/:id/feedback', (req, res, next) => diagnosisController.submitFeedback(req, res, next));

// Image upload (up to 5 files)
router.post(
  '/:id/images',
  upload.array('images', 5),
  (req, res, next) => diagnosisController.uploadImages(req, res, next)
);

// AI analysis and follow-up answer execution with AI rate limiter
router.post(
  '/:id/analyze',
  aiLimiter,
  (req, res, next) => diagnosisController.analyzeSession(req, res, next)
);

router.post(
  '/:id/answers',
  aiLimiter,
  (req, res, next) => diagnosisController.answerQuestions(req, res, next)
);

export default router;
