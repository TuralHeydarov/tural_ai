'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkspaceTable, TableColumn, TableRow } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const COLUMN_TYPES: { value: TableColumn['type']; label: string }[] = [
  { value: 'text', label: '📝 Text' },
  { value: 'number', label: '🔢 Number' },
  { value: 'date', label: '📅 Date' },
  { value: 'select', label: '🔘 Select' },
  { value: 'checkbox', label: '☑️ Checkbox' },
  { value: 'url', label: '🔗 URL' },
  { value: 'email', label: '📧 Email' },
];

export default function TableEditorPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;
  
  const [table, setTable] = useState<WorkspaceTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null);
  const [editingColumnName, setEditingColumnName] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<TableColumn['type']>('text');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      router.push('/workspace');
    } finally {
      setLoading(false);
    }
  };

  const saveTable = useCallback(async (updates: Partial<WorkspaceTable>) => {
    if (!table) return;
    
    setSaving(true);
    try {
      await fetch('/api/workspace/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tableId, ...updates }),
      });
      setTable((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error('Failed to save table:', error);
    } finally {
      setSaving(false);
    }
  }, [table, tableId]);

  const debouncedSave = useCallback((updates: Partial<WorkspaceTable>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveTable(updates);
    }, 500);
  }, [saveTable]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setTable((prev) => (prev ? { ...prev, name } : null));
    debouncedSave({ name });
  };

  const addColumn = () => {
    if (!table || !newColumnName.trim()) return;
    
    const newColumn: TableColumn = {
      id: uuidv4(),
      name: newColumnName.trim(),
      type: newColumnType,
    };
    
    const columns = [...table.columns, newColumn];
    setTable({ ...table, columns });
    saveTable({ columns });
    setNewColumnName('');
    setNewColumnType('text');
    setShowAddColumn(false);
  };

  const updateColumnName = (colId: string, name: string) => {
    if (!table) return;
    
    const columns = table.columns.map((col) =>
      col.id === colId ? { ...col, name } : col
    );
    setTable({ ...table, columns });
    debouncedSave({ columns });
  };

  const deleteColumn = (colId: string) => {
    if (!table || !confirm('Delete this column?')) return;
    
    const columns = table.columns.filter((col) => col.id !== colId);
    const rows = table.rows.map((row) => {
      const { [colId]: _, ...cells } = row.cells;
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

  const deleteRow = (rowId: string) => {
    if (!table) return;
    
    const rows = table.rows.filter((row) => row.id !== rowId);
    setTable({ ...table, rows });
    saveTable({ rows });
  };

  const updateCell = (rowId: string, colId: string, value: unknown) => {
    if (!table) return;
    
    const rows = table.rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          cells: { ...row.cells, [colId]: value },
        };
      }
      return row;
    });
    
    setTable({ ...table, rows });
    debouncedSave({ rows });
  };

  const renderCellInput = (row: TableRow, col: TableColumn) => {
    const value = row.cells[col.id];
    const isEditing = editingCell?.rowId === row.id && editingCell?.colId === col.id;

    switch (col.type) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => updateCell(row.id, col.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={String(value || '')}
            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
            className="w-full px-2 py-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <option value="">Select...</option>
            {col.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={String(value || '')}
            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
            className="w-full px-2 py-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={String(value || '')}
            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
            onFocus={() => setEditingCell({ rowId: row.id, colId: col.id })}
            onBlur={() => setEditingCell(null)}
            className="w-full px-2 py-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
          />
        );

      case 'url':
        return isEditing ? (
          <input
            type="url"
            value={String(value || '')}
            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="w-full px-2 py-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="https://..."
          />
        ) : (
          <div
            onClick={() => setEditingCell({ rowId: row.id, colId: col.id })}
            className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded truncate"
          >
            {value ? (
              <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {String(value)}
              </a>
            ) : (
              <span className="text-gray-400">Click to add URL</span>
            )}
          </div>
        );

      case 'email':
        return isEditing ? (
          <input
            type="email"
            value={String(value || '')}
            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="w-full px-2 py-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="email@example.com"
          />
        ) : (
          <div
            onClick={() => setEditingCell({ rowId: row.id, colId: col.id })}
            className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded truncate"
          >
            {value ? (
              <a href={`mailto:${String(value)}`} className="text-blue-600 hover:underline">
                {String(value)}
              </a>
            ) : (
              <span className="text-gray-400">Click to add email</span>
            )}
          </div>
        );

      default: // text
        return isEditing ? (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => updateCell(row.id, col.id, e.target.value)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="w-full px-2 py-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded"
          />
        ) : (
          <div
            onClick={() => setEditingCell({ rowId: row.id, colId: col.id })}
            className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded min-h-[28px]"
          >
            {String(value || '') || <span className="text-gray-400">Click to edit</span>}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!table) {
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
            <span className="text-2xl">📊</span>
            <input
              type="text"
              value={table.name}
              onChange={handleNameChange}
              placeholder="Untitled Table"
              className="text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-sm text-gray-500">Saving...</span>
          )}
          <span className="text-sm text-gray-400">
            {table.columns.length} columns · {table.rows.length} rows
          </span>
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {table.columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-4 py-2 text-left border border-gray-200 dark:border-gray-700 min-w-[150px]"
                  >
                    {editingColumnName === col.id ? (
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => updateColumnName(col.id, e.target.value)}
                        onBlur={() => setEditingColumnName(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingColumnName(null)}
                        autoFocus
                        className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-blue-500 rounded outline-none"
                      />
                    ) : (
                      <div className="flex items-center justify-between gap-2 group">
                        <span
                          onClick={() => setEditingColumnName(col.id)}
                          className="cursor-pointer hover:text-blue-600"
                        >
                          {col.name}
                        </span>
                        <button
                          onClick={() => deleteColumn(col.id)}
                          className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete column"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {COLUMN_TYPES.find((t) => t.value === col.type)?.label}
                    </div>
                  </th>
                ))}
                {/* Add Column */}
                <th className="px-4 py-2 border border-gray-200 dark:border-gray-700 min-w-[50px]">
                  {showAddColumn ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="Column name"
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        autoFocus
                      />
                      <select
                        value={newColumnType}
                        onChange={(e) => setNewColumnType(e.target.value as TableColumn['type'])}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      >
                        {COLUMN_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-1">
                        <button
                          onClick={addColumn}
                          className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddColumn(false)}
                          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddColumn(true)}
                      className="w-full py-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Add column"
                    >
                      +
                    </button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {table.columns.map((col) => (
                    <td
                      key={`${row.id}-${col.id}`}
                      className="px-2 py-1 border border-gray-200 dark:border-gray-700"
                    >
                      {renderCellInput(row, col)}
                    </td>
                  ))}
                  <td className="px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete row"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <button
          onClick={addRow}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          + Add row
        </button>
      </div>
    </div>
  );
}
