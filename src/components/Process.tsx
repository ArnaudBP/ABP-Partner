"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Définition & Écoute",
    text: "Débuter par définir afin de ne point finir par buter... La définition de vos besoins sera prise en compte sur plusieurs axes en tenant compte de vos contraintes budgétaires, spatiales, de lumières etc...",
  },
  {
    number: "02",
    title: "Conception & Crayonné",
    text: "Nous effectuerons ensemble une ébauche jusqu'à la réalisation d'un crayonné qui reste dans le périmètre de vos désirs et de vos possibilités, en remettant l'ouvrage sur le métier jusqu'à la solution optimale.",
  },
  {
    number: "03",
    title: "Visualisation 3D",
    text: "Le cuisiniste dessinera alors le projet sur un logiciel 3D spécifique qui vous permettra de visualiser les simulations nécessaires jusqu'à votre entière satisfaction. Il y intégrera tous les éléments et vous pourrez visualiser en 3D votre future cuisine.",
  },
  {
    number: "04",
    title: "Fabrication & Installation",
    text: "Une fois votre projet validé, le cuisiniste fera appel à une équipe de professionnels pour votre installation. Les éléments assemblés dans l'usine allemande vous seront livrés et seront installés en respectant les délais que votre cuisiniste vous aura indiqués.",
  },
  {
    number: "05",
    title: "Livraison",
    text: "Il ne vous restera plus, alors, qu'à profiter d'une cuisine livrée «Casseroles en main».",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-20 bg-abp-primary text-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold mb-4"
          >
            VOTRE PROJET
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-0.5 bg-abp-gold mx-auto mb-6"
          />
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
            De l'idée à la réalité, nous vous accompagnons à chaque étape pour garantir un résultat à la hauteur de vos attentes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-8 left-0 w-full h-px bg-white/10 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-abp-primary pt-4"
            >
              <div className="text-3xl font-bold text-abp-gold mb-4 font-serif">
                {step.number}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed text-xs md:text-sm">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
