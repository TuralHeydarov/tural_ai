'use client';

import { useEffect, useRef } from 'react';

const EMOJIS = [
  '📄', '📝', '📋', '📑', '📰', '📚', '📖', '📓', '📔', '📒',
  '📕', '📗', '📘', '📙', '🗒️', '🗓️', '📅', '📆', '🗃️', '🗄️',
  '💼', '📁', '📂', '🗂️', '📊', '📈', '📉', '💹', '📌', '📍',
  '✏️', '✒️', '🖊️', '🖋️', '🖌️', '🖍️', '📎', '🔗', '📐', '📏',
  '🎯', '💡', '🔔', '🔑', '🔒', '🔓', '🏷️', '🎨', '🎭', '🎪',
  '🚀', '✨', '⭐', '🌟', '💫', '🔥', '💥', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🖤', '🤍', '🤎', '❗', '❓', '💬', '💭',
  '🏠', '🏢', '🏗️', '🌍', '🌎', '🌏', '☀️', '🌙', '⚡', '🌈',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl"
    >
      <div className="grid grid-cols-10 gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition text-xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
