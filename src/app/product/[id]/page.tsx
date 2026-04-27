'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { ShoppingCart, Minus, Plus, Star, Truck, Shield, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem, setIsOpen } = useCart();
  const { language } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-beige py-12 text-center">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-beige py-12 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addItem(product._id, quantity);
    setIsOpen(true);
  };

   const formatPrice = (price: number | undefined) => {
     if (price === undefined || price === null) {
       return '0 RWF';
     }
     return `${price.toLocaleString()} RWF`;
   };

  return (
    <div className="min-h-screen bg-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          Home / {product.category} / {product.name?.[language] || product.name?.en || 'Product'}
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Images */}
          <div>
           <div className="bg-white rounded-lg p-4 mb-4">
               <div className="aspect-square relative bg-beige-light">
                  <img
                    src={(product.images && product.images[selectedImage]) || 'https://placehold.co/600x600?text=No+Image'}
                     alt={product.name?.[language] || product.name?.en || 'Product'}
                    className="w-full h-full object-contain"
                  />
                {product.hotDeal && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 font-bold rounded">
                    HOT DEAL
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-4 right-4 bg-gold text-black px-3 py-1 font-bold rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

             {/* Thumbnails */}
             <div className="flex gap-2">
                {((product.images && product.images.length > 0) ? product.images : ['https://placehold.co/600x600?text=No+Image']).map((img, idx) => (
                 <button
                   key={idx}
                   onClick={() => setSelectedImage(idx)}
                   className={`w-16 h-16 border-2 rounded ${
                     selectedImage === idx ? 'border-gold' : 'border-gray-200'
                   }`}
                 >
                   <img src={img} alt="" className="w-full h-full object-cover rounded" />
                 </button>
               ))}
             </div>
          </div>

          {/* Details */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow">
              {/* Brand */}
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.brand}
              </p>

               {/* Name */}
               <h1 className="text-2xl md:text-3xl font-bold mb-4">
                 {((product.name && product.name[language]) || (product.name && product.name.en) || 'Product Name')}
               </h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-gold text-gold' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-500 ml-2">(12 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

               {/* Short description */}
               <p className="text-gray-700 mb-6">
                 {((product.shortDescription && product.shortDescription[language]) || (product.shortDescription && product.shortDescription.en) || '')}
               </p>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-block w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.inStock && <span className="text-gray-500">({product.stockQuantity} available)</span>}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-beige"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-4 py-2 hover:bg-beige"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => { addItem(product._id, quantity); window.location.href = '/checkout'; }}
                  disabled={!product.inStock}
                  className="flex-1 btn-secondary"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust features */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  Fast Delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  1 Year Warranty
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Support
                </div>
              </div>
            </div>

             {/* Full description */}
             <div className="bg-white rounded-lg p-6 shadow mt-6">
               <h2 className="text-xl font-bold mb-4">Product Description</h2>
               <p className="text-gray-700 whitespace-pre-line">
                 {((product.description && product.description[language]) || (product.description && product.description.en) || '')}
               </p>
             </div>

            {/* Specifications */}
            {product.specs && (
              <div className="bg-white rounded-lg p-6 shadow mt-6">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 font-medium text-gray-600">{key}</td>
                        <td className="py-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

          {/* Related Products */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <ProductCard
                  key={i}
                  product={product ? {
                    ...product,
                    _id: `${product._id}-${i}`,
                    name: { ...product.name, en: `Related ${i + 1}` },
                    description: { ...product.description, en: `Description for related product ${i + 1}` },
                    shortDescription: { ...product.shortDescription, en: `Short description for related product ${i + 1}` },
                    price: product.price * (0.8 + i * 0.1),
                  } : {
                    _id: `placeholder-${i}`,
                    name: { en: 'Related Product', rw: 'Ikinini koreshejwe' },
                    description: { en: 'Placeholder description', rw: 'Igihumbi kikumbuye' },
                    shortDescription: { en: 'Short desc', rw: 'Igihumbi cyangwa' },
                    price: 0,
                    images: ['https://placehold.co/600x600?text=No+Image'],
                    category: 'Placeholder',
                    categorySlug: 'placeholder',
                    brand: 'Placeholder Brand',
                    inStock: true,
                    stockQuantity: 10,
                    tags: [],
                    specs: {},
                    featured: false,
                    hotDeal: false,
                    discount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                />
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
