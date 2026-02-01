import { NextRequest, NextResponse } from 'next/server';
import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';
import { isAuthenticated } from '@/lib/auth';
import { readFile } from 'fs/promises';

// Dossiers à scanner
const SCAN_FOLDERS = ['content', 'homepage', 'catalogues/pdf'];

// Extensions de fichiers à gérer
const FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov', '.pdf', '.heic'];

interface FileInfo {
  path: string;
  name: string;
  size: number;
  folder: string;
}

// Récupérer tous les fichiers uploadés
async function getAllUploadedFiles(): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  const publicDir = join(process.cwd(), 'public');

  for (const folder of SCAN_FOLDERS) {
    const folderPath = join(publicDir, folder);
    
    try {
      const items = await readdir(folderPath);
      
      for (const item of items) {
        const ext = item.toLowerCase().substring(item.lastIndexOf('.'));
        if (FILE_EXTENSIONS.includes(ext)) {
          const filePath = join(folderPath, item);
          const stats = await stat(filePath);
          
          files.push({
            path: `/${folder}/${item}`,
            name: item,
            size: stats.size,
            folder
          });
        }
      }
    } catch {
      // Dossier n'existe pas, on continue
    }
  }

  return files;
}

// Récupérer toutes les URLs utilisées dans les données
async function getUsedUrls(): Promise<Set<string>> {
  const usedUrls = new Set<string>();
  const dataDir = join(process.cwd(), 'data');

  // Fonction récursive pour extraire les URLs d'un objet
  const extractUrls = (obj: unknown): void => {
    if (typeof obj === 'string') {
      // Vérifier si c'est une URL de fichier
      if (obj.startsWith('/') && FILE_EXTENSIONS.some(ext => obj.toLowerCase().includes(ext))) {
        usedUrls.add(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => extractUrls(item));
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(value => extractUrls(value));
    }
  };

  // Lire tous les fichiers JSON de data
  const jsonFiles = ['siteContent.json', 'realisations.json', 'fournisseurs.json', 'catalogues.json'];
  
  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(dataDir, file), 'utf-8');
      const data = JSON.parse(content);
      extractUrls(data);
    } catch {
      // Fichier n'existe pas ou erreur de parsing
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

    const allFiles = await getAllUploadedFiles();
    const usedUrls = await getUsedUrls();

    const unusedFiles = allFiles.filter(file => !usedUrls.has(file.path));
    const usedFiles = allFiles.filter(file => usedUrls.has(file.path));

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
        usedSizeMB: (totalUsedSize / (1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error analyzing files:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'analyse' }, { status: 500 });
  }
}

// DELETE: Supprimer les fichiers non utilisés
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

    const publicDir = join(process.cwd(), 'public');
    const deleted: string[] = [];
    const errors: string[] = [];

    for (const filePath of files) {
      try {
        // Sécurité: vérifier que le chemin est bien dans public
        const fullPath = join(publicDir, filePath);
        if (!fullPath.startsWith(publicDir)) {
          errors.push(`Chemin invalide: ${filePath}`);
          continue;
        }

        await unlink(fullPath);
        deleted.push(filePath);
      } catch (err) {
        errors.push(`Erreur suppression ${filePath}: ${err}`);
      }
    }

    return NextResponse.json({
      success: true,
      deleted,
      errors,
      deletedCount: deleted.length
    });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
