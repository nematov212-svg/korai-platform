import { Request, Response, NextFunction } from 'express';
import { billingService } from '../services/billing.service.js';

export class BillingController {
  async getUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await billingService.getUsageSummary(req.user!.id);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const billingController = new BillingController();
