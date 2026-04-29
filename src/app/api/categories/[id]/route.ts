import { NextResponse } from 'next/server';
import { deleteCategory } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteCategory(id);
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Delete category API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}