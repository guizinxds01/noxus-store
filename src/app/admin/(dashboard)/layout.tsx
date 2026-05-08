import Link from 'next/link';
import { Package, LayoutDashboard, Tags, Image as ImageIcon, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold tracking-widest uppercase">Noxus Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Package className="w-5 h-5" />
            Produtos
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Tags className="w-5 h-5" />
            Categorias
          </Link>
          <Link href="/admin/banners" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <ImageIcon className="w-5 h-5" />
            Banners
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
            Configurações
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
