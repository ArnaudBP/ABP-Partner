'use client';

import { useState, useEffect } from 'react';
import CuisineTeaser from './CuisineTeaser';
import FeaturedProjects from './FeaturedProjects';
import AutresAmenagementsTeaser from './AutresAmenagementsTeaser';
import FournisseursTeaser from './FournisseursTeaser';
import AvisSectionWrapper from './AvisSectionWrapper';
import CTAContact from './CTAContact';
import { useSiteContent } from '../SiteContentProvider';

interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'cuisines', label: 'Cuisines', enabled: true },
  { id: 'realisations', label: 'Réalisations', enabled: true },
  { id: 'autresAmenagements', label: 'Autres Aménagements', enabled: true },
  { id: 'fournisseurs', label: 'Fournisseurs', enabled: true },
  { id: 'avis', label: 'Avis Houzz', enabled: true },
  { id: 'cta', label: 'CTA Contact', enabled: true },
];

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  cuisines: CuisineTeaser,
  realisations: FeaturedProjects,
  autresAmenagements: AutresAmenagementsTeaser,
  fournisseurs: FournisseursTeaser,
  avis: AvisSectionWrapper,
  cta: CTAContact,
};

export default function DynamicHomeSections() {
  const siteContent = useSiteContent();
  const initialSections = (siteContent?.homepage as Record<string, unknown>)?.sectionsOrder as SectionConfig[] || null;
  const [sections, setSections] = useState<SectionConfig[]>(initialSections || []);
  const [loading, setLoading] = useState(!initialSections);

  useEffect(() => {
    if (siteContent) {
      const order = (siteContent.homepage as Record<string, unknown>)?.sectionsOrder as SectionConfig[];
      setSections(order || DEFAULT_SECTIONS);
      setLoading(false);
      return;
    }
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        setSections(content.homepage?.sectionsOrder || DEFAULT_SECTIONS);
        setLoading(false);
      })
      .catch(() => {
        setSections(DEFAULT_SECTIONS);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-[50vh]" />;
  }

  return (
    <>
      {sections
        .filter(section => section.enabled)
        .map(section => {
          const Component = SECTION_COMPONENTS[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
    </>
  );
}
