export interface Product {
  _id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  shortDescription: Record<string, string>;
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
  featured?: boolean;
  hotDeal?: boolean;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: Record<string, string>;
  slug: string;
  description?: Record<string, string>;
  image: string;
  featured: boolean;
  productCount: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export interface Order {
  _id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  district: string;
  sector: string;
  cell: string;
  address: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  district?: string;
  sector?: string;
  address?: string;
  role: 'customer' | 'admin' | 'staff';
  createdAt: Date;
}

export interface RwandaDistrict {
  district: string;
  sectors: string[];
  deliveryFee: number;
  estimatedDays: string;
}
