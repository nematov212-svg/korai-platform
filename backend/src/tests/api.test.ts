import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { prisma } from '../prisma.js';
import * as aiIndex from '../providers/ai/index.js';
import sharp from 'sharp';

const app = createApp();

let userAToken = '';
let userBToken = '';
let userAId = '';
let userBId = '';
let sessionId = '';
let sampleImageBuffer: Buffer;

beforeAll(async () => {
  // Generate a valid 100x100 PNG image buffer for testing
  sampleImageBuffer = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 79, g: 70, b: 229, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
});

afterAll(async () => {
  // Cleanup test users and their data
  if (userAId || userBId) {
    await prisma.user.deleteMany({
      where: {
        id: { in: [userAId, userBId].filter(Boolean) },
      },
    });
  }
  await prisma.$disconnect();
});

describe('1. Health Check Endpoint', () => {
  it('GET /api/v1/health should return 200 with service checks', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.checks.database.status).toBe('up');
    expect(res.body.checks.aiProvider).toBeDefined();
  });
});

describe('2. Authentication & Authorization', () => {
  const userAEmail = `test.user.a.${Date.now()}@korai.uz`;
  const userBEmail = `test.user.b.${Date.now()}@korai.uz`;

  it('POST /api/v1/auth/register should fail with short password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Ali Valiyev',
      email: userAEmail,
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register should register User A with valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Ali Valiyev',
      email: userAEmail,
      password: 'SecurePassword123!',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(userAEmail.toLowerCase());
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    userAToken = res.body.data.accessToken;
    userAId = res.body.data.user.id;
  });

  it('POST /api/v1/auth/register should reject duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Ali Duplicate',
      email: userAEmail,
      password: 'SecurePassword123!',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('mavjud');
  });

  it('POST /api/v1/auth/register should register User B', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Bobur Sobirov',
      email: userBEmail,
      password: 'SecurePassword123!',
    });
    expect(res.status).toBe(201);
    userBToken = res.body.data.accessToken;
    userBId = res.body.data.user.id;
  });

  it('POST /api/v1/auth/login should authenticate registered user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: userAEmail,
      password: 'SecurePassword123!',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('POST /api/v1/auth/login should reject invalid password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: userAEmail,
      password: 'WrongPassword999!',
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/auth/me should return 401 without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/auth/me should return user profile with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${userAToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.id).toBe(userAId);
  });
});

describe('3. Diagnosis Session & Image Intake', () => {
  it('POST /api/v1/diagnoses should create a new diagnosis session in DRAFT state', async () => {
    const res = await request(app)
      .post('/api/v1/diagnoses')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        title: 'Kir yuvish mashinasidan suv oqishi',
        category: 'appliances',
        description: 'Pastki qismidan to‘satdan suv to‘kilib ketyapti',
        deviceModel: 'Samsung EcoBubble 7kg',
        symptoms: ['suv sizishi', 'shovqin'],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.session.id).toBeDefined();
    expect(res.body.data.session.status).toBe('DRAFT');
    sessionId = res.body.data.session.id;
  });

  it('POST /api/v1/diagnoses/:id/images should reject invalid non-image file', async () => {
    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/images`)
      .set('Authorization', `Bearer ${userAToken}`)
      .attach('images', Buffer.from('hello plain text'), 'test.txt');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('JPEG, PNG');
  });

  it('POST /api/v1/diagnoses/:id/images should upload and process valid image', async () => {
    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/images`)
      .set('Authorization', `Bearer ${userAToken}`)
      .attach('images', sampleImageBuffer, 'washer_leak.png');

    expect(res.status).toBe(200);
    expect(res.body.data.images).toHaveLength(1);
    expect(res.body.data.images[0].url).toContain('/uploads/');
  });
});

describe('4. IDOR Protection (Broken Access Control)', () => {
  it('User B should NOT be able to view User A diagnosis session (403)', async () => {
    const res = await request(app)
      .get(`/api/v1/diagnoses/${sessionId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error.message).toContain('huquqiga ega emassiz');
  });

  it('User B should NOT be able to upload images to User A diagnosis session (403)', async () => {
    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/images`)
      .set('Authorization', `Bearer ${userBToken}`)
      .attach('images', sampleImageBuffer, 'hack.png');

    expect(res.status).toBe(403);
  });

  it('User B should NOT be able to delete User A diagnosis session (403)', async () => {
    const res = await request(app)
      .delete(`/api/v1/diagnoses/${sessionId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.status).toBe(403);
  });
});

describe('5. AI Diagnostic Engine (Mocked Vision Provider)', () => {
  it('POST /api/v1/diagnoses/:id/analyze should run structured AI analysis and save report', async () => {
    // Mock getVisionAiProvider to return a controlled structured response
    const mockProvider = {
      isConfigured: () => true,
      getProviderName: () => 'mock-gemini',
      getModelName: () => 'gemini-1.5-flash',
      analyzeImages: vi.fn().mockResolvedValue({
        modelUsed: 'gemini-1.5-flash',
        data: {
          detectedObject: 'Samsung kir yuvish mashinasi',
          detectedCategory: 'appliances',
          isEvidenceSufficient: false,
          confidenceAssessment: 'Pastki qismdagi suv ko‘rinib turibdi, ammo nasos yoki shlang ekanligini to‘liq tasdiqlash uchun qo‘shimcha ma’lumot zarur',
          visibleEvidence: ['Mashina ostida suv ko‘lmakchalari', 'Drenaj filtri qopqog‘i yaqinida namlik'],
          possibleCauses: [
            {
              title: 'Drenaj filtri yoki rezina zichlagich (mansheta) yorilishi',
              likelihood: 'HIGH',
              explanation: 'Ko‘p hollarda drenaj filtri to‘lib ketishi yoki orqa shlang yorilishi sabab bo‘ladi',
              supportingEvidence: 'Suv oqimi mashinaning pastki o‘ng burchagidan tarqalgan',
            },
            {
              title: 'Suv quyish shlangi bo‘shab qolgan',
              likelihood: 'MEDIUM',
              explanation: 'Kirish klapaniga ulangan shlang bosim ostida oqayotgan bo‘lishi mumkin',
              supportingEvidence: 'Orqa qism bo‘ylab oqqan suv izlari',
            },
          ],
          safeNextSteps: [
            'Kir yuvish mashinasini darhol elektr tarmog‘idan uzing',
            'Suv beruvchi jo‘mrakni yopib qo‘ying',
            'Pastki o‘ng burchakdagi favqulodda to‘kish shlangi orqali suvni bo‘shating',
          ],
          toolsNeeded: ['Yassi otvyortka', 'Katta latta va past idish'],
          partsNeeded: ['Drenaj nasosi rezina halqasi'],
          professionalRecommended: false,
          urgencyLevel: 'HIGH',
          safetyWarnings: ['Elektr toki urish xavfi! Nam qo‘l bilan rozetkaga tegmang va elektrni zudlik bilan o‘chiring!'],
          followUpQuestions: [
            {
              questionText: 'Suv faqat siqish (otjim) rejimida oqyaptimi yoki suv to‘ldirish vaqtida hammi?',
              questionType: 'TEXT',
            },
          ],
        },
      }),
    };

    vi.spyOn(aiIndex, 'getVisionAiProvider').mockReturnValue(mockProvider as any);

    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/analyze`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.session.status).toBe('FOLLOW_UP_REQUIRED');
    expect(res.body.data.session.analysis).toBeDefined();
    expect(res.body.data.session.analysis.detectedObject).toBe('Samsung kir yuvish mashinasi');
    expect(res.body.data.session.questions).toHaveLength(1);
  });

  it('POST /api/v1/diagnoses/:id/answers should accept follow-up answers and re-analyze', async () => {
    // Get question id
    const sessionRes = await request(app)
      .get(`/api/v1/diagnoses/${sessionId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    const question = sessionRes.body.data.session.questions[0];
    expect(question).toBeDefined();

    // Mock refined diagnosis where evidence is now sufficient
    const mockRefinedProvider = {
      isConfigured: () => true,
      getProviderName: () => 'mock-gemini',
      getModelName: () => 'gemini-1.5-flash',
      analyzeImages: vi.fn().mockResolvedValue({
        modelUsed: 'gemini-1.5-flash',
        data: {
          detectedObject: 'Samsung kir yuvish mashinasi',
          detectedCategory: 'appliances',
          isEvidenceSufficient: true,
          confidenceAssessment: 'Javobingizga asosan, drenaj nasosi filtri yorilganligi aniqlandi',
          visibleEvidence: ['Mashina ostida suv to‘planishi'],
          possibleCauses: [
            {
              title: 'Drenaj filtri tiqilib qolgan',
              likelihood: 'HIGH',
              explanation: 'Suv to‘kish vaqtida filtr ichidagi qattiq jism filtr qopqog‘ini ochib yuborgan',
              supportingEvidence: 'Faqat siqish va suv to‘kish vaqtida sizishi tasdiqlandi',
            },
          ],
          safeNextSteps: ['Filtrni ochib begona jismlarni tozalang'],
          toolsNeeded: ['Latta', 'Idish'],
          partsNeeded: [],
          professionalRecommended: false,
          urgencyLevel: 'MEDIUM',
          safetyWarnings: ['Elektrni o‘chiring'],
          followUpQuestions: [],
        },
      }),
    };

    vi.spyOn(aiIndex, 'getVisionAiProvider').mockReturnValue(mockRefinedProvider as any);

    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/answers`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        answers: [
          {
            questionId: question.id,
            answerText: 'Faqat siqish (otjim) vaqtida suv oqmoqda',
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.session.status).toBe('COMPLETED');
    expect(res.body.data.session.analysis.isEvidenceSufficient).toBe(true);
  });
});

describe('6. Feedback, Favorites & Billing Quota', () => {
  it('POST /api/v1/diagnoses/:id/favorite should toggle favorite status', async () => {
    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/favorite`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isFavorite).toBe(true);
  });

  it('POST /api/v1/diagnoses/:id/feedback should save user rating and feedback', async () => {
    const res = await request(app)
      .post(`/api/v1/diagnoses/${sessionId}/feedback`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        isUseful: true,
        problemResolved: true,
        actualOutcome: 'Drenaj filtridan tanga chiqdi, tozalagach suv sizishi to‘xtadi',
        userComment: 'Ajoyib aniqlik!',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.feedback.isUseful).toBe(true);
  });

  it('GET /api/v1/billing/usage should return user usage tracking', async () => {
    const res = await request(app)
      .get('/api/v1/billing/usage')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.plan).toBe('FREE');
    expect(res.body.data.usedThisMonth).toBeGreaterThanOrEqual(1);
    expect(res.body.data.remainingThisMonth).toBeDefined();
  });

  it('GET /api/v1/diagnoses should list user sessions with pagination', async () => {
    const res = await request(app)
      .get('/api/v1/diagnoses?page=1&limit=10')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/v1/diagnoses/:id should delete session and cascade', async () => {
    const res = await request(app)
      .delete(`/api/v1/diagnoses/${sessionId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify session is gone
    const checkRes = await request(app)
      .get(`/api/v1/diagnoses/${sessionId}`)
      .set('Authorization', `Bearer ${userAToken}`);
    expect(checkRes.status).toBe(404);
  });
});
