import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make filename safe
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ imageUrl: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem.' }, { status: 500 });
  }
}
