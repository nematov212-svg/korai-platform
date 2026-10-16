import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { getVisionAiProvider } from '../providers/ai/index.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const startTime = Date.now();

  let dbOk = false;
  let dbError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (err: any) {
    dbError = err?.message || 'Database connection error';
  }

  const aiProvider = getVisionAiProvider();
  const isAiConfigured = aiProvider.isConfigured();

  const uploadDir = path.resolve(process.cwd(), config.storage.uploadDir);
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch {}
  }
  const isStorageWritable = fs.existsSync(uploadDir);

  const responseTimeMs = Date.now() - startTime;
  const isHealthy = dbOk && isStorageWritable;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    version: '1.0.0',
    service: "Ko'rAI Diagnostic API",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    responseTimeMs,
    checks: {
      database: {
        status: dbOk ? 'up' : 'down',
        ...(dbError ? { error: dbError } : {}),
      },
      storage: {
        status: isStorageWritable ? 'up' : 'down',
        provider: config.storage.provider,
      },
      aiProvider: {
        provider: aiProvider.getProviderName(),
        model: aiProvider.getModelName(),
        configured: isAiConfigured,
        status: isAiConfigured ? 'ready' : 'awaiting_api_key',
        message: isAiConfigured
          ? 'Vision AI tayyor'
          : 'AI API kaliti sozlanmagan. Iltimos .env faylida GEMINI_API_KEY yoki OPENAI_API_KEY sozlang.',
      },
    },
  });
});

export default router;
