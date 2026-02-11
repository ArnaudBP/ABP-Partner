"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSiteContent } from '../SiteContentProvider';

interface HeroData {
  videoUrl?: string;
  backgroundImage?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export default function HeroSection() {
  const siteContent = useSiteContent();
  const [data, setData] = useState<HeroData | null>(
    (siteContent?.hero as HeroData) || null
  );

  useEffect(() => {
    if (siteContent?.hero) {
      setData(siteContent.hero as HeroData);
      return;
    }
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.hero) {
          setData(content.hero);
        }
      })
      .catch(console.error);
  }, [siteContent]);

  const videoUrl = data?.videoUrl;
  const backgroundImage = data?.backgroundImage;
  const hasVideo = videoUrl && videoUrl.trim() !== "";
  const hasImage = backgroundImage && backgroundImage.trim() !== "";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background - Video or Image */}
      <div className="absolute inset-0 z-0">
        {hasVideo ? (
          <video
            key={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-75 brightness-110"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : hasImage ? (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover opacity-75 brightness-110"
            priority
          />
        ) : (
          <video
            key="/Mon film 1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-75 brightness-110"
          >
            <source src="/Mon film 1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-[#2C241B]/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-[1800px] mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Accroche */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-abp-gold text-sm md:text-base font-medium tracking-wide mb-2"
          >
            Bienvenue chez moi
          </motion.p>
          
          <h1 className="text-white text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
            Votre cuisine sur mesure,<br />
            <span className="italic text-gray-100 font-light">créée avec passion</span>
          </h1>
          
          <p className="text-gray-100 text-base md:text-lg max-w-xl mb-6 font-medium leading-relaxed">
            Depuis plus de 15 ans, je conçois des cuisines uniques, 
            directement chez vous. Un seul interlocuteur, des conseils 
            personnalisés et un résultat qui vous ressemble.
          </p>
          
          {/* Citation personnelle */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md border-l-4 border-abp-gold">
            <p className="text-white/90 italic text-sm">
              &quot;Chaque cuisine raconte une histoire. La vôtre mérite d&apos;être unique.&quot;
            </p>
            <p className="text-abp-gold font-medium text-sm mt-2">— Arnaud</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-abp-gold text-white text-sm font-bold tracking-wider hover:bg-white hover:text-abp-primary transition-colors duration-300 text-center rounded-lg shadow-lg"
            >
              Discutons de votre projet
            </Link>
            <Link 
              href="/realisations" 
              className="px-8 py-4 border-2 border-white/80 text-white text-sm font-bold tracking-wider hover:bg-white hover:text-abp-primary transition-colors duration-300 text-center rounded-lg"
            >
              Voir mes réalisations
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}
