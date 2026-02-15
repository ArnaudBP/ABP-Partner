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
  subtitle?: string;
  description?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  quote?: string;
  quoteAuthor?: string;
}

export default function HeroSection() {
  const siteContent = useSiteContent();
  const [data, setData] = useState<HeroData | null>(
    (siteContent?.hero as HeroData) || null
  );

  useEffect(() => {
    if (siteContent?.hero) {
      setData(siteContent.hero as HeroData);
    }
  }, [siteContent]);

  const videoUrl = data?.videoUrl;
  const backgroundImage = data?.backgroundImage;
  const hasVideo = videoUrl && videoUrl.trim() !== "";
  const hasImage = backgroundImage && backgroundImage.trim() !== "";

  const title = data?.title || "Votre cuisine sur mesure,";
  const titleHighlight = data?.titleHighlight || "créée avec passion";
  const subtitle = data?.subtitle || "ABP Partner";
  const description = data?.description || "Depuis plus de 15 ans, je conçois des cuisines uniques, directement chez vous. Un seul interlocuteur, des conseils personnalisés et un résultat qui vous ressemble.";
  const ctaPrimary = data?.ctaPrimary || "Discutons de votre projet";
  const ctaSecondary = data?.ctaSecondary || "Voir mes réalisations";
  const quote = data?.quote || "";
  const quoteAuthor = data?.quoteAuthor || "";

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
            {subtitle}
          </motion.p>
          
          <h1 className="text-white text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
            {title}<br />
            <span className="italic text-gray-100 font-light">{titleHighlight}</span>
          </h1>
          
          <p className="text-gray-100 text-base md:text-lg max-w-xl mb-8 font-medium leading-relaxed">
            {description}
          </p>

          {quote && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="border-l-4 border-abp-gold/70 pl-6 py-3 mb-8 max-w-lg bg-black/20 backdrop-blur-sm rounded-r-lg"
            >
              <p className="text-gray-100 text-sm md:text-base italic font-medium leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              {quoteAuthor && (
                <p className="text-abp-gold text-sm mt-2 font-medium">
                  — {quoteAuthor}
                </p>
              )}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-abp-gold text-white text-sm font-bold tracking-wider hover:bg-white hover:text-abp-primary transition-colors duration-300 text-center rounded-lg shadow-lg"
            >
              {ctaPrimary}
            </Link>
            <Link 
              href="/realisations" 
              className="px-8 py-4 border-2 border-white/80 text-white text-sm font-bold tracking-wider hover:bg-white hover:text-abp-primary transition-colors duration-300 text-center rounded-lg"
            >
              {ctaSecondary}
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
