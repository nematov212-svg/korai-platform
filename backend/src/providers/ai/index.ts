import { IVisionAiProvider } from './ai.interface.js';
import { GeminiVisionProvider } from './gemini.provider.js';
import { OpenAiVisionProvider } from './openai.provider.js';
import { config } from '../../config/index.js';

let aiProviderInstance: IVisionAiProvider | null = null;

export function getVisionAiProvider(): IVisionAiProvider {
  if (!aiProviderInstance) {
    if (config.ai.provider === 'openai') {
      aiProviderInstance = new OpenAiVisionProvider(
        config.ai.openaiKey,
        config.ai.openaiModel
      );
    } else {
      // Default to Google Gemini
      aiProviderInstance = new GeminiVisionProvider(
        config.ai.geminiKey,
        config.ai.geminiModel
      );
    }
  }
  return aiProviderInstance;
}

export * from './ai.interface.js';
