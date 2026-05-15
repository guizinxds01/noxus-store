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

export async function POST(req: Request) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { products, banners, categories, settings } = await req.json();

    console.log('Restoring data...');

    // Restore Categories
    if (categories) {
      for (const cat of categories) {
        await prisma.category.upsert({
          where: { id: cat.id },
          update: cat,
          create: cat,
        });
      }
    }

    // Restore Products
    if (products) {
      for (const prod of products) {
        await prisma.product.upsert({
          where: { id: prod.id },
          update: prod,
          create: prod,
        });
      }
    }

    // Restore Banners
    if (banners) {
      for (const ban of banners) {
        await prisma.banner.upsert({
          where: { id: ban.id },
          update: ban,
          create: ban,
        });
      }
    }

    // Restore Settings
    if (settings) {
      await prisma.settings.upsert({
        where: { id: settings.id },
        update: settings,
        create: settings,
      });
    }

    return NextResponse.json({ success: true, message: 'Dados restaurados com sucesso!' });
  } catch (error) {
    console.error('Restore Error:', error);
    return NextResponse.json({ error: 'Erro ao restaurar dados' }, { status: 500 });
  }
}
