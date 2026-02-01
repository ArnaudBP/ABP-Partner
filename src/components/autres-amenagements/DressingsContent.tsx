"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shirt, Maximize, Lightbulb, Layers, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shirt,
  Maximize,
  Lightbulb,
  Layers
};

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface ConfigurationItem {
  title: string;
  description: string;
}

interface DressingsContentType {
  hero: {
    accroche: string;
    titre: string;
    sousTitre: string;
    description: string;
    image: string;
    boutonDevis: string;
    boutonRealisations: string;
  };
  features: {
    titre: string;
    description: string;
    items: FeatureItem[];
  };
  configurations: {
    titre: string;
    description: string;
    items: ConfigurationItem[];
  };
}

const defaultContent: DressingsContentType = {
  hero: {
    accroche: "Rangement intelligent",
    titre: "Dressings",
    sousTitre: "pensés pour vous",
    description: "Un bon dressing, c'est celui où chaque vêtement a sa place et où vous trouvez tout en un clin d'œil. Je le conçois sur mesure, adapté à vos habitudes.",
    image: "/dressing1.png",
    boutonDevis: "Demander un devis",
    boutonRealisations: "Voir mes réalisations"
  },
  features: {
    titre: "Les Avantages du Sur Mesure",
    description: "Un dressing parfaitement adapté à votre espace et vos habitudes.",
    items: [
      { icon: "Maximize", title: "Optimisation Espace", description: "Chaque centimètre est exploité intelligemment pour maximiser votre capacité de rangement." },
      { icon: "Layers", title: "Modulabilité", description: "Systèmes évolutifs qui s'adaptent à vos besoins. Ajoutez ou modifiez des éléments facilement." },
      { icon: "Lightbulb", title: "Éclairage Intégré", description: "LED automatiques à l'ouverture des portes. Visibilité parfaite sur toute votre garde-robe." },
      { icon: "Shirt", title: "Accessoires", description: "Tiroirs à bijoux, porte-cravates, supports à chaussures... Tout pour une organisation parfaite." }
    ]
  },
  configurations: {
    titre: "Configurations Possibles",
    description: "Quelle que soit la forme de votre espace, nous avons une solution.",
    items: [
      { title: "Dressing d'angle", description: "Solution idéale pour exploiter les coins perdus et créer un espace de rangement généreux." },
      { title: "Dressing linéaire", description: "Configuration classique le long d'un mur. Parfait pour les chambres ou couloirs." },
      { title: "Dressing en U", description: "Pour les pièces dédiées. Maximum de rangement et circulation centrale." },
      { title: "Dressing sous pente", description: "Exploitation optimale des combles et espaces atypiques." }
    ]
  }
};

export default function DressingsContent() {
  const [content, setContent] = useState<DressingsContentType>(defaultContent);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageDressings) {
          setContent(prev => ({
            hero: { ...prev.hero, ...data.pageDressings.hero },
            features: { ...prev.features, ...data.pageDressings.features },
            configurations: { ...prev.configurations, ...data.pageDressings.configurations }
          }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
              {content.hero.accroche}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-abp-primary mb-6">
              {content.hero.titre}<br />
              <span className="font-serif italic font-normal text-gray-500">{content.hero.sousTitre}</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {content.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact"
                className="px-8 py-4 bg-abp-gold text-white font-bold text-sm uppercase tracking-wider hover:bg-abp-primary transition-colors text-center"
              >
                {content.hero.boutonDevis}
              </Link>
              <Link 
                href="/realisations?category=dressing"
                className="px-8 py-4 border border-abp-primary text-abp-primary font-bold text-sm uppercase tracking-wider hover:bg-abp-primary hover:text-white transition-colors text-center"
              >
                {content.hero.boutonRealisations}
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/3] bg-gray-100 rounded-sm overflow-hidden"
          >
            <img 
              src={content.hero.image} 
              alt="Dressing sur mesure"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-abp-primary mb-4">
              {content.features.titre}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.features.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Maximize;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 bg-abp-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-abp-gold" size={28} />
                  </div>
                  <h3 className="font-bold text-abp-primary mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Configurations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-abp-primary rounded-sm p-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {content.configurations.titre}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {content.configurations.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.configurations.items.map((config, index) => (
              <motion.div
                key={config.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 p-6 rounded-sm"
              >
                <h3 className="font-bold text-white mb-2">{config.title}</h3>
                <p className="text-gray-400 text-sm">{config.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
