import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { WorkspaceTable, TableColumn, TableRow } from '@/types';

// In-memory storage (replace with database in production)
const tables: Map<string, WorkspaceTable> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const table = tables.get(id);
      if (!table) {
        return Response.json(
          { error: 'Table not found' },
          { status: 404 }
        );
      }
      return Response.json({ table });
    }

    const result = Array.from(tables.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return Response.json({ tables: result });
  } catch (error) {
    console.error('Get tables error:', error);
    return Response.json(
      { error: 'Failed to get tables' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, columns = [], rows = [] } = body;

    if (!name) {
      return Response.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Create default columns if none provided
    const tableColumns: TableColumn[] = columns.length > 0
      ? columns.map((col: Partial<TableColumn>) => ({
          id: col.id || uuidv4(),
          name: col.name || 'Column',
          type: col.type || 'text',
          options: col.options,
        }))
      : [
          { id: uuidv4(), name: 'Name', type: 'text' as const },
          { id: uuidv4(), name: 'Status', type: 'select' as const, options: ['Todo', 'In Progress', 'Done'] },
        ];

    const tableRows: TableRow[] = rows.map((row: Partial<TableRow>) => ({
      id: row.id || uuidv4(),
      cells: row.cells || {},
    }));

    const table: WorkspaceTable = {
      id: uuidv4(),
      name,
      columns: tableColumns,
      rows: tableRows,
      createdAt: now,
      updatedAt: now,
    };

    tables.set(table.id, table);

    return Response.json({ table }, { status: 201 });
  } catch (error) {
    console.error('Create table error:', error);
    return Response.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, columns, rows } = body;

    if (!id) {
      return Response.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    const existingTable = tables.get(id);
    if (!existingTable) {
      return Response.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    const updatedTable: WorkspaceTable = {
      ...existingTable,
      name: name ?? existingTable.name,
      columns: columns ?? existingTable.columns,
      rows: rows ?? existingTable.rows,
      updatedAt: new Date(),
    };

    tables.set(id, updatedTable);

    return Response.json({ table: updatedTable });
  } catch (error) {
    console.error('Update table error:', error);
    return Response.json(
      { error: 'Failed to update table' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    if (!tables.has(id)) {
      return Response.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    tables.delete(id);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete table error:', error);
    return Response.json(
      { error: 'Failed to delete table' },
      { status: 500 }
    );
  }
}
