'use client';

import { useCart } from '@/contexts/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartSidebar({ settings }: { settings: any }) {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (!isCartOpen) return null;

  const whatsappNumber = settings?.whatsapp || '5511948108764';

  const handleCheckout = () => {
    let message = 'Olá! Gostaria de fazer o seguinte pedido:%0A%0A';
    
    items.forEach((item) => {
      message += `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2).replace('.', ',')}%0A`;
    });
    
    message += `%0A*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
    
    // Optional: Clear cart after checkout attempt
    // clearCart();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-white/5 shadow-2xl z-[70] flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Meu Carrinho
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="font-medium tracking-wider uppercase text-sm">Seu carrinho está vazio</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-primary hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5 relative group">
                <div className="w-20 h-20 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">IMG</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-2 pr-6">{item.name}</h3>
                    <p className="text-primary font-bold text-sm mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center bg-black rounded-lg border border-white/10 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/5 p-6 bg-card space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 uppercase tracking-wider">Subtotal</span>
              <span className="font-bold text-white text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#10b981] hover:bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <ShoppingBag className="w-5 h-5" /> Enviar Pedido no WhatsApp
            </button>
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
              Você será redirecionado para o WhatsApp com a lista de itens
            </p>
          </div>
        )}
      </div>
    </>
  );
}
