export const dynamic = 'force-dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import ProductCard from '@/components/ProductCard';
import ProductCarousel from '@/components/ProductCarousel';
import HowToBuy from '@/components/HowToBuy';
import { prisma } from '@/lib/prisma';
import { applyShield } from '@/lib/dbShield';
import Link from 'next/link';

export default async function Home(props: { searchParams: Promise<{ categoria?: string, subcategoria?: string, busca?: string }> }) {
  await applyShield(prisma);
  const searchParams = await props.searchParams;
  const categoria = searchParams.categoria;
  const subcategoria = searchParams.subcategoria;
  const busca = searchParams.busca;
  
  const whereClause: any = {
    active: true,
    ...(categoria ? { category: categoria } : {}),
    ...(subcategoria ? { subcategory: subcategoria } : {})
  };

  if (busca) {
    whereClause.name = {
      contains: busca
    };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  const featuredProducts = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: 'desc' }
  });

  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  // Fetch Settings
  const settings = await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global' }
  });

  // Fetch Banners
  const banners = await prisma.banner.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  });

  // Fetch Categories with images
  const dbCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });

  // Fallback to static if empty
  const categories = dbCategories.length > 0 ? dbCategories.map(c => ({
    id: c.name.toLowerCase().replace(/ /g, '-'),
    name: c.name,
    imageUrl: c.imageUrl
  })) : [
    { id: 'moletons', name: 'Moletons', imageUrl: null },
    { id: 'camisetas', name: 'Camisetas', imageUrl: null },
    { id: 'tenis', name: 'Tênis', imageUrl: null },
    { id: 'shorts', name: 'Shorts', imageUrl: null },
    { id: 'conjuntos', name: 'Conjuntos', imageUrl: null },
  ];

  const allProducts = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, name: true, category: true, subcategory: true }
  });

  return (
    <main className="min-h-screen">
      <Header settings={settings} categories={dbCategories} products={allProducts} />
      
      <Banner banners={banners} />

      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Categories Section */}
        <section id="categorias">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Categorias</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link 
                href={`/?categoria=${cat.name}#catalogo`} 
                key={cat.id}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary transition-colors overflow-hidden relative">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">FOTO</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors uppercase tracking-wider">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {!categoria && (
          <section id="destaques">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider">Destaques</h2>
              <Link href="/#catalogo" className="text-sm text-primary hover:text-white transition-colors uppercase tracking-wider font-medium">Ver todos</Link>
            </div>
            
            {displayFeatured.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5">
                <p className="text-gray-400">Nenhum produto em destaque.</p>
              </div>
            ) : (
              <ProductCarousel products={displayFeatured} settings={settings} />
            )}
          </section>
        )}

        {/* Mid Page Banner */}
        {(settings?.midBannerTitle || settings?.midBannerUrl) && (
          <section>
            <div 
              className="w-full aspect-video md:aspect-[21/9] bg-white/5 border border-white/10 flex items-center justify-center rounded-xl overflow-hidden relative group"
            >
               {settings.midBannerUrl && (
                 <img src={settings.midBannerUrl} alt={settings.midBannerTitle || "Banner"} className="absolute inset-0 w-full h-full object-cover z-0" />
               )}
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
               
               <div className="absolute z-20 text-center">
                  <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">{settings.midBannerTitle || "PROMOÇÕES"}</h3>
                  <Link href={settings.midBannerLink || "/?categoria=Promoções#catalogo"} className="inline-block bg-primary text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors">
                    Aproveitar
                  </Link>
               </div>
            </div>
          </section>
        )}

        {/* Catálogo por Categorias ou Resultados de Filtro */}
        {categoria || busca ? (
          <section id="catalogo" className="relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-2xl font-bold uppercase tracking-wider">
                {busca ? `Busca: ${busca}` : `Catálogo: ${categoria}`}
              </h2>
              <Link href="/#catalogo" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                Limpar Filtro
              </Link>
            </div>
            
            <div className="relative z-10">
              {products.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-400">Nenhum produto encontrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} settings={settings} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Grouped Categories */
          dbCategories.filter(c => !c.parentId).map(cat => {
            const catProducts = products.filter(p => p.category === cat.name);
            if (catProducts.length === 0) return null;

            return (
              <section key={cat.id} id={cat.name.toLowerCase()} className="relative">
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h2 className="text-2xl font-bold uppercase tracking-wider">{cat.name}</h2>
                  <Link href={`/?categoria=${cat.name}#catalogo`} className="text-sm text-primary hover:text-white transition-colors uppercase tracking-wider font-medium">
                    Ver todos
                  </Link>
                </div>
                
                <div className="relative z-10">
                  <ProductCarousel products={catProducts} settings={settings} />
                </div>
              </section>
            );
          })
        )}

        <HowToBuy settings={settings} />
      </div>

      <Footer settings={settings} />
    </main>
  );
}
