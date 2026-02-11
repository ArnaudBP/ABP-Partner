import { put, del, list, head } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';

// Détecte si on est en production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// ==================== JSON STORAGE ====================

const dataDir = path.join(process.cwd(), 'data');

export async function readJson<T>(filename: string, defaultValue: T): Promise<T> {
  if (isProduction) {
    return readJsonFromBlob<T>(filename, defaultValue);
  }
  return readJsonFromFile<T>(filename, defaultValue);
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  if (isProduction) {
    return writeJsonToBlob(filename, data);
  }
  return writeJsonToFile(filename, data);
}

// File system (local development)
async function readJsonFromFile<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

async function writeJsonToFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Vercel Blob (production)
async function readJsonFromBlob<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const blobPath = `data/${filename}`;
    
    // Check if blob exists
    const blobs = await list({ prefix: blobPath });
    const blob = blobs.blobs.find(b => b.pathname === blobPath);
    
    if (!blob) {
      // Try to initialize from local file if exists
      try {
        const localData = await readJsonFromFile<T>(filename, defaultValue);
        await writeJsonToBlob(filename, localData);
        return localData;
      } catch {
        return defaultValue;
      }
    }

    const response = await fetch(blob.url);
    const content = await response.json();
    return content as T;
  } catch (error) {
    console.error(`Error reading ${filename} from Blob:`, error);
    return defaultValue;
  }
}

async function writeJsonToBlob<T>(filename: string, data: T): Promise<void> {
  const blobPath = `data/${filename}`;
  const content = JSON.stringify(data, null, 2);
  
  await put(blobPath, content, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

// ==================== FILE UPLOAD STORAGE ====================

export async function uploadFile(
  file: File | Buffer,
  filename: string,
  folder: string
): Promise<string> {
  if (isProduction) {
    return uploadToBlob(file, filename, folder);
  }
  return uploadToLocal(file, filename, folder);
}

export async function deleteFile(filePath: string): Promise<void> {
  if (isProduction) {
    return deleteFromBlob(filePath);
  }
  return deleteFromLocal(filePath);
}

// Local file upload
async function uploadToLocal(
  file: File | Buffer,
  filename: string,
  folder: string
): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', folder);
  await fs.mkdir(uploadDir, { recursive: true });

  let buffer: Buffer;
  if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    buffer = Buffer.from(await (file as File).arrayBuffer());
  }
  const filepath = path.join(uploadDir, filename);
  
  await fs.writeFile(filepath, buffer);
  
  return folder ? `/${folder}/${filename}` : `/${filename}`;
}

async function deleteFromLocal(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting local file:', error);
  }
}

// Vercel Blob upload
async function uploadToBlob(
  file: File | Buffer,
  filename: string,
  folder: string
): Promise<string> {
  const blobPath = folder ? `${folder}/${filename}` : filename;
  
  let buffer: Buffer;
  if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    buffer = Buffer.from(await (file as File).arrayBuffer());
  }
  
  const blob = await put(blobPath, buffer, {
    access: 'public',
    addRandomSuffix: false,
  });
  
  return blob.url;
}

async function deleteFromBlob(fileUrl: string): Promise<void> {
  try {
    await del(fileUrl);
  } catch (error) {
    console.error('Error deleting blob:', error);
  }
}

// ==================== MIGRATION HELPER ====================

export async function migrateDataToBlob(): Promise<{ success: boolean; migrated: string[] }> {
  const files = ['siteContent.json', 'realisations.json', 'fournisseurs.json', 'catalogues.json', 'contacts.json'];
  const migrated: string[] = [];

  for (const filename of files) {
    try {
      const localPath = path.join(dataDir, filename);
      const content = await fs.readFile(localPath, 'utf-8');
      const data = JSON.parse(content);
      
      await writeJsonToBlob(filename, data);
      migrated.push(filename);
    } catch (error) {
      console.error(`Failed to migrate ${filename}:`, error);
    }
  }

  return { success: migrated.length === files.length, migrated };
}

// ==================== FILE LISTING FOR CLEANUP ====================

interface FileInfo {
  path: string;
  url: string;
  name: string;
  size: number;
  folder: string;
}

const FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.mp4', '.webm', '.mov', '.pdf', '.heic'];

export async function listUploadedFiles(folders: string[]): Promise<FileInfo[]> {
  if (isProduction) {
    return listFilesFromBlob(folders);
  }
  return listFilesFromLocal(folders);
}

async function listFilesFromLocal(folders: string[]): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  const publicDir = path.join(process.cwd(), 'public');

  for (const folder of folders) {
    const folderPath = path.join(publicDir, folder);
    
    try {
      const items = await fs.readdir(folderPath);
      
      for (const item of items) {
        const ext = item.toLowerCase().substring(item.lastIndexOf('.'));
        if (FILE_EXTENSIONS.includes(ext)) {
          const filePath = path.join(folderPath, item);
          const stats = await fs.stat(filePath);
          const publicPath = `/${folder}/${item}`;
          
          files.push({
            path: publicPath,
            url: publicPath,
            name: item,
            size: stats.size,
            folder
          });
        }
      }
    } catch {
      // Folder doesn't exist, continue
    }
  }

  return files;
}

async function listFilesFromBlob(folders: string[]): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  for (const folder of folders) {
    try {
      const { blobs } = await list({ prefix: folder });
      
      for (const blob of blobs) {
        const ext = blob.pathname.toLowerCase().substring(blob.pathname.lastIndexOf('.'));
        if (FILE_EXTENSIONS.includes(ext)) {
          files.push({
            path: blob.pathname,
            url: blob.url,
            name: blob.pathname.split('/').pop() || blob.pathname,
            size: blob.size,
            folder
          });
        }
      }
    } catch (error) {
      console.error(`Error listing blobs for ${folder}:`, error);
    }
  }

  return files;
}

export async function deleteFiles(filePaths: string[]): Promise<{ deleted: string[]; errors: string[] }> {
  if (isProduction) {
    return deleteFilesFromBlob(filePaths);
  }
  return deleteFilesFromLocal(filePaths);
}

async function deleteFilesFromLocal(filePaths: string[]): Promise<{ deleted: string[]; errors: string[] }> {
  const publicDir = path.join(process.cwd(), 'public');
  const deleted: string[] = [];
  const errors: string[] = [];

  for (const filePath of filePaths) {
    try {
      const fullPath = path.join(publicDir, filePath);
      if (!fullPath.startsWith(publicDir)) {
        errors.push(`Invalid path: ${filePath}`);
        continue;
      }
      await fs.unlink(fullPath);
      deleted.push(filePath);
    } catch (err) {
      errors.push(`Error deleting ${filePath}: ${err}`);
    }
  }

  return { deleted, errors };
}

async function deleteFilesFromBlob(fileUrls: string[]): Promise<{ deleted: string[]; errors: string[] }> {
  const deleted: string[] = [];
  const errors: string[] = [];

  for (const fileUrl of fileUrls) {
    try {
      await del(fileUrl);
      deleted.push(fileUrl);
    } catch (err) {
      errors.push(`Error deleting ${fileUrl}: ${err}`);
    }
  }

  return { deleted, errors };
}

export { isProduction };
