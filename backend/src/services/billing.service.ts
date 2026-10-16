import { prisma } from '../prisma.js';
import { ApiError } from '../utils/errors.js';

export const PLAN_LIMITS: Record<string, { monthlyDiagnoses: number; maxImagesPerSession: number; title: string }> = {
  FREE: {
    monthlyDiagnoses: 5,
    maxImagesPerSession: 3,
    title: 'Bepul Tarif',
  },
  PRO: {
    monthlyDiagnoses: 100,
    maxImagesPerSession: 5,
    title: 'Pro Mutaxassis',
  },
  ENTERPRISE: {
    monthlyDiagnoses: 10000,
    maxImagesPerSession: 5,
    title: 'Korxona va Servis Markazi',
  },
};

export class BillingService {
  getCurrentMonthYear(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  async checkQuota(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user) {
      throw ApiError.unauthorized();
    }

    const plan = user.plan || 'FREE';
    const limit = PLAN_LIMITS[plan]?.monthlyDiagnoses ?? 5;

    const currentMonth = this.getCurrentMonthYear();
    const usedCount = await prisma.usageRecord.count({
      where: {
        userId,
        monthYear: currentMonth,
        actionType: 'DIAGNOSIS',
      },
    });

    if (usedCount >= limit) {
      throw ApiError.tooManyRequests(
        `Joriy oy uchun ${limit} ta tashxis limiti tugadi. Davom etish uchun tarifingizni Pro darajasiga yangilang.`
      );
    }

    return true;
  }

  async recordUsage(userId: string, sessionId: string) {
    const currentMonth = this.getCurrentMonthYear();
    await prisma.usageRecord.create({
      data: {
        userId,
        sessionId,
        actionType: 'DIAGNOSIS',
        monthYear: currentMonth,
      },
    });
  }

  async getUsageSummary(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, createdAt: true },
    });

    if (!user) {
      throw ApiError.notFound('Foydalanuvchi topilmadi');
    }

    const currentMonth = this.getCurrentMonthYear();
    const planConfig = PLAN_LIMITS[user.plan] || PLAN_LIMITS.FREE;

    const currentMonthUsed = await prisma.usageRecord.count({
      where: {
        userId,
        monthYear: currentMonth,
        actionType: 'DIAGNOSIS',
      },
    });

    const totalDiagnosesAllTime = await prisma.diagnosisSession.count({
      where: { userId },
    });

    return {
      plan: user.plan,
      planTitle: planConfig.title,
      currentMonth,
      usedThisMonth: currentMonthUsed,
      monthlyLimit: planConfig.monthlyDiagnoses,
      remainingThisMonth: Math.max(0, planConfig.monthlyDiagnoses - currentMonthUsed),
      totalDiagnosesAllTime,
      canDiagnose: currentMonthUsed < planConfig.monthlyDiagnoses,
      isPaymentConfigured: false, // Transparent: real payment gateway setup documented
    };
  }
}

export const billingService = new BillingService();
