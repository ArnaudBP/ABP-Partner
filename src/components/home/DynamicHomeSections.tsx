'use client';

import { useState, useEffect } from 'react';
import CuisineTeaser from './CuisineTeaser';
import FeaturedProjects from './FeaturedProjects';
import AutresAmenagementsTeaser from './AutresAmenagementsTeaser';
import FournisseursTeaser from './FournisseursTeaser';
import AvisSectionWrapper from './AvisSectionWrapper';
import CTAContact from './CTAContact';

interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
}

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  cuisines: CuisineTeaser,
  realisations: FeaturedProjects,
  autresAmenagements: AutresAmenagementsTeaser,
  fournisseurs: FournisseursTeaser,
  avis: AvisSectionWrapper,
  cta: CTAContact,
};

export default function DynamicHomeSections() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.homepage?.sectionsOrder) {
          setSections(content.homepage.sectionsOrder);
        } else {
          // Ordre par défaut si non configuré
          setSections([
            { id: 'cuisines', label: 'Cuisines', enabled: true },
            { id: 'realisations', label: 'Réalisations', enabled: true },
            { id: 'autresAmenagements', label: 'Autres Aménagements', enabled: true },
            { id: 'fournisseurs', label: 'Fournisseurs', enabled: true },
            { id: 'avis', label: 'Avis Houzz', enabled: true },
            { id: 'cta', label: 'CTA Contact', enabled: true },
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback en cas d'erreur
        setSections([
          { id: 'cuisines', label: 'Cuisines', enabled: true },
          { id: 'realisations', label: 'Réalisations', enabled: true },
          { id: 'autresAmenagements', label: 'Autres Aménagements', enabled: true },
          { id: 'fournisseurs', label: 'Fournisseurs', enabled: true },
          { id: 'avis', label: 'Avis Houzz', enabled: true },
          { id: 'cta', label: 'CTA Contact', enabled: true },
        ]);
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
