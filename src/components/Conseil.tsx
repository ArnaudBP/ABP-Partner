"use client";

import { motion } from "framer-motion";

export default function Conseil() {
  return (
    <section id="conseil" className="py-20 bg-abp-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-abp-gold text-xs font-bold tracking-[0.2em] uppercase mb-2">
              Services aux Professionnels
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-abp-primary mb-6">
              ABP CONSEIL
            </h3>
            
            <div className="space-y-4 text-sm md:text-base font-light text-gray-600 leading-relaxed">
              <p>
                Comme nous comprenons les défis auxquels votre entreprise est confrontée ainsi que les impératifs de l’industrie des meubles modulaires, ABP Partner vous propose un regard expérimenté sur les différents projets de votre entreprise et partage son expertise au travers d’une gamme complète de services :
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {[
                "La planification et la conception (études, conseil) de systèmes informatiques intégrant les technologies du matériel, des logiciels et des communications.",
                "Les services peuvent comprendre la formation des utilisateurs concernés;",
                "Le conseil en développement logiciel personnalisé, l’analyse des besoins des utilisateurs et la formulation des solutions;",
                "La formation qui améliore vos performances et l’efficacité de vos collaborateurs."
              ].map((item, index) => (
                <li key={index} className="flex items-start group">
                  <span className="w-1.5 h-1.5 bg-abp-gold mr-3 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="text-sm md:text-base font-medium text-abp-primary">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <a href="#contact" className="inline-block border-b border-abp-gold pb-1 text-abp-gold hover:text-abp-primary hover:border-abp-primary transition-colors duration-300 uppercase tracking-widest text-xs font-bold">
                En savoir plus sur nos services B2B
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 aspect-square lg:aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Consulting"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
