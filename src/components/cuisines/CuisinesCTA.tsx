"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { useSiteContent } from '../SiteContentProvider';

interface CTAContent {
  accroche: string;
  titre: string;
  sousTitre: string;
  description: string;
  boutonTexte: string;
  telephone: string;
}

const defaultContent: CTAContent = {
  accroche: "Prêt à Commencer ?",
  titre: "Votre cuisine de rêve",
  sousTitre: "commence ici",
  description: "Prenez rendez-vous pour une consultation gratuite à domicile. Sans engagement, nous analysons votre projet et vous proposons des solutions sur mesure.",
  boutonTexte: "Prendre Rendez-vous",
  telephone: "+33 1 23 45 67 89"
};

export default function CuisinesCTA() {
  const siteContent = useSiteContent();
  const pageData = siteContent?.pageCuisines as Record<string, unknown> | undefined;
  const content = pageData?.cta
    ? { ...defaultContent, ...(pageData.cta as Partial<CTAContent>) }
    : defaultContent;

  return (
    <section className="py-24 bg-abp-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-abp-gold rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-abp-gold rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-abp-gold font-bold tracking-widest uppercase text-xs mb-4 block">
            {content.accroche}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {content.titre}<br />
            <span className="font-serif italic font-normal text-gray-300">{content.sousTitre}</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-abp-gold text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-abp-primary transition-colors"
            >
              <Calendar size={18} />
              {content.boutonTexte}
            </Link>
            <a 
              href={`tel:${content.telephone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-abp-primary transition-colors"
            >
              <Phone size={18} />
              {content.telephone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
