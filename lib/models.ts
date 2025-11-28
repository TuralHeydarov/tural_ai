import { ModelConfig, ModelId } from '@/types';

export const MODELS: Record<ModelId, ModelConfig> = {
  'claude-4-sonnet': {
    id: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    provider: 'anthropic',
    apiModelId: 'claude-sonnet-4-20250514',
    maxTokens: 8192,
    description: 'Fast and intelligent for everyday tasks',
  },
  'claude-4.5-opus': {
    id: 'claude-4.5-opus',
    name: 'Claude 4.5 Opus',
    provider: 'anthropic',
    apiModelId: 'claude-opus-4-5-20251101',
    maxTokens: 8192,
    description: 'Most capable model for complex reasoning',
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    apiModelId: 'gpt-4o',
    maxTokens: 4096,
    description: 'OpenAI flagship model with vision',
  },
  'o1': {
    id: 'o1',
    name: 'o1',
    provider: 'openai',
    apiModelId: 'o1',
    maxTokens: 32768,
    description: 'Advanced reasoning model',
  },
  'o1-mini': {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'openai',
    apiModelId: 'o1-mini',
    maxTokens: 65536,
    description: 'Fast reasoning model',
  },
};

export const DEFAULT_MODEL: ModelId = 'claude-4-sonnet';

export function getModelConfig(modelId: ModelId): ModelConfig {
  return MODELS[modelId] || MODELS[DEFAULT_MODEL];
}
