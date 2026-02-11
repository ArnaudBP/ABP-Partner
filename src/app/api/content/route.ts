import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteContent, updateSiteContent } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { SiteContent } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const content: Partial<SiteContent> = await request.json();
    await updateSiteContent(content);
    
    // Revalidate all pages to reflect changes immediately
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error updating site content:', message, error);
    return NextResponse.json({ error: 'Erreur serveur', details: message }, { status: 500 });
  }
}
