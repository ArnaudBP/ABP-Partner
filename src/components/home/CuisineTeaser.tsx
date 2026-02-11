"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Home, Award, Euro, Ruler, Palette, Wrench, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteContent } from '../SiteContentProvider';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface CuisinesTeaserData {
  title?: string;
  titleHighlight?: string;
  description?: string;
  features?: Feature[];
  ctaText?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  statNumber?: string;
  statText?: string;
}

const iconMap: Record<string, React.ComponentType<{className?: string; size?: number}>> = {
  home: Home,
  award: Award,
  euro: Euro,
  ruler: Ruler,
  palette: Palette,
  wrench: Wrench,
  star: Star,
};

const defaultFeatures = [
  {
    icon: "home",
    title: "Je viens chez vous",
    description: "Pas de showroom, je me déplace avec tout le nécessaire"
  },
  {
    icon: "award",
    title: "Qualité allemande",
    description: "Des cuisines solides, garanties 25 ans"
  },
  {
    icon: "euro",
    title: "Prix direct artisan",
    description: "Sans intermédiaire = économies pour vous"
  }
];

export default function CuisineTeaser() {
  const siteContent = useSiteContent();
  const [data, setData] = useState<CuisinesTeaserData | null>(
    (siteContent?.homepage as Record<string, unknown>)?.cuisinesTeaser as CuisinesTeaserData || null
  );

  useEffect(() => {
    if (siteContent?.homepage) {
      const hp = siteContent.homepage as Record<string, unknown>;
      if (hp.cuisinesTeaser) setData(hp.cuisinesTeaser as CuisinesTeaserData);
    }
  }, [siteContent]);

  const title = data?.title || "Pourquoi travailler";
  const titleHighlight = data?.titleHighlight || "avec moi ?";
  const description = data?.description || "Pas de grande enseigne, pas de commercial pressé. Juste un artisan passionné qui prend le temps de comprendre vos envies et votre façon de vivre. Ensemble, on crée la cuisine qui vous correspond vraiment.";
  const features = data?.features || defaultFeatures;
  const ctaText = data?.ctaText || "Découvrir mon expertise";
  const image1 = data?.image1 || "/cuisine1.png";
  const image2 = data?.image2 || "/cuisine2.png";
  const image3 = data?.image3 || "/cuisine3.png";
  const statNumber = data?.statNumber || "15+";
  const statText = data?.statText || "Ans d'expérience";

  return (
    <section className="py-24 bg-abp-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
              En toute simplicité
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-abp-primary mb-6 leading-tight">
              {title}<br />
              <span className="font-serif italic font-normal text-abp-dark-gray">{titleHighlight}</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            <div className="space-y-6 mb-8">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Ruler;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-abp-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-abp-gold" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-abp-primary mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link 
              href="/cuisines"
              className="inline-flex items-center gap-2 text-abp-primary font-bold text-sm uppercase tracking-wider hover:text-abp-gold transition-colors group"
            >
              {ctaText}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gray-200 rounded-sm overflow-hidden">
                <img 
                  src={image1}
                  alt="Cuisine moderne" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-abp-gold rounded-sm flex items-center justify-center p-6">
                <div className="text-center text-white">
                  <span className="text-4xl font-bold block">{statNumber}</span>
                  <span className="text-xs uppercase tracking-wider">{statText}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square bg-gray-200 rounded-sm overflow-hidden">
                <img 
                  src={image2}
                  alt="Cuisine design" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] bg-gray-200 rounded-sm overflow-hidden">
                <img 
                  src={image3}
                  alt="Cuisine contemporaine" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
