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
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        imageUrl: body.imageUrl || null,
        parentId: body.parentId || null,
        order: body.order || 0
      }
    });
    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Erro detalhado Category POST:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria', details: error.message }, { status: 500 });
  }
}
