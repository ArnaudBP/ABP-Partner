import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { listUploadedFiles, deleteFiles, readJson } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// Dossiers à scanner
const SCAN_FOLDERS = ['content', 'homepage', 'catalogues/pdf', 'fournisseurs', 'hero'];

// Extensions de fichiers médias
const FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.mp4', '.webm', '.mov', '.pdf', '.heic'];

// Extraire récursivement toutes les URLs référencées dans un objet
function extractUrls(obj: unknown, usedUrls: Set<string>): void {
  if (typeof obj === 'string') {
    // Chemin local (/content/...) ou URL Blob (https://...blob.vercel-storage.com/...)
    if (
      (obj.startsWith('/') && FILE_EXTENSIONS.some(ext => obj.toLowerCase().includes(ext))) ||
      obj.includes('blob.vercel-storage.com')
    ) {
      usedUrls.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractUrls(item, usedUrls));
  } else if (obj && typeof obj === 'object') {
    Object.values(obj).forEach(value => extractUrls(value, usedUrls));
  }
}

// Récupérer toutes les URLs référencées dans les données
async function getUsedUrls(): Promise<Set<string>> {
  const usedUrls = new Set<string>();
  const jsonFiles = ['siteContent.json', 'realisations.json', 'fournisseurs.json', 'catalogues.json'];

  for (const file of jsonFiles) {
    try {
      const data = await readJson(file, null);
      if (data) {
        extractUrls(data, usedUrls);
      }
    } catch {
      // Fichier n'existe pas
    }
  }

  return usedUrls;
}

// GET: Analyser les fichiers non utilisés
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const allFiles = await listUploadedFiles(SCAN_FOLDERS);
    const usedUrls = await getUsedUrls();

    // Comparer : un fichier est "utilisé" si son path OU son url apparaît dans les données
    const unusedFiles = allFiles.filter(file => !usedUrls.has(file.path) && !usedUrls.has(file.url));
    const usedFiles = allFiles.filter(file => usedUrls.has(file.path) || usedUrls.has(file.url));

    const totalUnusedSize = unusedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalUsedSize = usedFiles.reduce((acc, file) => acc + file.size, 0);

    return NextResponse.json({
      unusedFiles,
      usedFiles,
      stats: {
        totalFiles: allFiles.length,
        unusedCount: unusedFiles.length,
        usedCount: usedFiles.length,
        unusedSize: totalUnusedSize,
        usedSize: totalUsedSize,
        unusedSizeMB: (totalUnusedSize / (1024 * 1024)).toFixed(2),
        usedSizeMB: (totalUsedSize / (1024 * 1024)).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error analyzing files:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'analyse' }, { status: 500 });
  }
}

// DELETE: Supprimer les fichiers sélectionnés
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { files } = await request.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Liste de fichiers invalide' }, { status: 400 });
    }

    const result = await deleteFiles(files);

    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      errors: result.errors,
      deletedCount: result.deleted.length,
    });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
