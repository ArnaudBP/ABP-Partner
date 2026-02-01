"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Realisation } from "@/types";

const categories = [
  { id: "all", label: "Toutes" },
  { id: "cuisine", label: "Cuisines" },
  { id: "salle-de-bains", label: "Salles de Bains" },
  { id: "dressing", label: "Dressings" },
];

export default function RealisationsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/realisations')
      .then(res => res.json())
      .then(data => {
        setRealisations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all' 
    ? realisations 
    : realisations.filter(r => r.category === activeCategory);

  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            Fiertés d&apos;artisan
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-abp-primary mb-4">
            Mes Réalisations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chaque projet a son histoire. Voici quelques cuisines, salles de bains 
            et dressings que j&apos;ai eu le plaisir de réaliser pour mes clients.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeCategory === cat.id
                  ? "bg-abp-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-abp-gold hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 mb-4" />
                <div className="h-6 bg-gray-200 w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((realisation) => (
                <motion.div
                  key={realisation.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/realisations/${realisation.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-gray-100">
                      <div className="absolute inset-0 bg-abp-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <Image
                        src={realisation.images[0] || '/placeholder.jpg'}
                        alt={realisation.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-abp-primary mb-1 group-hover:text-abp-gold transition-colors">
                          {realisation.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{realisation.subtitle}</p>
                        <span className="text-xs text-abp-gold uppercase tracking-wider">
                          {realisation.category === 'cuisine' ? 'Cuisine' : 
                           realisation.category === 'salle-de-bains' ? 'Salle de Bains' : 'Dressing'}
                        </span>
                      </div>
                      <span className="text-abp-gold opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                        →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">Aucune réalisation dans cette catégorie.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
