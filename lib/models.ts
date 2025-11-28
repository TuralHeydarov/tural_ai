export type ModelId = 
  | 'claude-4-sonnet'
  | 'claude-4.5-opus'
  | 'gpt-4o'
  | 'o1'
  | 'o1-mini'

export type ModelProvider = 'anthropic' | 'openai'

export interface ModelConfig {
  id: ModelId
  name: string
  provider: ModelProvider
  apiModelId: string
  maxTokens: number
}

export const MODELS: Record<ModelId, ModelConfig> = {
  'claude-4-sonnet': {
    id: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    provider: 'anthropic',
    apiModelId: 'claude-sonnet-4-20250514',
    maxTokens: 8192,
  },
  'claude-4.5-opus': {
    id: 'claude-4.5-opus',
    name: 'Claude 4.5 Opus',
    provider: 'anthropic',
    apiModelId: 'claude-opus-4-5-20251101',
    maxTokens: 8192,
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    apiModelId: 'gpt-4o',
    maxTokens: 4096,
  },
  'o1': {
    id: 'o1',
    name: 'o1',
    provider: 'openai',
    apiModelId: 'o1',
    maxTokens: 32768,
  },
  'o1-mini': {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'openai',
    apiModelId: 'o1-mini',
    maxTokens: 65536,
  },
}

export const DEFAULT_MODEL: ModelId = 'claude-4-sonnet'

export function getModelConfig(modelId: string): ModelConfig {
  return MODELS[modelId as ModelId] || MODELS[DEFAULT_MODEL]
}
