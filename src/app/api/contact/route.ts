import { NextRequest, NextResponse } from 'next/server';
import { getContactSubmissions, saveContactSubmission, markContactAsRead, deleteContactSubmission } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { ContactSubmission } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const submissions = await getContactSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const submission: ContactSubmission = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    await saveContactSubmission(submission);
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { id, action } = await request.json();
    
    if (action === 'markAsRead') {
      await markContactAsRead(id);
    }
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { id } = await request.json();
    await deleteContactSubmission(id);
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
