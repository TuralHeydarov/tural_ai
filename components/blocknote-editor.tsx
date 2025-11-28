'use client';

import { useEffect, useMemo, useState } from 'react';
import { BlockNoteEditor as Editor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface BlockNoteEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export default function BlockNoteEditor({ initialContent, onChange }: BlockNoteEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    let initialBlocks;
    try {
      initialBlocks = initialContent ? JSON.parse(initialContent) : undefined;
    } catch {
      initialBlocks = undefined;
    }

    return Editor.create({
      initialContent: initialBlocks,
    });
  }, []);

  const handleChange = async () => {
    if (editor && onChange) {
      const blocks = editor.document;
      onChange(JSON.stringify(blocks));
    }
  };

  if (!mounted || !editor) {
    return <div className="text-gray-500 p-4">Loading editor...</div>;
  }

  return (
    <div className="blocknote-wrapper" data-theme="dark">
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="dark"
      />
      <style jsx global>{`
        .blocknote-wrapper {
          --bn-colors-editor-background: #111827;
          --bn-colors-editor-text: #f3f4f6;
          --bn-colors-menu-background: #1f2937;
          --bn-colors-menu-text: #f3f4f6;
          --bn-colors-tooltip-background: #374151;
          --bn-colors-tooltip-text: #f3f4f6;
          --bn-colors-hovered-background: #374151;
          --bn-colors-selected-background: #4b5563;
          --bn-colors-disabled-background: #1f2937;
          --bn-colors-disabled-text: #6b7280;
          --bn-colors-border: #374151;
        }
        .blocknote-wrapper .bn-editor {
          background: transparent;
          min-height: 300px;
        }
        .blocknote-wrapper .bn-block-content {
          padding: 3px 0;
        }
      `}</style>
    </div>
  );
}
