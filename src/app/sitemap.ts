import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.abp-partner.fr', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.abp-partner.fr/cuisines', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.abp-partner.fr/autres-amenagements/salles-de-bains', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.abp-partner.fr/autres-amenagements/dressings', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.abp-partner.fr/mon-process', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.abp-partner.fr/realisations', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.abp-partner.fr/fournisseurs', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.abp-partner.fr/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}