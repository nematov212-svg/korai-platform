import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma.js';
import { getStorageProvider } from '../providers/storage/index.js';
import { getVisionAiProvider, ImageInput } from '../providers/ai/index.js';
import {
  CreateDiagnosisInput,
  AnswerQuestionsInput,
  FeedbackInput,
  QueryDiagnosisInput,
} from '../schemas/diagnosis.schema.js';
import { ApiError } from '../utils/errors.js';
import { billingService } from './billing.service.js';

export class DiagnosisService {
  async createSession(userId: string, input: CreateDiagnosisInput) {
    // Check if user is allowed to create diagnoses under their quota
    await billingService.checkQuota(userId);

    const session = await prisma.diagnosisSession.create({
      data: {
        userId,
        title: input.title.trim(),
        category: input.category,
        description: input.description?.trim(),
        deviceModel: input.deviceModel?.trim(),
        symptoms: input.symptoms || [],
        status: 'DRAFT',
      },
    });

    return session;
  }

  async uploadSessionImages(
    userId: string,
    sessionId: string,
    files: Express.Multer.File[]
  ) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: { images: true },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis seansi topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Ushbu seansga rasm yuklash huquqiga ega emassiz');
    }

    if (!files || files.length === 0) {
      throw ApiError.badRequest('Kamida bitta rasm fayli yuklanishi lozim');
    }

    if (session.images.length + files.length > 5) {
      throw ApiError.badRequest('Bitta seans uchun ko‘pi bilan 5 ta rasm yuklash mumkin');
    }

    const storage = getStorageProvider();
    const createdImages = [];

    for (const file of files) {
      const saved = await storage.saveFile(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      const dbImage = await prisma.diagnosisImage.create({
        data: {
          sessionId: session.id,
          filename: saved.filename,
          originalName: file.originalname,
          mimeType: saved.mimeType,
          sizeBytes: saved.sizeBytes,
          storagePath: saved.storagePath,
          url: saved.url,
          width: saved.width,
          height: saved.height,
        },
      });

      createdImages.push(dbImage);
    }

    return createdImages;
  }

  async runAiAnalysis(userId: string, sessionId: string) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: {
        images: true,
        questions: true,
      },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis seansi topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Ushbu tashxisni tahlil qilish huquqiga ega emassiz');
    }

    if (session.images.length === 0) {
      throw ApiError.badRequest('AI tahlilini boshlash uchun kamida 1 ta rasm yuklang');
    }

    // Check quota before triggering expensive AI model
    await billingService.checkQuota(userId);

    // Update status to ANALYZING
    await prisma.diagnosisSession.update({
      where: { id: sessionId },
      data: { status: 'ANALYZING' },
    });

    const aiProvider = getVisionAiProvider();

    // Verify AI Provider is configured with a valid key
    if (!aiProvider.isConfigured()) {
      await prisma.diagnosisSession.update({
        where: { id: sessionId },
        data: { status: 'FAILED' },
      });
      throw ApiError.badRequest(
        `AI provayderi (${aiProvider.getProviderName()}) sozlanmagan. Iltimos, server administratoriga murojaat qiling yoki .env faylida tegishli API kalitini o‘rnating.`
      );
    }

    try {
      // Read image buffers
      const imageInputs: ImageInput[] = [];
      for (const img of session.images) {
        const fullPath = path.resolve(process.cwd(), img.storagePath);
        if (fs.existsSync(fullPath)) {
          const buffer = await fs.promises.readFile(fullPath);
          imageInputs.push({
            buffer,
            mimeType: img.mimeType,
            filename: img.filename,
          });
        }
      }

      if (imageInputs.length === 0) {
        throw ApiError.badRequest('Tahlil uchun rasm fayllari o‘qilmadi');
      }

      // Collect any previous questions and answers
      const previousAnswers = session.questions
        .filter((q) => q.answerText)
        .map((q) => ({
          questionText: q.questionText,
          answerText: q.answerText!,
        }));

      const context = {
        category: session.category,
        title: session.title,
        description: session.description || undefined,
        deviceModel: session.deviceModel || undefined,
        symptoms: (session.symptoms as string[]) || [],
        previousAnswers,
      };

      const result = await aiProvider.analyzeImages(imageInputs, context);
      const aiData = result.data;

      // Upsert analysis result in database
      const savedAnalysis = await prisma.analysisResult.upsert({
        where: { sessionId: session.id },
        create: {
          sessionId: session.id,
          detectedObject: aiData.detectedObject,
          detectedCategory: aiData.detectedCategory,
          visibleEvidence: aiData.visibleEvidence,
          possibleCauses: aiData.possibleCauses,
          safeNextSteps: aiData.safeNextSteps,
          toolsNeeded: aiData.toolsNeeded,
          partsNeeded: aiData.partsNeeded,
          professionalRecommended: aiData.professionalRecommended,
          urgencyLevel: aiData.urgencyLevel,
          safetyWarnings: aiData.safetyWarnings,
          confidenceAssessment: aiData.confidenceAssessment,
          isEvidenceSufficient: aiData.isEvidenceSufficient,
          modelUsed: result.modelUsed,
          rawResponse: result.rawResponse,
        },
        update: {
          detectedObject: aiData.detectedObject,
          detectedCategory: aiData.detectedCategory,
          visibleEvidence: aiData.visibleEvidence,
          possibleCauses: aiData.possibleCauses,
          safeNextSteps: aiData.safeNextSteps,
          toolsNeeded: aiData.toolsNeeded,
          partsNeeded: aiData.partsNeeded,
          professionalRecommended: aiData.professionalRecommended,
          urgencyLevel: aiData.urgencyLevel,
          safetyWarnings: aiData.safetyWarnings,
          confidenceAssessment: aiData.confidenceAssessment,
          isEvidenceSufficient: aiData.isEvidenceSufficient,
          modelUsed: result.modelUsed,
          rawResponse: result.rawResponse,
        },
      });

      // Save follow-up questions if AI suggested them
      if (aiData.followUpQuestions && aiData.followUpQuestions.length > 0) {
        // Delete older unanswered questions
        await prisma.followUpQuestion.deleteMany({
          where: { sessionId: session.id, answerText: null },
        });

        for (const q of aiData.followUpQuestions) {
          await prisma.followUpQuestion.create({
            data: {
              sessionId: session.id,
              questionText: q.questionText,
              questionType: q.questionType,
              options: q.options || [],
            },
          });
        }
      }

      const nextStatus =
        aiData.followUpQuestions && aiData.followUpQuestions.length > 0 && !aiData.isEvidenceSufficient
          ? 'FOLLOW_UP_REQUIRED'
          : 'COMPLETED';

      const updatedSession = await prisma.diagnosisSession.update({
        where: { id: sessionId },
        data: { status: nextStatus },
        include: {
          images: true,
          analysis: true,
          questions: true,
          feedback: true,
        },
      });

      // Record usage
      await billingService.recordUsage(userId, sessionId);

      return updatedSession;
    } catch (err: any) {
      await prisma.diagnosisSession.update({
        where: { id: sessionId },
        data: { status: 'FAILED' },
      });
      throw err;
    }
  }

  async answerFollowUpQuestions(
    userId: string,
    sessionId: string,
    input: AnswerQuestionsInput
  ) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis seansi topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Ushbu seans savollariga javob berish huquqiga ega emassiz');
    }

    const questionIds = session.questions.map((q) => q.id);

    for (const ans of input.answers) {
      if (!questionIds.includes(ans.questionId)) {
        throw ApiError.badRequest(`Savol ID mavjud emas: ${ans.questionId}`);
      }

      await prisma.followUpQuestion.update({
        where: { id: ans.questionId },
        data: {
          answerText: ans.answerText.trim(),
          answeredAt: new Date(),
        },
      });
    }

    // Re-run analysis incorporating the user's answers to refine diagnosis
    return this.runAiAnalysis(userId, sessionId);
  }

  async listSessions(userId: string, query: QueryDiagnosisInput) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.category) {
      where.category = query.category;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.favoriteOnly) {
      where.isFavorite = true;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { deviceModel: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.diagnosisSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          images: { take: 1 },
          analysis: {
            select: {
              detectedObject: true,
              urgencyLevel: true,
              isEvidenceSufficient: true,
              confidenceAssessment: true,
              professionalRecommended: true,
            },
          },
          _count: {
            select: { images: true, questions: true },
          },
        },
      }),
      prisma.diagnosisSession.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSession(userId: string, sessionId: string) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: {
        images: true,
        analysis: true,
        questions: { orderBy: { createdAt: 'asc' } },
        feedback: true,
      },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis hisoboti topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Ushbu tashxis hisobotini ko‘rish huquqiga ega emassiz');
    }

    return session;
  }

  async deleteSession(userId: string, sessionId: string) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: { images: true },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Ushbu tashxisni o‘chirish huquqiga ega emassiz');
    }

    const storage = getStorageProvider();

    // Clean up files from storage
    for (const img of session.images) {
      await storage.deleteFile(img.storagePath).catch(() => {});
    }

    // Delete session from database (cascades to images, analysis, questions, feedback)
    await prisma.diagnosisSession.delete({
      where: { id: sessionId },
    });

    return { success: true };
  }

  async toggleFavorite(userId: string, sessionId: string) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, isFavorite: true },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Huquq yo‘q');
    }

    const updated = await prisma.diagnosisSession.update({
      where: { id: sessionId },
      data: { isFavorite: !session.isFavorite },
      select: { id: true, isFavorite: true },
    });

    return updated;
  }

  async submitFeedback(
    userId: string,
    sessionId: string,
    input: FeedbackInput
  ) {
    const session = await prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw ApiError.notFound('Tashxis topilmadi');
    }

    if (session.userId !== userId) {
      throw ApiError.forbidden('Huquq yo‘q');
    }

    const feedback = await prisma.feedback.upsert({
      where: { sessionId },
      create: {
        sessionId,
        userId,
        isUseful: input.isUseful,
        problemResolved: input.problemResolved,
        actualOutcome: input.actualOutcome,
        userComment: input.userComment,
      },
      update: {
        isUseful: input.isUseful,
        problemResolved: input.problemResolved,
        actualOutcome: input.actualOutcome,
        userComment: input.userComment,
      },
    });

    return feedback;
  }
}

export const diagnosisService = new DiagnosisService();
