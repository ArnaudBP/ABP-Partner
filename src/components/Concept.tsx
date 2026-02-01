"use client";

import { motion } from "framer-motion";

const content = [
  {
    title: "Réduction des coûts",
    text: "Une cuisine d'exposition n'est jamais la cuisine dont vous avez besoin. Un cuisiniste à domicile saura prendre en compte les contraintes de votre cuisine. En s'émancipant du coût d'un magasin physique, il vous permettra de reporter cette économie sur l'achat de votre cuisine.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Prise en compte des contraintes",
    text: "C'est en se déplaçant à votre domicile que votre cuisiniste pourra prendre en compte les contraintes uniques de votre cuisine. Son expertise vous permettra par exemple de savoir où positionner les éclairages en fonction de vos ouvertures ou de savoir quel type d'éléments sont à installer en fonction des surfaces et de la nature des cloisons.",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80",
  },
  {
    title: "Budget Maîtrisé",
    text: "Le cuisiniste à domicile saura adapter également la cuisine dont vous rêvez au budget que vous avez défini. Il choisira les éléments parmi l'ensemble des catalogues fournisseurs et vous proposera les artisans les mieux placés pour vous fabriquer un ensemble cohérent, adapté à vos goûts ainsi qu'à votre budget.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Style de vie",
    text: "Ce n'est qu'en allant chez vous, que votre cuisiniste saura apprécier votre style de vie et vous proposer une cuisine s'adaptant à votre décoration intérieure. Il pourra alors déterminer avec vous les styles d'éléments, les matériaux et les couleurs.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Visualisation 3D",
    text: "S'appuyant sur le nec plus ultra en matière de logiciels de conception 3D, vous pourrez voir, modifier et valider votre cuisine avant même le début des travaux. Il sera possible alors, de prendre en compte et modifier les distances, les dimensions des ouvertures sur place et éviter des aller-retours fastidieux dans un magasin.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
  },
];

export default function Concept() {
  return (
    <section id="concept" className="py-20 bg-abp-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-abp-primary mb-4"
          >
            POURQUOI NOUS CHOISIR ?
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-0.5 bg-abp-gold mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {content.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="aspect-video overflow-hidden rounded-sm shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-abp-primary">{item.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
