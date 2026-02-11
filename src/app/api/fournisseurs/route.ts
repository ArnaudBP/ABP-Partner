import { NextRequest, NextResponse } from 'next/server';
import { getFournisseurs, saveFournisseur, deleteFournisseur } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { Fournisseur } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fournisseurs = await getFournisseurs();
    
    // Trier par order si défini
    fournisseurs.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
    
    return NextResponse.json(fournisseurs);
  } catch (error) {
    console.error('Error fetching fournisseurs:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const fournisseur: Fournisseur = await request.json();
    await saveFournisseur(fournisseur);
    
    return NextResponse.json({ success: true, fournisseur });
  } catch (error) {
    console.error('Error saving fournisseur:', error);
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
    await deleteFournisseur(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting fournisseur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
