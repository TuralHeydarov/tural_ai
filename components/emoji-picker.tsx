'use client';

import { useEffect, useRef } from 'react';

const EMOJI_CATEGORIES = {
  'Recently Used': ['📄', '📝', '📊', '💡', '🎯', '🚀', '✨', '🔥'],
  'Documents': ['📄', '📝', '📋', '📑', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙'],
  'Objects': ['💡', '🎯', '🚀', '⚡', '🔧', '🔨', '💼', '📁', '🗂️', '📦', '🎁', '🏷️'],
  'Symbols': ['✅', '❌', '⭐', '❤️', '💪', '👍', '👎', '🙌', '🎉', '🔔', '💬', '✨'],
  'Nature': ['🌟', '🌙', '☀️', '🌈', '🔥', '💧', '🌱', '🌸', '🍀', '🌺', '🌻', '🌴'],
  'Animals': ['🐱', '🐶', '🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🦄', '🐝', '🦋', '🐦'],
};

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 w-72 max-h-80 overflow-auto"
    >
      {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
        <div key={category} className="mb-3">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {category}
          </h4>
          <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji, idx) => (
              <button
                key={`${emoji}-${idx}`}
                onClick={() => onSelect(emoji)}
                className="p-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
