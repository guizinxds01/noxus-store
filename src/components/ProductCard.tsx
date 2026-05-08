'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  category: string;
  sizes: string;
  description: string;
  imageUrl?: string;
  images?: string | null;
  videoUrl?: string | null;
  badge?: string | null;
  featured?: boolean;
}

export default function ProductCard({ product, settings }: { product: Product, settings: any }) {
  const { addToCart } = useCart();
  const finalPrice = product.promoPrice ? product.promoPrice : product.price;
  const installmentValue = (finalPrice / 12).toFixed(2).replace('.', ',');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      imageUrl: product.imageUrl || '',
      quantity: 1
    });
  };

  return (
    <div className="group flex flex-col bg-[#1a202c] border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-300 relative">
      {/* Badges */}
      {product.badge ? (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-black rounded shadow-lg">
          {product.badge}
        </div>
      ) : product.featured ? (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#FFD700] text-black rounded shadow-lg flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          DESTAQUE
        </div>
      ) : null}
      {product.promoPrice && !product.badge && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white rounded shadow-lg">
          OFERTA
        </div>
      )}

      {/* Image Placeholder 4:5 */}
      <Link href={`/produto/${product.id}`} className="relative aspect-[4/5] bg-black overflow-hidden flex items-center justify-center cursor-pointer">
        {product.videoUrl ? (
          <video 
            src={product.videoUrl} 
            muted 
            loop 
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
          />
        ) : product.imageUrl && product.imageUrl !== '' ? (
          <Image 
            src={product.imageUrl} 
            alt={product.name}
            fill
            quality={100}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 z-0"
          />
        ) : (
          <span className="text-gray-500 text-sm font-medium tracking-wider">FOTO</span>
        )}
        
        {/* Overlay hover suave */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-medium text-white text-sm leading-tight mb-4 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              R${finalPrice.toFixed(2).replace('.', ',')}
            </span>
            {product.promoPrice && (
              <span className="text-xs text-gray-500 line-through">
                R${product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400">
            12 x de R${installmentValue}
          </span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#10b981] hover:bg-green-500 text-white font-bold text-xs py-3 px-4 transition-colors flex items-center justify-center gap-2 rounded uppercase tracking-widest"
          aria-label="Adicionar ao Carrinho"
        >
          <ShoppingCart className="w-4 h-4" /> Adicionar
        </button>
      </div>
    </div>
  );
}
