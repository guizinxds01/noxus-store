import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

async function verifyAuth(req: Request) {
  const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    await jwtVerify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const parsedPrice = parseFloat(body.price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ error: 'Preço inválido' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name || 'Produto sem nome',
        price: parsedPrice,
        promoPrice: body.promoPrice ? parseFloat(body.promoPrice) : null,
        category: body.category || 'Moletons',
        subcategory: body.subcategory || null,
        sizes: body.sizes || '',
        colors: body.colors || '',
        sku: body.sku || '',
        description: body.description || '',
        imageUrl: body.imageUrl || '',
        images: body.images || null,
        videoUrl: body.videoUrl || null,
        featured: Boolean(body.featured),
        active: body.active !== false,
        badge: body.badge || null,
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
