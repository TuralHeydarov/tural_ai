import { NextRequest } from 'next/server';

// Import shared pages storage from parent route
// Note: In production, use a database instead of in-memory storage
const pages = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const page = pages.get(id);

    if (!page) {
      return Response.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return Response.json({ page });
  } catch (error) {
    console.error('Get page error:', error);
    return Response.json(
      { error: 'Failed to get page' },
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
    const { title, content, icon, parentId } = body;

    const existingPage = pages.get(id);
    if (!existingPage) {
      return Response.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const updatedPage = {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!pages.has(id)) {
      return Response.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Delete page and all children recursively
    const deleteRecursively = (pageId: string) => {
      const children = Array.from(pages.values()).filter(
        (p: any) => p.parentId === pageId
      );
      children.forEach((child: any) => deleteRecursively(child.id));
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
