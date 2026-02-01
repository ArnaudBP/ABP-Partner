"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bath, Shirt } from "lucide-react";
import { useEffect, useState } from "react";

interface AmenagementItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface AmenagementsTeaserData {
  title?: string;
  titleHighlight?: string;
  description?: string;
  items?: AmenagementItem[];
}

const defaultItems = [
  {
    title: "Salles de Bains",
    description: "Votre espace bien-être mérite autant d'attention que votre cuisine.",
    image: "/sdb1.png",
    link: "/autres-amenagements/salles-de-bains"
  },
  {
    title: "Dressings",
    description: "Un rangement optimisé qui simplifie votre quotidien.",
    image: "/dressing1.png",
    link: "/autres-amenagements/dressings"
  }
];

export default function AutresAmenagementsTeaser() {
  const [data, setData] = useState<AmenagementsTeaserData | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.homepage?.autresAmenagementsTeaser) {
          setData(content.homepage.autresAmenagementsTeaser);
        }
      })
      .catch(console.error);
  }, []);

  const title = data?.title || "Pas que";
  const titleHighlight = data?.titleHighlight || "des cuisines";
  const description = data?.description || "J'applique la même passion et le même savoir-faire à vos autres pièces. Parce qu'une maison harmonieuse, c'est important.";
  const items = data?.items || defaultItems;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            Et aussi...
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-abp-primary mb-4">
            {title} <span className="font-serif italic font-normal">{titleHighlight}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link 
                href={item.link || `/autres-amenagements/${item.title.toLowerCase().replace(/ /g, '-')}`}
                className="group block relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[16/9] bg-gray-200 relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-abp-gold rounded-sm flex items-center justify-center">
                        {index === 0 ? (
                          <Bath className="text-white" size={20} />
                        ) : (
                          <Shirt className="text-white" size={20} />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-abp-gold transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 max-w-md">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider group-hover:text-abp-gold transition-colors">
                      Découvrir
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
