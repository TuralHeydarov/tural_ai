import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { WorkspacePage } from '@/types';

// In-memory storage (replace with database in production)
const pages: Map<string, WorkspacePage> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    let result = Array.from(pages.values());

    // Filter by parentId if provided
    if (parentId) {
      result = result.filter((page) => page.parentId === parentId);
    } else {
      // Return only root pages (no parent)
      result = result.filter((page) => !page.parentId);
    }

    // Sort by updatedAt descending
    result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return Response.json({ pages: result });
  } catch (error) {
    console.error('Get pages error:', error);
    return Response.json(
      { error: 'Failed to get pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content = '', icon, parentId } = body;

    if (!title) {
      return Response.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const page: WorkspacePage = {
      id: uuidv4(),
      title,
      content,
      icon,
      parentId,
      createdAt: now,
      updatedAt: now,
    };

    pages.set(page.id, page);

    return Response.json({ page }, { status: 201 });
  } catch (error) {
    console.error('Create page error:', error);
    return Response.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, icon, parentId } = body;

    if (!id) {
      return Response.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const existingPage = pages.get(id);
    if (!existingPage) {
      return Response.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const updatedPage: WorkspacePage = {
      ...existingPage,
      title: title ?? existingPage.title,
      content: content ?? existingPage.content,
      icon: icon ?? existingPage.icon,
      parentId: parentId ?? existingPage.parentId,
      updatedAt: new Date(),
    };

    pages.set(id, updatedPage);

    return Response.json({ page: updatedPage });
  } catch (error) {
    console.error('Update page error:', error);
    return Response.json(
      { error: 'Failed to update page' },
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
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    if (!pages.has(id)) {
      return Response.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Delete page and all children recursively
    const deleteRecursively = (pageId: string) => {
      const children = Array.from(pages.values()).filter(
        (p) => p.parentId === pageId
      );
      children.forEach((child) => deleteRecursively(child.id));
      pages.delete(pageId);
    };

    deleteRecursively(id);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete page error:', error);
    return Response.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
