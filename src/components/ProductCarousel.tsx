'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ products, settings }: { products: any[], settings: any }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {products.length > 4 && (
        <>
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 bg-[#0A0A0A] hover:bg-primary text-white hover:text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 bg-[#0A0A0A] hover:bg-primary text-white hover:text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      
      <div 
        ref={carouselRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[calc(50%-0.5rem)] lg:min-w-[calc(25%-1.125rem)] snap-start">
            <ProductCard product={product} settings={settings} />
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </div>
  );
}
