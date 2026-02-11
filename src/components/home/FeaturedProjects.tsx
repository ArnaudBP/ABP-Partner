"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Realisation } from "@/types";
import { useSiteContent } from '../SiteContentProvider';

interface RealisationsTeaserData {
  title?: string;
  titleHighlight?: string;
  description?: string;
  ctaText?: string;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const siteContent = useSiteContent();
  const [data, setData] = useState<RealisationsTeaserData | null>(
    (siteContent?.homepage as Record<string, unknown>)?.realisationsTeaser as RealisationsTeaserData || null
  );

  useEffect(() => {
    if (siteContent?.homepage) {
      const hp = siteContent.homepage as Record<string, unknown>;
      if (hp.realisationsTeaser) setData(hp.realisationsTeaser as RealisationsTeaserData);
    }

    // Charger les réalisations
    fetch('/api/realisations?featured=true')
      .then(res => res.json())
      .then(realisations => {
        setProjects(realisations.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteContent]);

  const title = data?.title || "Quelques projets";
  const titleHighlight = data?.titleHighlight || "dont je suis fier";
  const description = data?.description || "Chaque cuisine a son histoire. Voici quelques-unes de mes réalisations récentes, chacune pensée avec et pour mes clients.";
  const ctaText = data?.ctaText || "Voir plus de projets";

  if (loading) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/3] bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
              Mon portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-abp-primary mb-4">
              {title} <span className="font-serif italic font-normal">{titleHighlight}</span>
            </h2>
            <p className="text-gray-600 max-w-xl">
              {description}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <Link 
              href="/realisations"
              className="inline-flex items-center gap-2 text-abp-gold font-bold hover:text-abp-primary transition-colors group"
            >
              {ctaText} →
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/realisations/${project.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-gray-200">
                  <div className="absolute inset-0 bg-abp-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <Image
                    src={project.images[0] || '/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-abp-primary mb-1 group-hover:text-abp-gold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                  <ArrowRight 
                    size={20} 
                    className="text-abp-gold opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
