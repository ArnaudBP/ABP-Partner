import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { SiteContent } from '@/types';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
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
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
