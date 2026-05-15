export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { Package, Eye, LayoutDashboard, Tags } from 'lucide-react';

export default async function DashboardHome() {
  const productsCount = await prisma.product.count();
  const categoriesCount = await prisma.category.count();
  const bannersCount = await prisma.banner.count();

  // Basic clicks simulation based on a real DB column
  const products = await prisma.product.findMany({
    orderBy: { clicks: 'desc' },
    take: 5
  });

  const totalClicks = products.reduce((acc, p) => acc + p.clicks, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-white/5 p-6 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="uppercase tracking-wider text-xs font-bold">Produtos</span>
          </div>
          <span className="text-4xl font-bold text-white">{productsCount}</span>
        </div>
        
        <div className="bg-card border border-white/5 p-6 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Tags className="w-5 h-5 text-primary" />
            <span className="uppercase tracking-wider text-xs font-bold">Categorias</span>
          </div>
          <span className="text-4xl font-bold text-white">{categoriesCount}</span>
        </div>

        <div className="bg-card border border-white/5 p-6 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="uppercase tracking-wider text-xs font-bold">Banners Ativos</span>
          </div>
          <span className="text-4xl font-bold text-white">{bannersCount}</span>
        </div>

        <div className="bg-card border border-white/5 p-6 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Eye className="w-5 h-5 text-primary" />
            <span className="uppercase tracking-wider text-xs font-bold">Cliques WhatsApp</span>
          </div>
          <span className="text-4xl font-bold text-white">{totalClicks}</span>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Produtos Mais Acessados</h3>
        {products.length === 0 ? (
          <p className="text-gray-400">Nenhum clique registrado ainda.</p>
        ) : (
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center overflow-hidden">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-500">FOTO</span>}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{p.name}</h4>
                    <span className="text-xs text-gray-400 uppercase">{p.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-primary font-bold">{p.clicks} cliques</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
