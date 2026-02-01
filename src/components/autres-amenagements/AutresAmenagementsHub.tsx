"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bath, Shirt, CheckCircle } from "lucide-react";

const amenagements = [
  {
    id: "salles-de-bains",
    title: "Salles de Bains",
    subtitle: "Votre espace bien-être",
    description: "Créez votre havre de paix avec une salle de bains conçue sur mesure. De la douche à l'italienne au mobilier vasque, nous transformons votre salle de bains en véritable espace de détente.",
    icon: Bath,
    image: "/sdb1.png",
    features: [
      "Douches à l'italienne XXL",
      "Meubles vasques sur mesure",
      "Rangements optimisés",
      "Éclairage LED intégré",
      "Robinetterie haut de gamme",
      "Carrelage grand format"
    ]
  },
  {
    id: "dressings",
    title: "Dressings",
    subtitle: "L'organisation parfaite",
    description: "Optimisez votre rangement avec des solutions sur mesure parfaitement adaptées à votre garde-robe et à votre espace. Chaque centimètre est exploité pour une organisation optimale.",
    icon: Shirt,
    image: "/dressing1.png",
    features: [
      "Penderies modulables",
      "Tiroirs à compartiments",
      "Éclairage automatique",
      "Portes coulissantes",
      "Accessoires de rangement",
      "Finitions personnalisées"
    ]
  }
];

export default function AutresAmenagementsHub() {
  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            Au-delà de la cuisine
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-abp-primary mb-4">
            Autres Aménagements
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            J&apos;applique le même savoir-faire et la même passion 
            à vos salles de bains et dressings. 
            Parce qu&apos;un intérieur harmonieux, ça compte.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-24">
          {amenagements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="aspect-[4/3] relative overflow-hidden rounded-sm bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-abp-gold/10 rounded-sm flex items-center justify-center">
                    <item.icon className="text-abp-gold" size={28} />
                  </div>
                  <div>
                    <span className="text-abp-gold font-bold tracking-widest uppercase text-xs block">
                      {item.subtitle}
                    </span>
                    <h2 className="text-3xl font-bold text-abp-primary">
                      {item.title}
                    </h2>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="text-abp-gold flex-shrink-0" size={16} />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href={`/autres-amenagements/${item.id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-abp-primary text-white font-bold text-sm uppercase tracking-wider hover:bg-abp-gold transition-colors"
                  >
                    En savoir plus
                    <ArrowRight size={16} />
                  </Link>
                  <Link 
                    href={`/realisations?category=${item.id === 'salles-de-bains' ? 'salle-de-bains' : 'dressing'}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-abp-primary text-abp-primary font-bold text-sm uppercase tracking-wider hover:bg-abp-primary hover:text-white transition-colors"
                  >
                    Voir les réalisations
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-abp-primary rounded-sm p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Un projet d&apos;aménagement ?
          </h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Contactez-nous pour une consultation gratuite à domicile. 
            Nous étudierons ensemble les meilleures solutions pour votre espace.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-4 bg-abp-gold text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-abp-primary transition-colors"
          >
            Prendre Rendez-vous
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
