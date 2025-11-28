'use client';

import { useState } from 'react';
import { ModelId } from '@/types';
import { MODELS, DEFAULT_MODEL } from '@/lib/models';

interface ModelSelectorProps {
  value?: ModelId;
  onChange?: (modelId: ModelId) => void;
  className?: string;
}

export function ModelSelector({
  value = DEFAULT_MODEL,
  onChange,
  className = '',
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModel = MODELS[value];

  const modelGroups = {
    anthropic: Object.values(MODELS).filter((m) => m.provider === 'anthropic'),
    openai: Object.values(MODELS).filter((m) => m.provider === 'openai'),
  };

  const handleSelect = (modelId: ModelId) => {
    onChange?.(modelId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <ModelIcon provider={selectedModel.provider} />
        <span className="font-medium">{selectedModel.name}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                Anthropic
              </div>
              {modelGroups.anthropic.map((model) => (
                <ModelOption
                  key={model.id}
                  model={model}
                  isSelected={value === model.id}
                  onSelect={() => handleSelect(model.id)}
                />
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                OpenAI
              </div>
              {modelGroups.openai.map((model) => (
                <ModelOption
                  key={model.id}
                  model={model}
                  isSelected={value === model.id}
                  onSelect={() => handleSelect(model.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ModelOption({
  model,
  isSelected,
  onSelect,
}: {
  model: (typeof MODELS)[ModelId];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-start gap-3 px-2 py-2 rounded-md text-left transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <ModelIcon provider={model.provider} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {model.name}
        </div>
        {model.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {model.description}
          </div>
        )}
      </div>
      {isSelected && (
        <svg
          className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

function ModelIcon({ provider }: { provider: 'anthropic' | 'openai' }) {
  if (provider === 'anthropic') {
    return (
      <div className="w-5 h-5 rounded bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">A</span>
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-green-600 dark:text-green-400">O</span>
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export default ModelSelector;
