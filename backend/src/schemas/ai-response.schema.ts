import { z } from 'zod';

export const possibleCauseSchema = z.object({
  title: z.string().describe('Mumkin bo‘lgan sabab nomi'),
  likelihood: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('Ehtimollik darajasi'),
  explanation: z.string().describe('Nima sababdan bu holat yuzaga kelganligi tushuntirishi'),
  supportingEvidence: z.string().describe('Suratdagi aynan qaysi belgilarga asoslanganligi'),
});

export const followUpQuestionSchema = z.object({
  questionText: z.string().describe('Foydalanuvchiga beriladigan aniqlashtiruvchi savol matni'),
  questionType: z.enum(['TEXT', 'CHOICE', 'YES_NO']).default('TEXT'),
  options: z.array(z.string()).optional().describe('Agar CHOICE bo‘lsa, variantlar'),
});

export const aiDiagnosisResponseSchema = z.object({
  detectedObject: z.string().describe('Suratda aniqlangan qurilma, buyum yoki obyekt'),
  detectedCategory: z.string().describe('Aniqlangan kategoriya (masalan, appliances, automotive, electronics, plumbing, etc.)'),
  isEvidenceSufficient: z.boolean().describe('Suratdagi vizual dalillar xulosa chiqarish uchun yetarlimi'),
  confidenceAssessment: z.string().describe('Tashxis ishonchliligi va vizual cheklovlar haqida xolis tushuntirish'),
  visibleEvidence: z.array(z.string()).min(1).describe('Suratda aniq ko‘rinib turgan dalillar va belgilar ro‘yxati'),
  possibleCauses: z.array(possibleCauseSchema).describe('Ehtimoliy sabablar reytingi'),
  safeNextSteps: z.array(z.string()).min(1).describe('Foydalanuvchi xavfsiz bajara oladigan bosqichma-bosqich tekshirish qadamlari'),
  toolsNeeded: z.array(z.string()).default([]).describe('Tashxis yoki dastlabki ko‘rik uchun talab qilinishi mumkin bo‘lgan asboblar'),
  partsNeeded: z.array(z.string()).default([]).describe('Almashtirish talab qilinishi mumkin bo‘lgan ehtiyot qismlar (agar ko‘rinib turgan bo‘lsa)'),
  professionalRecommended: z.boolean().describe('Mutaxassis (usta) xizmati talab qilinadimi'),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Muammoning xavflilik yoki shoshilinchlik darajasi'),
  safetyWarnings: z.array(z.string()).default([]).describe('Elektr, gaz, bosim, yong‘in yoki shikastlanish xavfi bo‘yicha muhim ogohlantirishlar'),
  followUpQuestions: z.array(followUpQuestionSchema).default([]).describe('Agar vizual ma’lumot to‘liq bo‘lmasa, foydalanuvchiga 1-3 ta savol'),
});

export type PossibleCause = z.infer<typeof possibleCauseSchema>;
export type FollowUpQuestionItem = z.infer<typeof followUpQuestionSchema>;
export type AiDiagnosisResponse = z.infer<typeof aiDiagnosisResponseSchema>;
