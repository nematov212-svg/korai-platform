import { z } from 'zod';

export const createDiagnosisSchema = z.object({
  title: z.string().min(2, 'Sarlavha kamida 2 ta belgidan iborat bo‘lishi kerak').max(150),
  category: z.enum([
    'appliances',   // Maishiy texnika
    'automotive',   // Avtomobillar
    'electronics',  // Elektronika
    'plumbing',     // Santexnika va uy ta'miri
    'computers',    // Kompyuter va smartfonlar
    'general'       // Boshqa / Umumiy
  ]),
  description: z.string().max(2000).optional(),
  deviceModel: z.string().max(100).optional(),
  symptoms: z.array(z.string()).default([]),
});

export const answerQuestionsSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      answerText: z.string().min(1, 'Javob matni bo‘sh bo‘lishi mumkin emas').max(1000),
    })
  ).min(1, 'Kamida bitta javob kiritilishi shart'),
});

export const feedbackSchema = z.object({
  isUseful: z.boolean(),
  problemResolved: z.boolean().default(false),
  actualOutcome: z.string().max(1000).optional(),
  userComment: z.string().max(1000).optional(),
});

export const queryDiagnosisSchema = z.object({
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10))) : 10)),
  category: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  favoriteOnly: z.string().optional().transform((val) => val === 'true'),
});

export type CreateDiagnosisInput = z.infer<typeof createDiagnosisSchema>;
export type AnswerQuestionsInput = z.infer<typeof answerQuestionsSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type QueryDiagnosisInput = z.infer<typeof queryDiagnosisSchema>;
