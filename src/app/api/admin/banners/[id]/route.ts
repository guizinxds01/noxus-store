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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const resolvedParams = await params;
  try {
    const body = await req.json();
    const banner = await prisma.banner.update({
      where: { id: resolvedParams.id },
      data: {
        imageUrl: body.imageUrl,
        title: body.title || null,
        subtitle: body.subtitle || null,
        buttonText: body.buttonText || null,
        buttonLink: body.buttonLink || null,
        active: body.active !== false,
        order: body.order || 0,
        fit: body.fit || 'cover'
      }
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar banner' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const resolvedParams = await params;
  try {
    await prisma.banner.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar banner' }, { status: 500 });
  }
}
