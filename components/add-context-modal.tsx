'use client';

import { useEffect, useState, useRef } from 'react';
import { WorkspacePage, WorkspaceTable } from '@/types';

interface AddContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (context: { type: 'page' | 'table'; id: string; name: string; content?: string }) => void;
}

export function AddContextModal({ isOpen, onClose, onSelect }: AddContextModalProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'tables'>('pages');
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [tables, setTables] = useState<WorkspaceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pagesRes, tablesRes] = await Promise.all([
        fetch('/api/workspace/pages'),
        fetch('/api/workspace/tables'),
      ]);

      const pagesData = await pagesRes.json();
      const tablesData = await tablesRes.json();

      setPages(pagesData.pages || []);
      setTables(tablesData.tables || []);
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPage = (page: WorkspacePage) => {
    onSelect({
      type: 'page',
      id: page.id,
      name: page.title,
      content: page.content,
    });
    onClose();
  };

  const handleSelectTable = (table: WorkspaceTable) => {
    // Convert table to readable format
    const content = formatTableAsText(table);
    onSelect({
      type: 'table',
      id: table.id,
      name: table.name,
      content,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Context
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'pages'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            📄 Pages ({filteredPages.length})
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'tables'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            📊 Tables ({filteredTables.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : activeTab === 'pages' ? (
            filteredPages.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No pages found
              </p>
            ) : (
              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handleSelectPage(page)}
                    className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-xl">{page.icon || '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {page.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : filteredTables.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tables found
            </p>
          ) : (
            <div className="space-y-2">
              {filteredTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => handleSelectTable(table)}
                  className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-xl">📊</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {table.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {table.columns.length} columns · {table.rows.length} rows
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTableAsText(table: WorkspaceTable): string {
  const headers = table.columns.map((col) => col.name).join(' | ');
  const separator = table.columns.map(() => '---').join(' | ');
  const rows = table.rows.map((row) =>
    table.columns.map((col) => String(row.cells[col.id] || '')).join(' | ')
  );

  return `Table: ${table.name}\n\n${headers}\n${separator}\n${rows.join('\n')}`;
}
