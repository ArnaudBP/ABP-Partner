import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRealisations, saveRealisation, deleteRealisation, reorderRealisations } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { Realisation } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    let realisations = await getRealisations();
    
    // Trier par ordre si défini, sinon par date
    realisations.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    if (category) {
      realisations = realisations.filter(r => r.category === category);
    }
    
    if (featured === 'true') {
      realisations = realisations.filter(r => r.featured);
    }
    
    return NextResponse.json(realisations);
  } catch (error) {
    console.error('Error fetching realisations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const realisation: Realisation = await request.json();
    await saveRealisation(realisation);
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, realisation });
  } catch (error) {
    console.error('Error saving realisation:', error);
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
    await deleteRealisation(id);
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting realisation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { orderedIds } = await request.json();
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'Liste d\'IDs invalide' }, { status: 400 });
    }
    
    await reorderRealisations(orderedIds);
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering realisations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
