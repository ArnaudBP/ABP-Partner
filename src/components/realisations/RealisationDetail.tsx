"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Eye, ExternalLink } from "lucide-react";
import { Realisation } from "@/types";

interface Props {
  realisation: Realisation;
}

export default function RealisationDetail({ realisation }: Props) {
  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/realisations"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-abp-gold transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Retour aux réalisations
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="aspect-[4/3] relative bg-gray-100 mb-4">
              <Image
                src={realisation.images[0] || '/placeholder.jpg'}
                alt={realisation.title}
                fill
                className="object-cover"
              />
            </div>
            {realisation.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {realisation.images.slice(1, 4).map((img, index) => (
                  <div key={index} className="aspect-square relative bg-gray-100">
                    <Image
                      src={img}
                      alt={`${realisation.title} - ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-abp-gold font-bold tracking-widest uppercase text-xs mb-4 block">
              {realisation.category === 'cuisine' ? 'Cuisine' : 
               realisation.category === 'salle-de-bains' ? 'Salle de Bains' : 'Dressing'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-abp-primary mb-4">
              {realisation.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-serif italic">
              {realisation.subtitle}
            </p>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed">
                {realisation.description}
              </p>
            </div>

            {/* Details */}
            {realisation.details && realisation.details.length > 0 && (
              <div className="bg-abp-white p-8 rounded-sm mb-8">
                <h3 className="font-bold text-abp-primary mb-4 uppercase tracking-wider text-sm">
                  Caractéristiques du projet
                </h3>
                <ul className="space-y-3">
                  {realisation.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-abp-gold flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lien visuels 3D */}
            {realisation.lien3D && (
              <motion.a
                href={realisation.lien3D}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 bg-gradient-to-r from-abp-primary to-abp-primary/90 text-white p-6 rounded-sm mb-8 hover:from-abp-gold hover:to-abp-gold/90 transition-all group"
              >
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Visuels 3D du projet</h3>
                  <p className="text-white/80 text-sm">
                    Découvrez ce projet en images de synthèse avant réalisation
                  </p>
                </div>
                <ExternalLink size={24} className="text-white/60 group-hover:text-white transition-colors" />
              </motion.a>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact"
                className="px-8 py-4 bg-abp-gold text-white font-bold text-sm uppercase tracking-wider hover:bg-abp-primary transition-colors text-center"
              >
                Discuter de mon projet
              </Link>
              <Link 
                href="/realisations"
                className="px-8 py-4 border border-abp-primary text-abp-primary font-bold text-sm uppercase tracking-wider hover:bg-abp-primary hover:text-white transition-colors text-center"
              >
                Voir d&apos;autres réalisations
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
