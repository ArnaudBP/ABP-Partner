"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, Ruler, Eye, Shield, Sparkles, Clock, Users, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Ruler,
  Eye,
  Shield,
  Sparkles,
  Clock,
  Users
};

interface ExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

interface ExpertiseContent {
  accroche: string;
  titre: string;
  description: string;
  items: ExpertiseItem[];
  avantagesTitre: string;
  avantages: string[];
  anneesExperience: number;
}

const defaultContent: ExpertiseContent = {
  accroche: "Ce que je vous apporte",
  titre: "Un artisan, pas une enseigne",
  description: "Avec moi, vous avez un seul interlocuteur du début à la fin. Je connais votre projet par cœur et je suis disponible quand vous avez besoin.",
  items: [
    { icon: "Ruler", title: "Conception Sur Mesure", description: "Chaque cuisine est unique. J'adapte mes créations à votre espace, vos habitudes et votre style de vie." },
    { icon: "Eye", title: "Visualisation 3D", description: "Visualisez votre future cuisine en 3D photoréaliste avant le début des travaux. Modifiez jusqu'à satisfaction totale." },
    { icon: "Shield", title: "Garantie Décennale", description: "Tous mes travaux sont couverts par une garantie décennale. Votre tranquillité est ma priorité." },
    { icon: "Sparkles", title: "Finitions Premium", description: "Des matériaux nobles et des finitions impeccables pour une cuisine qui traversera les années." },
    { icon: "Clock", title: "Délais Respectés", description: "Planning précis et respect des délais annoncés. Nous nous engageons sur un calendrier clair." },
    { icon: "Users", title: "Accompagnement", description: "Un interlocuteur unique du début à la fin de votre projet. Disponibilité et réactivité garanties." }
  ],
  avantagesTitre: "Les avantages ABP Partner",
  avantages: [
    "Consultation gratuite à domicile",
    "Devis détaillé sans engagement",
    "Partenaires fabricants premium",
    "Installation par artisans qualifiés",
    "Service après-vente réactif",
    "Prix justes et transparents"
  ],
  anneesExperience: 15
};

export default function CuisinesExpertise() {
  const [content, setContent] = useState<ExpertiseContent>(defaultContent);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageCuisines?.expertise) {
          setContent(prev => ({ ...prev, ...data.pageCuisines.expertise }));
        }
      })
      .catch(console.error);
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {content.items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Ruler;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-abp-white p-8 rounded-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-abp-gold/10 rounded-sm flex items-center justify-center mb-6">
                  <IconComponent className="text-abp-gold" size={28} />
                </div>
                <h3 className="text-xl font-bold text-abp-primary mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Avantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-abp-primary rounded-sm p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {content.avantagesTitre}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.avantages.map((avantage, index) => (
                  <motion.div
                    key={avantage}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-abp-gold flex-shrink-0" size={20} />
                    <span className="text-white text-sm">{avantage}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="inline-block bg-white/10 p-8 rounded-sm">
                <span className="text-6xl font-bold text-abp-gold block">{content.anneesExperience}+</span>
                <span className="text-white text-sm uppercase tracking-wider">Années d&apos;expérience</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
