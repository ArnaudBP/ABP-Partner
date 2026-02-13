import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Endpoint temporaire de diagnostic — à supprimer après résolution
export async function GET() {
  return NextResponse.json({
    SMTP_HOST: process.env.SMTP_HOST ? '✅' : '❌',
    SMTP_USER: process.env.SMTP_USER ? '✅' : '❌',
    SMTP_PASS: process.env.SMTP_PASS ? '✅' : '❌',
    SMTP_PORT: process.env.SMTP_PORT || 'non défini (défaut 465)',
    CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'non défini',
    VERCEL: process.env.VERCEL || 'non défini',
    NODE_ENV: process.env.NODE_ENV,
    // Montrer les premières lettres pour vérifier
    SMTP_USER_preview: process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 4) + '...' : 'vide',
    SMTP_HOST_preview: process.env.SMTP_HOST ? process.env.SMTP_HOST.substring(0, 4) + '...' : 'vide',
  });
}
