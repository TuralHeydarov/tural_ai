'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspacePage, WorkspaceTable } from '@/types';

export default function WorkspacePage() {
  const router = useRouter();
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [tables, setTables] = useState<WorkspaceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  const createPage = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/workspace/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled', content: '' }),
      });
      const data = await res.json();
      if (data.page) {
        router.push(`/workspace/pages/${data.page.id}`);
      }
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setCreating(false);
    }
  };

  const createTable = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/workspace/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Table' }),
      });
      const data = await res.json();
      if (data.table) {
        router.push(`/workspace/tables/${data.table.id}`);
      }
    } catch (error) {
      console.error('Failed to create table:', error);
    } finally {
      setCreating(false);
    }
  };

  const deletePage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this page?')) return;
    
    try {
      await fetch(`/api/workspace/pages?id=${id}`, { method: 'DELETE' });
      setPages(pages.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const deleteTable = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this table?')) return;
    
    try {
      await fetch(`/api/workspace/tables?id=${id}`, { method: 'DELETE' });
      setTables(tables.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📄 Workspace</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={createPage}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
          >
            <span>➕</span> New Page
          </button>
          <button
            onClick={createTable}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
          >
            <span>➕</span> New Table
          </button>
        </div>

        {/* Pages Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Pages</h2>
          {pages.length === 0 ? (
            <p className="text-gray-500">No pages yet. Create your first page!</p>
          ) : (
            <div className="grid gap-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => router.push(`/workspace/pages/${page.id}`)}
                  className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{page.icon || '📄'}</span>
                    <div>
                      <h3 className="font-medium">{page.title || 'Untitled'}</h3>
                      <p className="text-sm text-gray-500">
                        Updated {new Date(page.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deletePage(page.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-600 rounded transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tables Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Tables</h2>
          {tables.length === 0 ? (
            <p className="text-gray-500">No tables yet. Create your first table!</p>
          ) : (
            <div className="grid gap-3">
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => router.push(`/workspace/tables/${table.id}`)}
                  className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h3 className="font-medium">{table.name || 'Untitled Table'}</h3>
                      <p className="text-sm text-gray-500">
                        {table.columns?.length || 0} columns · {table.rows?.length || 0} rows
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteTable(table.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-600 rounded transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
