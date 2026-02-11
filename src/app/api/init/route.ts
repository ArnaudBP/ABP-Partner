import { NextRequest, NextResponse } from 'next/server';
import { writeJson, isProduction } from '@/lib/storage';
import { promises as fs } from 'fs';
import path from 'path';

// Endpoint temporaire pour initialiser les données manquantes dans le Blob
// Sécurisé par une clé secrète passée en query param
// À SUPPRIMER après la première initialisation

const INIT_SECRET = 'abp-init-2026';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== INIT_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!isProduction) {
    return NextResponse.json({ error: 'Only in production' }, { status: 400 });
  }

  const dataDir = path.join(process.cwd(), 'data');
  const filesToMigrate = ['admin.json', 'catalogues.json'];
  const results: string[] = [];

  for (const filename of filesToMigrate) {
    try {
      const localPath = path.join(dataDir, filename);
      const content = await fs.readFile(localPath, 'utf-8');
      const data = JSON.parse(content);
      await writeJson(filename, data);
      results.push(`✅ ${filename} migrated`);
    } catch (error) {
      results.push(`❌ ${filename}: ${error}`);
    }
  }

  return NextResponse.json({ results });
}
