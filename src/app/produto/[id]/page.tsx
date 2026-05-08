import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailsClient from './ProductDetailsClient';
import { notFound } from 'next/navigation';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    notFound();
  }

  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  
  const dbCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });
  
  // parse images if they exist
  let gallery = [product.imageUrl];
  if (product.images) {
    try {
      const extraImages = JSON.parse(product.images);
      if (Array.isArray(extraImages)) {
        gallery = [...gallery, ...extraImages];
      }
    } catch(e) {}
  }

  const allProducts = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, name: true, category: true, subcategory: true }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} categories={dbCategories} products={allProducts} />
      <main className="flex-grow container mx-auto px-4 py-12">
         <ProductDetailsClient product={product} gallery={gallery} />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
