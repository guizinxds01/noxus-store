import { Search, ShoppingBag, ShoppingCart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function HowToBuy({ settings }: { settings: any }) {
  const whatsappNumber = settings?.whatsapp || "5511948108764";
  
  const steps = [
    {
      id: 1,
      title: "Navegue pelo site",
      desc: "Explore nossos produtos e encontre o modelo ideal para você.",
      icon: <Search className="w-8 h-8 text-cyan-400" />,
      color: "from-cyan-400/20 to-transparent",
      borderColor: "group-hover:border-cyan-400/50"
    },
    {
      id: 2,
      title: "Escolha seu produto",
      desc: "Selecione o produto, escolha o tamanho desejado e adicione ao carrinho.",
      icon: <ShoppingBag className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-400/20 to-transparent",
      borderColor: "group-hover:border-yellow-400/50"
    },
    {
      id: 3,
      title: "Vá até o carrinho",
      desc: "Clique no carrinho para revisar os produtos escolhidos.",
      icon: <ShoppingCart className="w-8 h-8 text-primary" />,
      color: "from-primary/20 to-transparent",
      borderColor: "group-hover:border-primary/50"
    },
    {
      id: 4,
      title: "Finalize pelo WhatsApp",
      desc: "Envie seu pedido diretamente pelo WhatsApp para finalizar sua compra com atendimento rápido.",
      icon: <MessageCircle className="w-8 h-8 text-green-500" />,
      color: "from-green-500/20 to-transparent",
      borderColor: "group-hover:border-green-500/50"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
            Como Comprar na <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">Noxus Store</span>
          </h2>
          <p className="text-gray-400 md:text-lg">
            Compre de forma rápida, simples e segura diretamente pelo WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`group bg-[#111] border border-white/5 rounded-2xl p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${step.borderColor}`}
            >
              {/* Gradient BG on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  {step.icon}
                </div>
                
                <div className="absolute top-4 right-4 text-white/5 font-black text-6xl select-none group-hover:text-white/10 transition-colors">
                  {step.id}
                </div>

                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a 
            href={`https://wa.me/${whatsappNumber}?text=Olá, estava navegando no site e gostaria de fazer um pedido!`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider overflow-hidden shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:shadow-[0_0_60px_rgba(37,211,102,0.5)] transition-all"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <MessageCircle className="w-6 h-6 fill-white" />
            <span>Fazer Pedido Agora</span>
          </a>
        </div>
      </div>
    </section>
  );
}
