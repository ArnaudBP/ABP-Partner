"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface EtapeItem {
  number: string;
  title: string;
  description: string;
  duration: string;
}

interface ProcessContent {
  accroche: string;
  titre: string;
  description: string;
  etapes: EtapeItem[];
}

const defaultContent: ProcessContent = {
  accroche: "Comment ça se passe",
  titre: "Votre projet, étape par étape",
  description: "Pas de surprise, pas de stress. Je vous explique tout et on avance ensemble à votre rythme.",
  etapes: [
    { number: "01", title: "Premier Contact", description: "Échange téléphonique ou par email pour comprendre vos besoins et planifier une visite à domicile gratuite.", duration: "Jour 1" },
    { number: "02", title: "Visite & Mesures", description: "Je me déplace chez vous pour prendre les mesures précises et analyser votre espace et vos contraintes.", duration: "Semaine 1" },
    { number: "03", title: "Conception 3D", description: "Création de votre projet en 3D photoréaliste avec plusieurs propositions d'aménagement et de styles.", duration: "Semaine 2" },
    { number: "04", title: "Devis Détaillé", description: "Présentation du devis complet et transparent, incluant tous les équipements et la pose.", duration: "Semaine 2" },
    { number: "05", title: "Validation & Commande", description: "Ajustements selon vos retours, validation finale du projet et passage de commande chez mes fournisseurs partenaires.", duration: "Semaine 3" },
    { number: "06", title: "Installation", description: "Pose professionnelle avec soin et précision. Nettoyage du chantier et remise des clés de votre nouvelle cuisine.", duration: "Semaine 8-10" }
  ]
};

export default function CuisinesProcess() {
  const [content, setContent] = useState<ProcessContent>(defaultContent);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageCuisines?.process) {
          setContent(prev => ({ ...prev, ...data.pageCuisines.process }));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-24 bg-gray-50">
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

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-abp-gold/30 transform -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {content.etapes.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:order-2 lg:pl-12'}`}>
                  <div className={`bg-white p-8 rounded-sm shadow-sm ${index % 2 === 0 ? 'lg:ml-auto' : ''} max-w-lg`}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-bold text-abp-gold">{step.number}</span>
                      <div>
                        <h3 className="text-xl font-bold text-abp-primary">{step.title}</h3>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{step.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                {/* Timeline Point */}
                <div className={`hidden lg:flex justify-center ${index % 2 === 0 ? 'lg:order-2' : ''}`}>
                  <div className="w-4 h-4 bg-abp-gold rounded-full relative">
                    <div className="absolute inset-0 bg-abp-gold rounded-full animate-ping opacity-25" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
