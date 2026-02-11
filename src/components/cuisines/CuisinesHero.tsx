"use client";

import { motion } from "framer-motion";
import { useSiteContent } from '../SiteContentProvider';

interface HeroContent {
  accroche: string;
  titre: string;
  sousTitre: string;
  description: string;
  image: string;
}

const defaultContent: HeroContent = {
  accroche: "Ma spécialité",
  titre: "Des cuisines",
  sousTitre: "qui vous ressemblent",
  description: "15 ans que je conçois des cuisines, et chacune est unique. Parce que votre façon de cuisiner, de vivre, de recevoir... c'est ce qui fait toute la différence.",
  image: "/cuisine1.png"
};

export default function CuisinesHero() {
  const siteContent = useSiteContent();
  const pageData = siteContent?.pageCuisines as Record<string, unknown> | undefined;
  const content = pageData?.hero
    ? { ...defaultContent, ...(pageData.hero as Partial<HeroContent>) }
    : defaultContent;

  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center">
      {/* Image de fond sans filtre de couleur */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={content.image} 
          alt="Cuisine haut de gamme"
          className="w-full h-full object-cover"
        />
        {/* Overlay sombre neutre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative max-w-[1800px] mx-auto px-6 md:px-12 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            {content.accroche}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {content.titre}<br />
            <span className="font-serif italic font-normal text-gray-300">{content.sousTitre}</span>
          </h1>
          <p className="text-gray-300 max-w-xl text-lg">
            {content.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
