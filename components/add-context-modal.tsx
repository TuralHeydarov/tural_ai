'use client';

import { useEffect, useState } from 'react';
import { WorkspacePage, WorkspaceTable } from '@/types';

interface ContextItem {
  id: string;
  type: 'page' | 'table';
  name: string;
  icon?: string;
}

interface AddContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (items: ContextItem[]) => void;
  selectedItems?: ContextItem[];
}

export default function AddContextModal({
  isOpen,
  onClose,
  onSelect,
  selectedItems = [],
}: AddContextModalProps) {
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [tables, setTables] = useState<WorkspaceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContextItem[]>(selectedItems);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelected(selectedItems);
    }
  }, [isOpen, selectedItems]);

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

  const toggleItem = (item: ContextItem) => {
    const exists = selected.find((s) => s.id === item.id && s.type === item.type);
    if (exists) {
      setSelected(selected.filter((s) => !(s.id === item.id && s.type === item.type)));
    } else {
      setSelected([...selected, item]);
    }
  };

  const isSelected = (id: string, type: 'page' | 'table') => {
    return selected.some((s) => s.id === id && s.type === type);
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Add Context</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Search pages and tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 outline-none focus:border-blue-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading...</div>
          ) : (
            <>
              {/* Pages Section */}
              {filteredPages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Pages</h3>
                  <div className="space-y-1">
                    {filteredPages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() =>
                          toggleItem({
                            id: page.id,
                            type: 'page',
                            name: page.title,
                            icon: page.icon,
                          })
                        }
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
                          isSelected(page.id, 'page')
                            ? 'bg-blue-600'
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl">{page.icon || '📄'}</span>
                        <span className="text-white flex-1 text-left">
                          {page.title || 'Untitled'}
                        </span>
                        {isSelected(page.id, 'page') && (
                          <span className="text-white">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tables Section */}
              {filteredTables.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Tables</h3>
                  <div className="space-y-1">
                    {filteredTables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() =>
                          toggleItem({
                            id: table.id,
                            type: 'table',
                            name: table.name,
                          })
                        }
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
                          isSelected(table.id, 'table')
                            ? 'bg-blue-600'
                            : 'hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-xl">📊</span>
                        <span className="text-white flex-1 text-left">
                          {table.name || 'Untitled Table'}
                        </span>
                        {isSelected(table.id, 'table') && (
                          <span className="text-white">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredPages.length === 0 && filteredTables.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  {searchQuery ? 'No results found' : 'No pages or tables yet'}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {selected.length} item{selected.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Add Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
