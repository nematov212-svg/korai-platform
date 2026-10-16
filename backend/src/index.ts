import { createApp } from './app.js';
import { config } from './config/index.js';
import { prisma } from './prisma.js';
import fs from 'fs';
import path from 'path';

async function bootstrap() {
  // Ensure uploads directory exists
  const uploadDir = path.resolve(process.cwd(), config.storage.uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Check database connectivity
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL ma’lumotlar bazasiga muvaffaqiyatli ulandi');
  } catch (err: any) {
    console.error('❌ Ma’lumotlar bazasiga ulanishda xatolik:', err?.message || err);
  }

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`🚀 Ko'rAI Backend API serveri ishga tushdi: http://localhost:${config.port}`);
    console.log(`📡 API prefiksi: ${config.apiPrefix}`);
    console.log(`🏥 Health-check: http://localhost:${config.port}${config.apiPrefix}/health`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} signali qabul qilindi. Server to‘xtatilmoqda...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('PostgreSQL ulanishi yopildi. Server xavfsiz to‘xtatildi.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('Ilovani ishga tushirishda kutilmagan xato:', err);
  process.exit(1);
});
