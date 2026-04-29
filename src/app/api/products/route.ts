import { NextResponse } from 'next/server';
import { getAllProducts, getProductById, createProduct } from '@/lib/db';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productData = {
      name: body.name,
      description: body.description || { en: 'New product description', rw: 'Umwirondoro mushya' },
      shortDescription: body.shortDescription || { en: 'Short description', rw: 'Umwirondoro muto' },
      price: body.price,
      images: body.images || [],
      category: body.category,
      categorySlug: body.categorySlug || body.category.toLowerCase().replace(/\s+/g, '-'),
      brand: body.brand,
      inStock: body.inStock !== undefined ? body.inStock : true,
      stockQuantity: body.stockQuantity,
      tags: body.tags || [],
      featured: body.featured || false,
      hotDeal: body.hotDeal || false,
    };

    const result = await createProduct(productData);
    return NextResponse.json({ success: true, id: result.toString() });
  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
