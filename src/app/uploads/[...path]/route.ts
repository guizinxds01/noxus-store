import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const params = await props.params;
  const filePath = params.path.join('/');
  
  // Security: prevent path traversal
  if (filePath.includes('..')) {
    return new NextResponse('Invalid path', { status: 400 });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const storagePath = isProduction ? '/app/data/uploads' : path.join(process.cwd(), 'public', 'uploads');
  
  const absolutePath = path.join(storagePath, filePath);

  try {
    const fileBuffer = await readFile(absolutePath);
    
    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4'
    }[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    // If not found in volume/storage, try public folder as fallback (for repo images)
    try {
        const fallbackPath = path.join(process.cwd(), 'public', 'uploads', filePath);
        const fallbackBuffer = await readFile(fallbackPath);
        return new NextResponse(fallbackBuffer, {
            headers: {
              'Content-Type': 'image/jpeg', // Default or detect
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
    } catch (e) {
        return new NextResponse('File not found', { status: 404 });
    }
  }
}
