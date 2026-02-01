"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Cuisine Casher",
    subtitle: "Élégance et Respect des Traditions",
    description: "Ici, plusieurs impératifs ! Il a fallu être un cuisiniste casher. C'est une grande pièce où nous avons proposé une grande table repas pour 6 personnes, 2 éviers, 2 lave-vaisselles, une grande plaque à induction, une hotte efficace mais discrète. Elle doit être élégante et discrète pour ne pas donner l'impression de passer sa vie dans la cuisine.",
    details: [
      "2 éviers et 2 lave-vaisselles (Cacheroute)",
      "Lave-vaisselle Full intégrable",
      "Réfrigérateur > 300L et congélateur intégrés",
      "Table modulable 6-8 personnes"
    ],
    image: "/cuisine1.png",
  },
  {
    title: "Optimisation Locative",
    category: "Investissement",
    subtitle: "Fonctionnalité et Durabilité",
    description: "Dans cette cuisine, la propriétaire souhaite proposer une prestation de qualité pour la location de son appartement et ainsi limiter la dégradation de son bien. Nous avons prévu une cuisine fonctionnelle et complète avec des protections spécifiques (crédence inox, coups d'éponge).",
    details: [
      "Lave-vaisselle intégrable",
      "Optimisation des rangements (Elément d'angle)",
      "Grands tiroirs sous four et cuisson",
      "Crédence inox de protection"
    ],
    image: "/cuisine2.png",
  },
  {
    title: "Défi Lumière",
    category: "Rénovation",
    subtitle: "Transformation d'une pièce aveugle",
    description: "Une petite pièce sans fenêtre dans un rez-de-villa en rénovation. La solution a été de créer un puits de lumière artificielle avec des dalles en Power LED. Pour renforcer la lumière, nous avons utilisé une crédence en verre laqué avec également des Power LED à l'arrière.",
    details: [
      "Puits de lumière artificielle Power LED",
      "Crédence verre laqué rétro-éclairée",
      "Éléments hauts Lack Laminat haute brillance",
      "Optimisation de l'espace restreint"
    ],
    image: "/cuisine3.png",
  },
];

export default function Projects() {
  return (
        <section id="realisations" className="py-20 bg-gray-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-abp-gold font-bold tracking-widest uppercase text-xs mb-2 block">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-abp-primary mb-4">
              Nos Réalisations
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Notre objectif : Vous satisfaire et obtenir <b>le meilleur au prix le plus juste</b>. La plupart de nos clients nous sont recommandés par d'anciens clients heureux de leur cuisine <i>« casseroles en main »</i>.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <a href="#contact" className="text-abp-primary font-bold text-xs tracking-widest uppercase border-b border-abp-primary pb-1 hover:text-abp-gold hover:border-abp-gold transition-colors duration-300">
              Voir tous les projets
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <div className="absolute inset-0 bg-abp-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-abp-primary mb-1 group-hover:text-abp-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {project.category}
                  </p>
                </div>
                <span className="text-abp-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <a href="#contact" className="inline-block px-6 py-3 border border-abp-primary text-abp-primary text-xs font-bold tracking-widest uppercase hover:bg-abp-primary hover:text-white transition-colors duration-300">
            Voir tous les projets
          </a>
        </div>
      </div>
    </section>
  );
}
