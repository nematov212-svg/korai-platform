import OpenAI from 'openai';
import { IVisionAiProvider, ImageInput, DiagnosisContext } from './ai.interface.js';
import { aiDiagnosisResponseSchema, AiDiagnosisResponse } from '../../schemas/ai-response.schema.js';
import { buildDiagnosticSystemPrompt, buildDiagnosticUserPrompt } from './prompt.js';
import { ApiError } from '../../utils/errors.js';

export class OpenAiVisionProvider implements IVisionAiProvider {
  private client: OpenAI | null = null;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.modelName = modelName;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  getProviderName(): string {
    return 'openai';
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
        'OpenAI API kaliti sozlanmagan. Iltimos, serverning .env faylida OPENAI_API_KEY sozlamasini kiriting.'
      );
    }

    if (!images || images.length === 0) {
      throw ApiError.badRequest('Tahlil uchun kamida bitta rasm yuklanishi kerak');
    }

    try {
      const contentParts: any[] = [
        {
          type: 'text',
          text: buildDiagnosticUserPrompt(context),
        },
      ];

      for (const img of images) {
        contentParts.push({
          type: 'image_url',
          image_url: {
            url: `data:${img.mimeType};base64,${img.buffer.toString('base64')}`,
            detail: 'high',
          },
        });
      }

      const response = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [
          { role: 'system', content: buildDiagnosticSystemPrompt() },
          { role: 'user', content: contentParts },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) {
        throw ApiError.internal('OpenAI javobi bo‘sh bo‘lib qaytdi');
      }

      let parsed: any;
      try {
        parsed = JSON.parse(rawContent);
      } catch (err) {
        throw ApiError.internal('OpenAI javobi JSON emas: ' + rawContent.slice(0, 100));
      }

      const validation = aiDiagnosisResponseSchema.safeParse(parsed);
      if (!validation.success) {
        console.error('OpenAI response validation errors:', validation.error.format());
        throw ApiError.internal('AI tashxis natijasi kutilgan sxemaga mos kelmadi');
      }

      return {
        data: validation.data,
        modelUsed: this.modelName,
        rawResponse: parsed,
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      console.error('OpenAI Vision API error:', error?.message || error);
      throw ApiError.internal(`OpenAI Vision tahlilida xatolik: ${error?.message || 'Nomaʼlum xato'}`);
    }
  }
}
