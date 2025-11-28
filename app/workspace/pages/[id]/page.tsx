'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkspacePage } from '@/types';
import dynamic from 'next/dynamic';
import EmojiPicker from '@/components/emoji-picker';

// Dynamic import for BlockNote to avoid SSR issues
const BlockNoteEditor = dynamic(
  () => import('@/components/blocknote-editor'),
  { ssr: false, loading: () => <div className="text-gray-500 p-4">Loading editor...</div> }
);

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<WorkspacePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pageId = params.id as string;

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
    } finally {
      setLoading(false);
    }
  };

  const savePage = useCallback(async (updates: Partial<WorkspacePage>) => {
    if (!page) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/workspace/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id, ...updates }),
      });
      const data = await res.json();
      if (data.page) {
        setPage(data.page);
      }
    } catch (error) {
      console.error('Failed to save page:', error);
    } finally {
      setSaving(false);
    }
  }, [page]);

  const debouncedSave = useCallback((updates: Partial<WorkspacePage>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      savePage(updates);
    }, 1000);
  }, [savePage]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPage(prev => prev ? { ...prev, title } : null);
    debouncedSave({ title });
  };

  const handleContentChange = (content: string) => {
    setPage(prev => prev ? { ...prev, content } : null);
    debouncedSave({ content });
  };

  const handleIconSelect = (emoji: string) => {
    setPage(prev => prev ? { ...prev, icon: emoji } : null);
    savePage({ icon: emoji });
    setShowEmojiPicker(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/workspace')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Workspace
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {saving ? (
              <span className="flex items-center gap-1">
                <span className="animate-pulse">●</span> Saving...
              </span>
            ) : (
              <span className="text-green-500">✓ Saved</span>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Icon & Title */}
        <div className="mb-8">
          <div className="relative inline-block mb-4">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-6xl hover:bg-gray-800 rounded-lg p-2 transition"
            >
              {page.icon || '📄'}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <EmojiPicker onSelect={handleIconSelect} onClose={() => setShowEmojiPicker(false)} />
              </div>
            )}
          </div>
          <input
            type="text"
            value={page.title || ''}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-gray-600"
          />
        </div>

        {/* BlockNote Editor */}
        <div className="prose prose-invert max-w-none">
          <BlockNoteEditor
            initialContent={page.content}
            onChange={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
}
