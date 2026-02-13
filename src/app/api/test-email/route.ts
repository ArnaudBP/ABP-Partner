import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { sendContactNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier les variables d'environnement
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST ? '✅ défini' : '❌ manquant',
      SMTP_USER: process.env.SMTP_USER ? `✅ ${process.env.SMTP_USER}` : '❌ manquant',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ défini' : '❌ manquant',
      SMTP_PORT: process.env.SMTP_PORT || '465 (défaut)',
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ 
        error: 'Variables SMTP non configurées sur Vercel',
        envCheck 
      }, { status: 400 });
    }

    // Envoyer un email de test
    await sendContactNotification({
      name: 'Test ABP Partner',
      email: 'test@abp-partner.fr',
      phone: '0600000000',
      subject: 'Email de test',
      message: 'Ceci est un email de test envoyé depuis le back-office. Si vous le recevez, la notification par email fonctionne correctement !',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email de test envoyé !',
      envCheck 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: message,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
