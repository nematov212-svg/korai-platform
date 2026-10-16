import { GoogleGenerativeAI } from '@google/generative-ai';
import { IVisionAiProvider, ImageInput, DiagnosisContext } from './ai.interface.js';
import { aiDiagnosisResponseSchema, AiDiagnosisResponse } from '../../schemas/ai-response.schema.js';
import { buildDiagnosticSystemPrompt, buildDiagnosticUserPrompt } from './prompt.js';
import { ApiError } from '../../utils/errors.js';

export class GeminiVisionProvider implements IVisionAiProvider {
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.modelName = modelName;
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  getProviderName(): string {
    return 'google-gemini';
  }

  getModelName(): string {
    return this.modelName;
  }

  async analyzeImages(
    images: ImageInput[],
    context: DiagnosisContext
  ): Promise<{
    data: AiDiagnosisResponse;
    modelUsed: string;
    rawResponse?: any;
  }> {
    if (!this.client || !this.apiKey) {
      throw ApiError.badRequest(
        'Google Gemini API kaliti sozlanmagan. Iltimos, serverning .env faylida GEMINI_API_KEY sozlamasini kiriting.'
      );
    }

    if (!images || images.length === 0) {
      throw ApiError.badRequest('Tahlil uchun kamida bitta rasm yuklanishi kerak');
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction: buildDiagnosticSystemPrompt(),
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const imageParts = images.map((img) => ({
        inlineData: {
          data: img.buffer.toString('base64'),
          mimeType: img.mimeType,
        },
      }));

      const userPrompt = buildDiagnosticUserPrompt(context);
      const result = await model.generateContent([userPrompt, ...imageParts]);
      const response = await result.response;
      const rawText = response.text();

      let jsonParsed: any;
      try {
        jsonParsed = JSON.parse(rawText);
      } catch (err) {
        throw ApiError.internal('Gemini qaytargan ma’lumot JSON formatida emas: ' + rawText.slice(0, 100));
      }

      // Validate against strict Zod schema
      const validationResult = aiDiagnosisResponseSchema.safeParse(jsonParsed);
      if (!validationResult.success) {
        console.error('Gemini response validation errors:', validationResult.error.format());
        throw ApiError.internal('AI tashxis natijasi kutilgan sxemaga mos kelmadi');
      }

      return {
        data: validationResult.data,
        modelUsed: this.modelName,
        rawResponse: jsonParsed,
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      console.error('Gemini Vision API error:', error?.message || error);
      throw ApiError.internal(`Gemini Vision tahlilida xatolik: ${error?.message || 'Nomaʼlum xato'}`);
    }
  }
}
