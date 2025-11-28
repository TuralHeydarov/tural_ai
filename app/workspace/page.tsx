'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspacePage, WorkspaceTable } from '@/types';

export default function WorkspaceListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<WorkspacePage[]>([]);
  const [tables, setTables] = useState<WorkspaceTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingPage, setCreatingPage] = useState(false);
  const [creatingTable, setCreatingTable] = useState(false);

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
    setCreatingPage(true);
    try {
      const res = await fetch('/api/workspace/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled',
          content: '',
          icon: '📄',
        }),
      });

      const data = await res.json();
      if (data.page) {
        router.push(`/workspace/pages/${data.page.id}`);
      }
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setCreatingPage(false);
    }
  };

  const createTable = async () => {
    setCreatingTable(true);
    try {
      const res = await fetch('/api/workspace/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Untitled Table',
        }),
      });

      const data = await res.json();
      if (data.table) {
        router.push(`/workspace/tables/${data.table.id}`);
      }
    } catch (error) {
      console.error('Failed to create table:', error);
    } finally {
      setCreatingTable(false);
    }
  };

  const deletePage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      await fetch(`/api/workspace/pages?id=${id}`, { method: 'DELETE' });
      setPages(pages.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const deleteTable = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this table?')) return;

    try {
      await fetch(`/api/workspace/tables?id=${id}`, { method: 'DELETE' });
      setTables(tables.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📄 Workspace
        </h1>
        <div className="flex gap-2">
          <button
            onClick={createPage}
            disabled={creatingPage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {creatingPage ? '...' : '➕'} New Page
          </button>
          <button
            onClick={createTable}
            disabled={creatingTable}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {creatingTable ? '...' : '➕'} New Table
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Pages Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📄 Pages
          </h2>
          {pages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No pages yet. Create your first page!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => router.push(`/workspace/pages/${page.id}`)}
                  className="group relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{page.icon || '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deletePage(page.id, e)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete page"
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Tables
          </h2>
          {tables.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No tables yet. Create your first table!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => router.push(`/workspace/tables/${table.id}`)}
                  className="group relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:shadow-lg hover:border-green-500 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {table.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {table.columns.length} columns · {table.rows.length} rows
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteTable(table.id, e)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete table"
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
