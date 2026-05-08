'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailsClient({ product, gallery }: { product: any, gallery: string[] }) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const sizes = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()) : [];
  const finalPrice = product.promoPrice ? product.promoPrice : product.price;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
      return;
    }
    
    addToCart({
      id: `${product.id}-${selectedSize || 'unico'}`,
      name: `${product.name}${selectedSize ? ` (Tamanho: ${selectedSize})` : ''}`,
      price: finalPrice,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Esquerda: Galeria */}
      <div className="space-y-4">
        <div className="aspect-[4/5] relative bg-black border border-white/5 rounded-2xl overflow-hidden group">
          {product.videoUrl ? (
            <video 
              src={product.videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image 
              src={activeImage} 
              alt={product.name} 
              fill 
              quality={100}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          {/* Badges */}
          {product.badge && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-primary text-black rounded shadow-lg">
              {product.badge}
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {gallery.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Direita: Informações */}
      <div className="flex flex-col">
        <div className="mb-2 text-primary font-bold tracking-widest uppercase text-xs">
          {product.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-6">{product.name}</h1>
        
        <div className="flex items-end gap-4 mb-8">
          <span className="text-3xl font-bold text-white">
            R$ {finalPrice.toFixed(2).replace('.', ',')}
          </span>
          {product.promoPrice && (
            <span className="text-lg text-gray-500 line-through mb-1">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        {/* Tamanhos */}
        {sizes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Escolha o Tamanho</h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg font-bold text-sm flex items-center justify-center border-2 transition-all ${
                    selectedSize === size 
                      ? 'bg-primary border-primary text-black scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-white/5 border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botão Carrinho */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#10b981] hover:bg-green-500 text-black font-bold py-5 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-8"
        >
          <ShoppingCart className="w-5 h-5" /> Adicionar ao Carrinho
        </button>

        {/* Descrição */}
        <div className="space-y-4 text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
          <h3 className="text-white font-bold uppercase tracking-wider mb-2">Sobre o Produto</h3>
          {product.description}
        </div>
        
        {/* Features Premium */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 text-xs text-gray-300 font-medium uppercase tracking-wider">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Check className="w-4 h-4" />
            </div>
            Qualidade Premium
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-300 font-medium uppercase tracking-wider">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Check className="w-4 h-4" />
            </div>
            Envio Seguro
          </div>
        </div>
      </div>
    </div>
  );
}
