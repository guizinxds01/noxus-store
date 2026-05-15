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
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: 'global' } });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const isAuth = await verifyAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const settings = await prisma.settings.update({
      where: { id: 'global' },
      data: {
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        primaryColor: body.primaryColor,
        whatsapp: body.whatsapp,
        whatsappMsg: body.whatsappMsg,
        instagram: body.instagram,
        tiktok: body.tiktok,
        midBannerUrl: body.midBannerUrl,
        midBannerTitle: body.midBannerTitle,
        midBannerLink: body.midBannerLink,
        shippingFee: body.shippingFee ? parseFloat(body.shippingFee) : 0,
        freeShippingThreshold: body.freeShippingThreshold ? parseFloat(body.freeShippingThreshold) : 0,
      }
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Update Settings Error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 });
  }
}
