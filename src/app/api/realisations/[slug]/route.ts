import { NextRequest, NextResponse } from 'next/server';
import { getRealisationBySlug } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const realisation = await getRealisationBySlug(slug);
    
    if (!realisation) {
      return NextResponse.json({ error: 'Réalisation non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json(realisation);
  } catch (error) {
    console.error('Error fetching realisation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
