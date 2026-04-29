import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryData = {
      name: body.name,
      slug: body.slug,
      image: body.image,
      featured: body.featured || false,
      productCount: body.productCount || 0
    };

    const result = await createCategory(categoryData);
    return NextResponse.json({ success: true, id: result.toString() });
  } catch (error) {
    console.error('Create category API error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
