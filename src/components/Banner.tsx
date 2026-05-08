'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BannerItem {
  id: string;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  fit?: string;
}

export default function Banner({ banners }: { banners?: BannerItem[] }) {
  const [current, setCurrent] = useState(0);

  const fallbackSlides = [
    { id: '1', title: 'NOVA COLEÇÃO', subtitle: 'STREETWEAR ESSENTIALS', imageUrl: '', buttonText: null, buttonLink: null, fit: 'cover' },
    { id: '2', title: 'PROMOÇÃO', subtitle: 'ATÉ 50% OFF', imageUrl: '', buttonText: null, buttonLink: null, fit: 'cover' },
    { id: '3', title: 'EXCLUSIVOS', subtitle: 'PEÇAS LIMITADAS', imageUrl: '', buttonText: null, buttonLink: null, fit: 'cover' },
  ];

  const slides = banners && banners.length > 0 ? banners : fallbackSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-black overflow-hidden">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id || i} className="min-w-full h-full flex items-center justify-center relative border-r border-white/5 overflow-hidden">
            {/* Background Image or Placeholder */}
            {slide.imageUrl && slide.imageUrl !== '' ? (
              <img src={slide.imageUrl} alt={slide.title || 'Banner'} className={`absolute inset-0 w-full h-full z-0 ${slide.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
            ) : (
              <span className="absolute text-white/5 font-bold text-[10vw] select-none z-0">
                BANNER {i + 1}
              </span>
            )}
            
            <div className="z-10 text-center px-4">
              {slide.subtitle && <p className="text-primary font-medium tracking-[0.3em] text-sm mb-2 uppercase drop-shadow-md">{slide.subtitle}</p>}
              {slide.title && <h2 className="text-2xl md:text-7xl font-bold text-white uppercase tracking-tighter drop-shadow-lg mb-4 md:mb-6">
                {slide.title}
              </h2>}
              {slide.buttonText && slide.buttonLink && (
                <Link href={slide.buttonLink} className="inline-block bg-primary text-black px-6 py-2 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors text-xs md:text-base">
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  current === i ? 'bg-primary w-6' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
