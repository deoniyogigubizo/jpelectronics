import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface ProductDocument {
  _id?: ObjectId;
  name: { en: string; rw: string };
  description: { en: string; rw: string };
  shortDescription: { en: string; rw: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  specs?: Record<string, string>;
  featured: boolean;
  hotDeal: boolean;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllProducts(filter?: { category?: string; brand?: string; featured?: boolean; hotDeal?: boolean }) {
  const db = await connectToDatabase();
  const query: Record<string, unknown> = {};

  if (filter?.category) {
    query.category = filter.category;
  }
  if (filter?.brand) {
    query.brand = filter.brand;
  }
  if (filter?.featured) {
    query.featured = true;
  }
  if (filter?.hotDeal) {
    query.hotDeal = true;
  }

  const products = await db.collection('products').find(query).sort({ createdAt: -1 }).toArray();
  return products.map(p => ({
    ...p,
    _id: p._id.toString(),
    name: p.name as { en: string; rw: string },
    description: p.description as { en: string; rw: string },
    shortDescription: p.shortDescription as { en: string; rw: string },
    price: p.price as number,
    compareAtPrice: p.compareAtPrice as number | undefined,
    images: p.images as string[],
    category: p.category as string,
    categorySlug: p.categorySlug as string,
    brand: p.brand as string,
    inStock: p.inStock as boolean,
    stockQuantity: p.stockQuantity as number,
    tags: p.tags as string[],
    specs: p.specs as Record<string, string> | undefined,
    featured: p.featured as boolean,
    hotDeal: p.hotDeal as boolean,
    discount: p.discount as number | undefined,
    createdAt: p.createdAt as Date,
    updatedAt: p.updatedAt as Date,
  }));
}

export async function getProductById(id: string) {
  const db = await connectToDatabase();
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  if (!product) return null;
  return {
    ...product,
    _id: product._id.toString(),
    name: product.name as { en: string; rw: string },
    description: product.description as { en: string; rw: string },
    shortDescription: product.shortDescription as { en: string; rw: string },
    price: product.price as number,
    compareAtPrice: product.compareAtPrice as number | undefined,
    images: product.images as string[],
    category: product.category as string,
    categorySlug: product.categorySlug as string,
    brand: product.brand as string,
    inStock: product.inStock as boolean,
    stockQuantity: product.stockQuantity as number,
    tags: product.tags as string[],
    specs: product.specs as Record<string, string> | undefined,
    featured: product.featured as boolean,
    hotDeal: product.hotDeal as boolean,
    discount: product.discount as number | undefined,
    createdAt: product.createdAt as Date,
    updatedAt: product.updatedAt as Date,
  };
}

export async function getProductBySlug(slug: string) {
  const db = await connectToDatabase();
  const product = await db.collection('products').findOne({ slug });
  return product ? { ...product, _id: product._id.toString() } : null;
}

export async function getCategories() {
  const db = await connectToDatabase();
  const categories = await db.collection('categories').find({}).toArray();
  return categories.map(c => ({
    ...c,
    _id: c._id.toString(),
    name: c.name as { en: string; rw: string },
    slug: c.slug as string,
    image: c.image as string,
    featured: c.featured as boolean,
    productCount: c.productCount as number,
  }));
}

export async function createProduct(data: Omit<ProductDocument, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await connectToDatabase();
  const now = new Date();
  const product = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection('products').insertOne(product);
  return result.insertedId;
}

export async function updateProduct(id: string, data: Partial<Omit<ProductDocument, '_id' | 'createdAt' | 'updatedAt'>>) {
  const db = await connectToDatabase();
  const updates = {
    ...data,
    updatedAt: new Date(),
  };
  return db.collection('products').updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
}

export async function deleteProduct(id: string) {
  const db = await connectToDatabase();
  return db.collection('products').deleteOne({ _id: new ObjectId(id) });
}

export async function createCategory(data: { name: { en: string; rw: string }; slug: string; image: string; featured: boolean; productCount: number }) {
  const db = await connectToDatabase();
  const result = await db.collection('categories').insertOne({
    ...data,
    createdAt: new Date(),
  });
  return result.insertedId;
}
