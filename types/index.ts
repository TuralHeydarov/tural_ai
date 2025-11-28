// Chat types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface ChatRequest {
  messages: Message[];
  model: ModelId;
  context?: string;
}

export type ModelProvider = 'anthropic' | 'openai';

export interface ModelConfig {
  id: ModelId;
  name: string;
  provider: ModelProvider;
  apiModelId: string;
  maxTokens: number;
  description?: string;
}

export type ModelId = 
  | 'claude-4-sonnet'
  | 'claude-4.5-opus'
  | 'gpt-4o'
  | 'o1'
  | 'o1-mini';

// Workspace types
export interface WorkspacePage {
  id: string;
  title: string;
  content: string;
  icon?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceTable {
  id: string;
  name: string;
  columns: TableColumn[];
  rows: TableRow[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url' | 'email';
  options?: string[];
}

export interface TableRow {
  id: string;
  cells: Record<string, unknown>;
}
