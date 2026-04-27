'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Product {
  _id: string;
  price: number;
  stockQuantity: number;
  featured: boolean;
  hotDeal: boolean;
  createdAt: Date;
  [key: string]: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem('jptech-admin');
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [router]);

  const today = new Date();
  const todayOrders = Math.floor(Math.random() * 25) + 10;
  const todayRevenue = todayOrders * 150000;
  const lowStock = products.filter(p => p.stockQuantity < 10).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold">JP Tech Admin</h2>
        </div>
        <nav className="mt-6">
          <Link href="/admin/dashboard" className="block px-6 py-3 bg-gold text-black font-semibold">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-6 py-3 hover:bg-gray-800">
            Products
          </Link>
          <Link href="/admin/orders" className="block px-6 py-3 hover:bg-gray-800">
            Orders
          </Link>
          <Link href="/admin/categories" className="block px-6 py-3 hover:bg-gray-800">
            Categories
          </Link>
          <button
            onClick={() => { localStorage.removeItem('jptech-admin'); router.push('/admin/login'); }}
            className="w-full text-left px-6 py-3 hover:bg-gray-800 text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Orders</p>
                <p className="text-2xl font-bold">{todayOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-bold">{(todayRevenue / 1000000).toFixed(1)}M RWF</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Low Stock Alerts</p>
                <p className="text-2xl font-bold">{lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">Manage Products</h3>
            <p className="text-gray-500 text-sm">Add, edit, or remove products from catalog</p>
          </Link>
          <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">View Orders</h3>
            <p className="text-gray-500 text-sm">Process and track customer orders</p>
          </Link>
          <Link href="/admin/categories" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">Categories</h3>
            <p className="text-gray-500 text-sm">Manage product categories and banners</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
