import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

// Génère un client token pour upload direct vers Vercel Blob.
// Le navigateur appelle ce endpoint (fetch normal avec cookies),
// puis utilise le token retourné avec put() de @vercel/blob/client.
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { pathname } = await request.json();
    if (!pathname) {
      return NextResponse.json({ error: 'pathname requis' }, { status: 400 });
    }

    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      allowedContentTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
        'video/mp4',
        'video/webm',
      ],
      maximumSizeInBytes: 200 * 1024 * 1024, // 200 Mo
    });

    return NextResponse.json({ clientToken });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Upload token error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
