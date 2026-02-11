"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Bath, Droplets, Sparkles, Shield, LucideIcon } from "lucide-react";
import { useSiteContent } from '../SiteContentProvider';

const iconMap: Record<string, LucideIcon> = {
  Bath,
  Droplets,
  Sparkles,
  Shield
};

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface SDBContent {
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
  services: {
    titre: string;
    description: string;
    items: string[];
    image: string;
  };
}

const defaultContent: SDBContent = {
  hero: {
    accroche: "Votre espace bien-être",
    titre: "Salles de Bains",
    sousTitre: "conçues pour vous",
    description: "Une salle de bains, c'est plus qu'une pièce fonctionnelle. C'est votre moment de détente le matin et le soir. Je la conçois pour qu'elle vous ressemble et vous apaise.",
    image: "/sdb1.png",
    boutonDevis: "Demander un devis",
    boutonRealisations: "Voir mes réalisations"
  },
  features: {
    titre: "Ce que je maîtrise",
    description: "La salle de bains demande un savoir-faire particulier. Voici ce que je vous apporte.",
    items: [
      { icon: "Bath", title: "Douches à l'italienne", description: "Design épuré et accès facilité. Receveurs extra-plats et parois sur mesure." },
      { icon: "Droplets", title: "Robinetterie Premium", description: "Marques reconnues et finitions haut de gamme. Chrome, noir mat, or brossé..." },
      { icon: "Sparkles", title: "Finitions Soignées", description: "Joints étanches, faïence posée avec précision, mobilier parfaitement ajusté." },
      { icon: "Shield", title: "Garantie Qualité", description: "Travaux garantis et assurance décennale. Votre sérénité est ma priorité." }
    ]
  },
  services: {
    titre: "Mes Services",
    description: "Une prise en charge complète de votre projet, de la conception à la réalisation. Je coordonne tous les corps de métier pour un résultat impeccable.",
    items: [
      "Conception 3D de votre salle de bains",
      "Meubles vasques sur mesure",
      "Douches et baignoires",
      "Carrelage et faïence",
      "Plomberie et raccordements",
      "Éclairage et ventilation",
      "Chauffage (sèche-serviettes)",
      "Rangements optimisés"
    ],
    image: "/sdb1.png"
  }
};

export default function SallesDeBainsContent() {
  const siteContentCtx = useSiteContent();
  const pageSDB = siteContentCtx?.pageSallesDeBains as Record<string, unknown> | undefined;
  const content = pageSDB
    ? {
        hero: { ...defaultContent.hero, ...(pageSDB.hero as object) },
        features: { ...defaultContent.features, ...(pageSDB.features as object) },
        services: { ...defaultContent.services, ...(pageSDB.services as object) }
      }
    : defaultContent;

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
                href="/realisations?category=salle-de-bains"
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
              alt="Salle de bains sur mesure"
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
              const IconComponent = iconMap[feature.icon] || Bath;
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

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-abp-white rounded-sm p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-abp-primary mb-6">
                {content.services.titre}
              </h2>
              <p className="text-gray-600 mb-8">
                {content.services.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.services.items.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="text-abp-gold flex-shrink-0" size={16} />
                    <span className="text-sm text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-square bg-gray-200 rounded-sm overflow-hidden">
              <img 
                src={content.services.image} 
                alt="Détail salle de bains"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
