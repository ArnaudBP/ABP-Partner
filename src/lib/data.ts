import { readJson, writeJson } from './storage';
import { Realisation, Fournisseur, Catalogue, SiteContent, ContactSubmission } from '@/types';

// Réalisations
export async function getRealisations(): Promise<Realisation[]> {
  return readJson<Realisation[]>('realisations.json', []);
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
  await writeJson('realisations.json', realisations);
}

export async function deleteRealisation(id: string): Promise<void> {
  const realisations = await getRealisations();
  const filtered = realisations.filter(r => r.id !== id);
  await writeJson('realisations.json', filtered);
}

export async function reorderRealisations(orderedIds: string[]): Promise<void> {
  const realisations = await getRealisations();
  for (let i = 0; i < orderedIds.length; i++) {
    const r = realisations.find(x => x.id === orderedIds[i]);
    if (r) r.order = i;
  }
  await writeJson('realisations.json', realisations);
}

// Fournisseurs
export async function getFournisseurs(): Promise<Fournisseur[]> {
  return readJson<Fournisseur[]>('fournisseurs.json', []);
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
  await writeJson('fournisseurs.json', fournisseurs);
}

export async function deleteFournisseur(id: string): Promise<void> {
  const fournisseurs = await getFournisseurs();
  const filtered = fournisseurs.filter(f => f.id !== id);
  await writeJson('fournisseurs.json', filtered);
}

export async function reorderFournisseurs(orderedIds: string[]): Promise<void> {
  const fournisseurs = await getFournisseurs();
  for (let i = 0; i < orderedIds.length; i++) {
    const f = fournisseurs.find(x => x.id === orderedIds[i]);
    if (f) f.order = i;
  }
  await writeJson('fournisseurs.json', fournisseurs);
}

// Catalogues
export async function getCatalogues(): Promise<Catalogue[]> {
  return readJson<Catalogue[]>('catalogues.json', []);
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
  await writeJson('catalogues.json', catalogues);
}

export async function deleteCatalogue(id: string): Promise<void> {
  const catalogues = await getCatalogues();
  const filtered = catalogues.filter(c => c.id !== id);
  await writeJson('catalogues.json', filtered);
}

// Site Content
export async function getSiteContent(): Promise<SiteContent> {
  return readJson<SiteContent>('siteContent.json', {} as SiteContent);
}

export async function updateSiteContent(content: Partial<SiteContent>): Promise<void> {
  const current = await getSiteContent();
  const updated = { ...current, ...content };
  await writeJson('siteContent.json', updated);
}

// Contact Submissions
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return readJson<ContactSubmission[]>('contacts.json', []);
}

export async function saveContactSubmission(submission: ContactSubmission): Promise<void> {
  const submissions = await getContactSubmissions();
  submissions.unshift(submission);
  await writeJson('contacts.json', submissions);
}

export async function markContactAsRead(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  if (index >= 0) {
    submissions[index].read = true;
    await writeJson('contacts.json', submissions);
  }
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const submissions = await getContactSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  await writeJson('contacts.json', filtered);
}
