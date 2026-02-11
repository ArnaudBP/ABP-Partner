export interface Realisation {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'cuisine' | 'salle-de-bains' | 'dressing';
  style: string;
  description: string;
  details: string[];
  images: string[];
  featured: boolean;
  createdAt: string;
  lien3D?: string;
  order?: number;
}

export interface Fournisseur {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  featured: boolean;
  cataloguePdf?: string;
  catalogueYear?: number;
  order?: number;
}

export interface Catalogue {
  id: string;
  title: string;
  description: string;
  fournisseurId: string;
  pdfUrl: string;
  coverImage: string;
  year: number;
}

export interface HeroContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  videoUrl: string;
}

export interface ExpertiseItem {
  title: string;
  description: string;
}

export interface StyleItem {
  name: string;
  description: string;
  image: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface CuisinesContent {
  title: string;
  subtitle: string;
  description: string;
  expertise: ExpertiseItem[];
  styles: StyleItem[];
  process: ProcessStep[];
}

export interface AmenagementCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface AutresAmenagementsContent {
  title: string;
  subtitle: string;
  description: string;
  categories: AmenagementCategory[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  mapUrl: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

// Page Contact complète éditable
export interface ContactPageContent {
  // Header
  headerAccroche: string;
  headerTitle: string;
  headerDescription: string;
  // Coordonnées
  coordonneesTitle: string;
  adresseLigne1: string;
  adresseLigne2: string;
  telephone: string;
  email: string;
  horairesLigne1: string;
  horairesLigne2: string;
  mapEmbedUrl: string;
  // Formulaire
  formTitle: string;
  typesProjet: string[];
  // Message de succès
  successTitle: string;
  successMessage: string;
  successButtonText: string;
  // Footer formulaire
  formDisclaimer: string;
}

// Footer éditable
export interface FooterContent {
  // Marque
  brandName: string;
  tagline: string;
  adresseLigne1: string;
  adresseLigne2: string;
  rcsInfo: string;
  capitalInfo: string;
  // Liens de navigation (automatiques depuis la structure du site)
  // Réseaux sociaux
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    houzz: string;
  };
  // Légal
  mentionsLegalesHref: string;
  politiqueConfidentialiteHref: string;
  directeurPublication: string;
  // Pied de page
  copyrightText: string;
  designedBy: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  rcs: string;
  capital: string;
  director: string;
}

export interface SiteContent {
  hero: HeroContent;
  cuisines: CuisinesContent;
  autresAmenagements: AutresAmenagementsContent;
  contact: ContactContent;
  company: CompanyInfo;
  // Sections dynamiques ajoutées via le back-office
  theme?: { paletteId: string };
  navbar?: { logo?: string; title?: string; subtitle?: string };
  homepage?: Record<string, unknown>;
  footer?: Partial<FooterContent>;
  seo?: Record<string, unknown>;
  pageContact?: Partial<ContactPageContent>;
  pageSallesDeBains?: Record<string, unknown>;
  pageDressings?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  createdAt: string;
  read: boolean;
}
