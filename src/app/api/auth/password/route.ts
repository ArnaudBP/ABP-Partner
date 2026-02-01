import { NextRequest, NextResponse } from 'next/server';
import { updatePassword, isAuthenticated } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    const success = await updatePassword(currentPassword, newPassword);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
    }
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
