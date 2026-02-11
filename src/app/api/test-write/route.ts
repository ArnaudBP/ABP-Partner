import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/storage';

export const dynamic = 'force-dynamic';

// Test endpoint - À SUPPRIMER après debug
export async function POST(request: NextRequest) {
  try {
    // Step 1: Read current content
    const current = await readJson('siteContent.json', {});
    
    // Step 2: Get new data
    const body = await request.json();
    
    // Step 3: Merge
    const updated = { ...current, ...body };
    
    // Step 4: Write
    await writeJson('siteContent.json', updated);
    
    // Step 5: Read back to confirm
    const verification = await readJson('siteContent.json', {});
    
    return NextResponse.json({ 
      success: true, 
      theme: (verification as Record<string, unknown>).theme 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    return NextResponse.json({ 
      error: message, 
      stack: stack?.split('\n').slice(0, 5)
    }, { status: 500 });
  }
}
