import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { readJson, writeJson } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'abp-partner-secret-key-change-in-production';
const COOKIE_NAME = 'abp-admin-token';

interface AdminCredentials {
  username: string;
  passwordHash: string;
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: '$2a$10$defaulthashdonotuse'
};

async function getAdminCredentials(): Promise<AdminCredentials> {
  return readJson<AdminCredentials>('admin.json', DEFAULT_CREDENTIALS);
}

async function saveAdminCredentials(credentials: AdminCredentials): Promise<void> {
  await writeJson('admin.json', credentials);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticate(username: string, password: string): Promise<string | null> {
  const credentials = await getAdminCredentials();
  
  if (username !== credentials.username) {
    return null;
  }
  
  const isValid = await verifyPassword(password, credentials.passwordHash);
  if (!isValid) {
    return null;
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return false;
  }
  
  return verifyToken(token);
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const credentials = await getAdminCredentials();
  
  const isValid = await verifyPassword(currentPassword, credentials.passwordHash);
  if (!isValid) {
    return false;
  }
  
  credentials.passwordHash = await hashPassword(newPassword);
  await saveAdminCredentials(credentials);
  return true;
}

export async function initializeAdmin(password: string): Promise<void> {
  const credentials = await getAdminCredentials();
  credentials.passwordHash = await hashPassword(password);
  await saveAdminCredentials(credentials);
}

export { COOKIE_NAME, JWT_SECRET };
