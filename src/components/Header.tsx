'use client';

import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from '@/components/CartSidebar';

export default function Header({ settings, categories = [], products = [] }: { settings?: any, categories?: any[], products?: any[] }) {
  const router = useRouter();
  const { items, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?busca=${encodeURIComponent(searchQuery)}#catalogo`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden text-gray-300 hover:text-white transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-widest uppercase h-20">
              <Link href="/" className="text-white hover:text-primary transition-colors">Início</Link>
              
              <div className="group h-full flex items-center relative">
                <Link href="/#categorias" className="text-gray-400 hover:text-white transition-colors">Categorias</Link>
                
                {categories.length > 0 && (
                  <div className="absolute top-full -left-4 w-[800px] bg-[#0c0c0c] border border-white/10 shadow-2xl p-8 hidden group-hover:grid grid-cols-4 gap-8 rounded-b-xl z-50">
                    {categories.filter(c => !c.parentId).map(parent => {
                      const catProducts = products.filter(p => p.category === parent.name);
                      return (
                        <div key={parent.id} className="space-y-4">
                          <Link href={`/?categoria=${parent.name}#catalogo`} className="font-bold text-white uppercase tracking-wider block hover:text-primary transition-colors border-b border-white/10 pb-2 mb-2">{parent.name}</Link>
                          <div className="flex flex-col gap-3 text-sm capitalize">
                            {catProducts.length > 0 ? (
                              catProducts.map(p => (
                                <Link key={p.id} href={`/produto/${p.id}`} className="text-gray-400 hover:text-white transition-colors block truncate" title={p.name}>
                                  {p.name.toLowerCase()}
                                </Link>
                              ))
                            ) : (
                              <span className="text-gray-600 italic">Vazio</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <Link href="/#catalogo" className="text-gray-400 hover:text-white transition-colors">Catálogo</Link>
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <style>{`
              @keyframes spinY {
                from { transform: perspective(1000px) rotateY(0deg); }
                to { transform: perspective(1000px) rotateY(360deg); }
              }
              .animate-spin-y {
                animation: spinY 8s linear infinite;
              }
            `}</style>
            <Link href="/" className="flex items-center justify-center py-2">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-10 scale-[1.8] md:scale-100 md:h-20 object-contain drop-shadow-xl animate-spin-y" />
              ) : (
                <div className="w-40 h-12 bg-white/5 border border-white/10 flex items-center justify-center font-bold tracking-[0.5em] text-white/50 text-xl uppercase animate-spin-y">
                  LOGO
                </div>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-6 text-gray-300">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  autoFocus
                  className="bg-transparent border-b border-white/30 text-white px-2 py-1 focus:outline-none focus:border-primary w-24 md:w-40 transition-all"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
            )}

            <div className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Menu Mobile */}
    {isMenuOpen && (
      <div className="fixed inset-0 z-[60] lg:hidden">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className="absolute top-0 left-0 bottom-0 w-64 bg-card border-r border-white/5 shadow-2xl flex flex-col transform transition-transform duration-300">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <span className="font-bold tracking-[0.3em] uppercase text-white/50 text-xl">MENU</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col p-6 gap-6 text-sm font-medium tracking-widest uppercase">
            <Link onClick={() => setIsMenuOpen(false)} href="/" className="text-white hover:text-primary transition-colors">Início</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/#categorias" className="text-gray-400 hover:text-white transition-colors">Categorias</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/#catalogo" className="text-gray-400 hover:text-white transition-colors">Catálogo</Link>
          </nav>
        </div>
      </div>
    )}

    <CartSidebar settings={settings} />
  </>
  );
}
