import { NextResponse } from 'next/server';
import { isProduction } from '@/lib/storage';
import { list } from '@vercel/blob';

export const dynamic = 'force-dynamic';

// Diagnostic endpoint - no auth required
export async function GET() {
  const checks: Record<string, unknown> = {
    isProduction,
    vercelEnv: process.env.VERCEL || 'not set',
    nodeEnv: process.env.NODE_ENV || 'not set',
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    timestamp: new Date().toISOString(),
  };

  // Check blob connectivity
  if (isProduction && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobs = await list({ prefix: 'data/' });
      checks.blobConnected = true;
      checks.blobFiles = blobs.blobs.map(b => ({
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
      }));
    } catch (error) {
      checks.blobConnected = false;
      checks.blobError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  return NextResponse.json(checks);
}
