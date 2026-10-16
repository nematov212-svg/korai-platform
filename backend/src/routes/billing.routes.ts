import { Router } from 'express';
import { billingController } from '../controllers/billing.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/usage', (req, res, next) => billingController.getUsage(req, res, next));

export default router;
