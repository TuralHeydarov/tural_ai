'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { WorkspacePage } from '@/types';
import { EmojiPicker } from '@/components/emoji-picker';

// Dynamically import BlockNote to avoid SSR issues
const BlockNoteEditor = dynamic(
  () => import('@/components/block-note-editor'),
  { ssr: false, loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" /> }
);

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  
  const [page, setPage] = useState<WorkspacePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/workspace/pages`);
      const data = await res.json();
      const foundPage = data.pages?.find((p: WorkspacePage) => p.id === pageId);
      
      if (foundPage) {
        setPage(foundPage);
      } else {
        router.push('/workspace');
      }
    } catch (error) {
      console.error('Failed to fetch page:', error);
      router.push('/workspace');
    } finally {
      setLoading(false);
    }
  };

  const savePage = useCallback(async (updates: Partial<WorkspacePage>) => {
    if (!page) return;
    
    setSaving(true);
    try {
      await fetch('/api/workspace/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pageId, ...updates }),
      });
      setPage((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error('Failed to save page:', error);
    } finally {
      setSaving(false);
    }
  }, [page, pageId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPage((prev) => (prev ? { ...prev, title } : null));
    
    // Debounce save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      savePage({ title });
    }, 500);
  };

  const handleContentChange = useCallback((content: string) => {
    setPage((prev) => (prev ? { ...prev, content } : null));
    
    // Debounce save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      savePage({ content });
    }, 1000);
  }, [savePage]);

  const handleEmojiSelect = (emoji: string) => {
    savePage({ icon: emoji });
    setShowEmojiPicker(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/workspace')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            {/* Icon Picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-3xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
              >
                {page.icon || '📄'}
              </button>
              {showEmojiPicker && (
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>
            {/* Title */}
            <input
              type="text"
              value={page.title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-sm text-gray-500">Saving...</span>
          )}
          <span className="text-sm text-gray-400">
            Updated: {new Date(page.updatedAt).toLocaleString()}
          </span>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <BlockNoteEditor
            initialContent={page.content}
            onChange={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
}
