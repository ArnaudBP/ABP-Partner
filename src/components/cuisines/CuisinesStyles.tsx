"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSiteContent } from '../SiteContentProvider';

interface StyleItem {
  name: string;
  description: string;
  image: string;
  features: string[];
}

interface StylesContent {
  accroche: string;
  titre: string;
  description: string;
  items: StyleItem[];
  ctaTexte: string;
}

const defaultContent: StylesContent = {
  accroche: "Inspirations",
  titre: "Quel style vous attire ?",
  description: "Moderne, classique, design... On trouve ensemble ce qui correspond à vos goûts et à votre intérieur.",
  items: [
    { name: "Contemporain", description: "Lignes épurées, matériaux nobles et fonctionnalité optimale. Le choix de l'élégance moderne.", image: "/cuisine1.png", features: ["Façades sans poignées", "Plan de travail quartz", "Éclairage LED intégré"] },
    { name: "Classique", description: "L'élégance intemporelle revisitée. Des finitions raffinées pour une cuisine chaleureuse.", image: "/cuisine2.png", features: ["Moulures et cadres", "Poignées laiton", "Finitions mates"] },
    { name: "Design", description: "Pour les amateurs d'audace. Des matériaux innovants et des lignes architecturales.", image: "/cuisine3.png", features: ["Îlot central", "Matériaux high-tech", "Couleurs affirmées"] }
  ],
  ctaTexte: "Voir mes réalisations cuisines"
};

export default function CuisinesStyles() {
  const siteContent = useSiteContent();
  const pageData = siteContent?.pageCuisines as Record<string, unknown> | undefined;
  const content = pageData?.styles
    ? { ...defaultContent, ...(pageData.styles as Partial<StylesContent>) }
    : defaultContent;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            {content.accroche}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-abp-primary mb-4">
            {content.titre}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {content.items.map((style, index) => (
            <motion.div
              key={style.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6">
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
                  <ul className="space-y-1">
                    {style.features.map((feature, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                        <span className="w-1 h-1 bg-abp-gold rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-gray-600">{style.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/realisations?category=cuisine"
            className="inline-block px-8 py-4 bg-abp-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-abp-gold transition-colors"
          >
            {content.ctaTexte}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
