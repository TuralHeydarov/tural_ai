'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkspaceTable, TableColumn, TableRow } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const COLUMN_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
];

export default function TableEditor() {
  const params = useParams();
  const router = useRouter();
  const [table, setTable] = useState<WorkspaceTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const tableId = params.id as string;

  useEffect(() => {
    fetchTable();
  }, [tableId]);

  const fetchTable = async () => {
    try {
      const res = await fetch(`/api/workspace/tables?id=${tableId}`);
      const data = await res.json();
      
      if (data.table) {
        setTable(data.table);
      } else {
        router.push('/workspace');
      }
    } catch (error) {
      console.error('Failed to fetch table:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTable = useCallback(async (updates: Partial<WorkspaceTable>) => {
    if (!table) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/workspace/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: table.id, ...updates }),
      });
      const data = await res.json();
      if (data.table) {
        setTable(data.table);
      }
    } catch (error) {
      console.error('Failed to save table:', error);
    } finally {
      setSaving(false);
    }
  }, [table]);

  const addColumn = () => {
    if (!table) return;
    const newColumn: TableColumn = {
      id: uuidv4(),
      name: `Column ${table.columns.length + 1}`,
      type: 'text',
    };
    const columns = [...table.columns, newColumn];
    setTable({ ...table, columns });
    saveTable({ columns });
  };

  const updateColumn = (columnId: string, updates: Partial<TableColumn>) => {
    if (!table) return;
    const columns = table.columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    setTable({ ...table, columns });
    saveTable({ columns });
  };

  const deleteColumn = (columnId: string) => {
    if (!table) return;
    if (!confirm('Delete this column?')) return;
    
    const columns = table.columns.filter(col => col.id !== columnId);
    const rows = table.rows.map(row => {
      const { [columnId]: _, ...cells } = row.cells;
      return { ...row, cells };
    });
    setTable({ ...table, columns, rows });
    saveTable({ columns, rows });
  };

  const addRow = () => {
    if (!table) return;
    const newRow: TableRow = {
      id: uuidv4(),
      cells: {},
    };
    const rows = [...table.rows, newRow];
    setTable({ ...table, rows });
    saveTable({ rows });
  };

  const updateCell = (rowId: string, columnId: string, value: unknown) => {
    if (!table) return;
    const rows = table.rows.map(row =>
      row.id === rowId
        ? { ...row, cells: { ...row.cells, [columnId]: value } }
        : row
    );
    setTable({ ...table, rows });
    saveTable({ rows });
  };

  const deleteRow = (rowId: string) => {
    if (!table) return;
    const rows = table.rows.filter(row => row.id !== rowId);
    setTable({ ...table, rows });
    saveTable({ rows });
  };

  const handleNameChange = (name: string) => {
    if (!table) return;
    setTable({ ...table, name });
    saveTable({ name });
    setEditingName(false);
  };

  const renderCell = (row: TableRow, column: TableColumn) => {
    const value = row.cells[column.id];

    switch (column.type) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateCell(row.id, column.id, e.target.checked)}
            className="w-4 h-4"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={(value as number) || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-transparent outline-none"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        );
      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="w-full bg-gray-700 outline-none rounded px-1"
          >
            <option value="">Select...</option>
            {column.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={column.type === 'email' ? 'email' : column.type === 'url' ? 'url' : 'text'}
            value={(value as string) || ''}
            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
            className="w-full bg-transparent outline-none"
            placeholder="Type here..."
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!table) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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

      {/* Table Content */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Table Name */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">📊</span>
          {editingName ? (
            <input
              type="text"
              defaultValue={table.name}
              onBlur={(e) => handleNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameChange((e.target as HTMLInputElement).value)}
              autoFocus
              className="text-3xl font-bold bg-transparent border-b border-gray-600 outline-none"
            />
          ) : (
            <h1
              onClick={() => setEditingName(true)}
              className="text-3xl font-bold cursor-pointer hover:bg-gray-800 px-2 py-1 rounded transition"
            >
              {table.name || 'Untitled Table'}
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={addColumn}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
          >
            + Add Column
          </button>
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition"
          >
            + Add Row
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                {table.columns.map((column) => (
                  <th key={column.id} className="p-3 text-left border-r border-gray-700 last:border-r-0">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                        className="bg-transparent outline-none font-medium flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <select
                          value={column.type}
                          onChange={(e) => updateColumn(column.id, { type: e.target.value as TableColumn['type'] })}
                          className="bg-gray-700 text-xs rounded px-1 py-0.5"
                        >
                          {COLUMN_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteColumn(column.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {table.rows.length === 0 ? (
                <tr>
                  <td colSpan={table.columns.length + 1} className="p-8 text-center text-gray-500">
                    No rows yet. Click "+ Add Row" to get started.
                  </td>
                </tr>
              ) : (
                table.rows.map((row) => (
                  <tr key={row.id} className="border-t border-gray-700 hover:bg-gray-800/50 group">
                    {table.columns.map((column) => (
                      <td key={column.id} className="p-3 border-r border-gray-700 last:border-r-0">
                        {renderCell(row, column)}
                      </td>
                    ))}
                    <td className="w-10 text-center">
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
