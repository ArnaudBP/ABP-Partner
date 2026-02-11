import { NextRequest, NextResponse } from 'next/server';
import { getCatalogues, saveCatalogue, deleteCatalogue } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { Catalogue } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fournisseurId = searchParams.get('fournisseurId');
    
    let catalogues = await getCatalogues();
    
    if (fournisseurId) {
      catalogues = catalogues.filter(c => c.fournisseurId === fournisseurId);
    }
    
    return NextResponse.json(catalogues);
  } catch (error) {
    console.error('Error fetching catalogues:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const catalogue: Catalogue = await request.json();
    await saveCatalogue(catalogue);
    
    return NextResponse.json({ success: true, catalogue });
  } catch (error) {
    console.error('Error saving catalogue:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { id } = await request.json();
    await deleteCatalogue(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting catalogue:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
