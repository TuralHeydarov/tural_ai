import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { WorkspaceTable, TableRow } from '@/types';

// Import shared tables storage
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

    return Response.json({ rows: table.rows });
  } catch (error) {
    console.error('Get rows error:', error);
    return Response.json(
      { error: 'Failed to get rows' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const { cells = {} } = body;

    const newRow: TableRow = {
      id: uuidv4(),
      cells,
    };

    table.rows.push(newRow);
    table.updatedAt = new Date();
    tables.set(id, table);

    return Response.json(
      { row: newRow },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create row error:', error);
    return Response.json(
      { error: 'Failed to create row' },
      { status: 500 }
    );
  }
}
