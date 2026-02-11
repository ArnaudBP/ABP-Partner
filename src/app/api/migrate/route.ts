import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { migrateDataToBlob, isProduction } from '@/lib/storage';

// POST: Migrer les données locales vers Vercel Blob
export async function POST() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (!isProduction) {
      return NextResponse.json({ 
        error: 'Migration uniquement disponible en production',
        message: 'En local, les fichiers JSON sont utilisés directement'
      }, { status: 400 });
    }

    const result = await migrateDataToBlob();
    
    return NextResponse.json({
      success: result.success,
      migrated: result.migrated,
      message: result.success 
        ? 'Migration réussie !' 
        : 'Migration partielle - certains fichiers n\'ont pas été migrés'
    });
  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json({ error: 'Erreur lors de la migration' }, { status: 500 });
  }
}

// GET: Vérifier le statut de la migration
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    return NextResponse.json({
      isProduction,
      storageType: isProduction ? 'Vercel Blob' : 'File System',
      message: isProduction 
        ? 'Le site utilise Vercel Blob pour le stockage'
        : 'Le site utilise le système de fichiers local'
    });
  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
