import { NextRequest } from 'next/server';
import { WorkspaceTable } from '@/types';

// Import shared tables storage from parent route
// Note: In production, use a database instead of in-memory storage
const tables = new Map<string, WorkspaceTable>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const table = tables.get(id);

    if (!table) {
      return Response.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    return Response.json({ table });
  } catch (error) {
    console.error('Get table error:', error);
    return Response.json(
      { error: 'Failed to get table' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, columns, rows } = body;

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
