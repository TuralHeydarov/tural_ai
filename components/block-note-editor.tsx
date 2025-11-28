'use client';

import { useEffect, useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface BlockNoteEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export default function BlockNoteEditor({ initialContent, onChange }: BlockNoteEditorProps) {
  const [mounted, setMounted] = useState(false);

  const editor = useCreateBlockNote({
    initialContent: initialContent ? parseContent(initialContent) : undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!editor || !onChange) return;

    const handleChange = async () => {
      const blocks = editor.document;
      const content = JSON.stringify(blocks);
      onChange(content);
    };

    // Subscribe to changes
    editor.onEditorContentChange(handleChange);
  }, [editor, onChange]);

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />;
  }

  return (
    <div className="blocknote-editor">
      <BlockNoteView
        editor={editor}
        theme="light"
      />
    </div>
  );
}

function parseContent(content: string): unknown[] | undefined {
  if (!content) return undefined;
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // If JSON parse fails, create a paragraph with the content
    return [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: content }],
      },
    ];
  }
  
  return undefined;
}
