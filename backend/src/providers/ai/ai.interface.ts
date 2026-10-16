import { AiDiagnosisResponse } from '../../schemas/ai-response.schema.js';

export interface ImageInput {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

export interface DiagnosisContext {
  category: string;
  title: string;
  description?: string;
  deviceModel?: string;
  symptoms?: string[];
  previousAnswers?: Array<{ questionText: string; answerText: string }>;
}

export interface IVisionAiProvider {
  analyzeImages(
    images: ImageInput[],
    context: DiagnosisContext
  ): Promise<{
    data: AiDiagnosisResponse;
    modelUsed: string;
    rawResponse?: any;
  }>;

  isConfigured(): boolean;
  getProviderName(): string;
  getModelName(): string;
}
