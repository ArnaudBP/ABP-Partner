"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Fournisseur } from "@/types";
import { useSiteContent } from '../SiteContentProvider';

interface FournisseursTeaserData {
  title?: string;
  titleHighlight?: string;
  description?: string;
}

export default function FournisseursTeaser() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const siteContent = useSiteContent();
  const [data, setData] = useState<FournisseursTeaserData | null>(
    (siteContent?.homepage as Record<string, unknown>)?.fournisseursTeaser as FournisseursTeaserData || null
  );

  useEffect(() => {
    if (siteContent?.homepage) {
      const hp = siteContent.homepage as Record<string, unknown>;
      if (hp.fournisseursTeaser) setData(hp.fournisseursTeaser as FournisseursTeaserData);
    }

    // Charger les fournisseurs
    fetch('/api/fournisseurs')
      .then(res => res.json())
      .then(data => {
        setFournisseurs(data.filter((f: Fournisseur) => f.featured).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteContent]);

  const title = data?.title || "Des marques";
  const titleHighlight = data?.titleHighlight || "de confiance";
  const description = data?.description || "Après 15 ans de métier, j'ai sélectionné les meilleurs partenaires. Des marques solides, des produits durables, et un rapport qualité-prix imbattable.";

  return (
    <section className="py-24 bg-abp-primary text-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            Mes partenaires
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title} <span className="font-serif italic font-normal">{titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[3/2] bg-white/10 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {fournisseurs.map((fournisseur, index) => (
              <motion.div
                key={fournisseur.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="aspect-[3/2] bg-white rounded-sm flex items-center justify-center p-4 group-hover:bg-abp-gold transition-colors duration-300">
                  {fournisseur.logo ? (
                    <img 
                      src={fournisseur.logo} 
                      alt={fournisseur.name}
                      className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="text-abp-primary font-bold text-lg group-hover:text-white transition-colors">
                      {fournisseur.name}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/fournisseurs"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-abp-primary transition-colors"
          >
            Voir tous les fournisseurs & catalogues
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
