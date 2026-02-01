import { promises as fs } from 'fs';
import path from 'path';
import { Realisation, Fournisseur, Catalogue, SiteContent, ContactSubmission } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

// Generic read/write functions
async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(dataDir, filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Réalisations
export async function getRealisations(): Promise<Realisation[]> {
  return readJsonFile<Realisation[]>('realisations.json');
}

export async function getRealisationBySlug(slug: string): Promise<Realisation | null> {
  const realisations = await getRealisations();
  return realisations.find(r => r.slug === slug) || null;
}

export async function getRealisationsByCategory(category: string): Promise<Realisation[]> {
  const realisations = await getRealisations();
  return realisations.filter(r => r.category === category);
}

export async function getFeaturedRealisations(): Promise<Realisation[]> {
  const realisations = await getRealisations();
  return realisations.filter(r => r.featured);
}

export async function saveRealisation(realisation: Realisation): Promise<void> {
  const realisations = await getRealisations();
  const index = realisations.findIndex(r => r.id === realisation.id);
  if (index >= 0) {
    realisations[index] = realisation;
  } else {
    realisations.push(realisation);
  }
  await writeJsonFile('realisations.json', realisations);
}

export async function deleteRealisation(id: string): Promise<void> {
  const realisations = await getRealisations();
  const filtered = realisations.filter(r => r.id !== id);
  await writeJsonFile('realisations.json', filtered);
}

// Fournisseurs
export async function getFournisseurs(): Promise<Fournisseur[]> {
  return readJsonFile<Fournisseur[]>('fournisseurs.json');
}

export async function getFournisseurById(id: string): Promise<Fournisseur | null> {
  const fournisseurs = await getFournisseurs();
  return fournisseurs.find(f => f.id === id) || null;
}

export async function saveFournisseur(fournisseur: Fournisseur): Promise<void> {
  const fournisseurs = await getFournisseurs();
  const index = fournisseurs.findIndex(f => f.id === fournisseur.id);
  if (index >= 0) {
    fournisseurs[index] = fournisseur;
  } else {
    fournisseurs.push(fournisseur);
  }
  await writeJsonFile('fournisseurs.json', fournisseurs);
}

export async function deleteFournisseur(id: string): Promise<void> {
  const fournisseurs = await getFournisseurs();
  const filtered = fournisseurs.filter(f => f.id !== id);
  await writeJsonFile('fournisseurs.json', filtered);
}

// Catalogues
export async function getCatalogues(): Promise<Catalogue[]> {
  return readJsonFile<Catalogue[]>('catalogues.json');
}

export async function getCataloguesByFournisseur(fournisseurId: string): Promise<Catalogue[]> {
  const catalogues = await getCatalogues();
  return catalogues.filter(c => c.fournisseurId === fournisseurId);
}

export async function saveCatalogue(catalogue: Catalogue): Promise<void> {
  const catalogues = await getCatalogues();
  const index = catalogues.findIndex(c => c.id === catalogue.id);
  if (index >= 0) {
    catalogues[index] = catalogue;
  } else {
    catalogues.push(catalogue);
  }
  await writeJsonFile('catalogues.json', catalogues);
}

export async function deleteCatalogue(id: string): Promise<void> {
  const catalogues = await getCatalogues();
  const filtered = catalogues.filter(c => c.id !== id);
  await writeJsonFile('catalogues.json', filtered);
}

// Site Content
export async function getSiteContent(): Promise<SiteContent> {
  return readJsonFile<SiteContent>('siteContent.json');
}

export async function updateSiteContent(content: Partial<SiteContent>): Promise<void> {
  const current = await getSiteContent();
  const updated = { ...current, ...content };
  await writeJsonFile('siteContent.json', updated);
}

// Contact Submissions
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    return await readJsonFile<ContactSubmission[]>('contacts.json');
  } catch {
    return [];
  }
}

export async function saveContactSubmission(submission: ContactSubmission): Promise<void> {
  const submissions = await getContactSubmissions();
  submissions.unshift(submission);
  await writeJsonFile('contacts.json', submissions);
}

export async function markContactAsRead(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  if (index >= 0) {
    submissions[index].read = true;
    await writeJsonFile('contacts.json', submissions);
  }
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  await writeJsonFile('contacts.json', filtered);
}
