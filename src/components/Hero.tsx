"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/Mon film 1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-[#2C241B]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-[1800px] mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h2 className="text-abp-gold text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
            ABP Partner
          </h2>
          <h1 className="text-white text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
            L'Art de la Cuisine <br />
            <span className="italic text-gray-100 font-light">à Domicile</span>
          </h1>
          
          <p className="text-gray-100 text-base md:text-lg max-w-xl mb-10 font-medium leading-relaxed border-l-2 border-abp-gold pl-6">
            Conception sur mesure, expertise haut de gamme et tarifs justes.
            Transformez votre intérieur sans bouger de chez vous.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#concept" 
              className="px-6 py-3 bg-abp-gold text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-abp-primary transition-colors duration-300 text-center rounded-sm"
            >
              Découvrir le concept
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 border border-white text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-abp-primary transition-colors duration-300 text-center rounded-sm"
            >
              Prendre Rendez-vous
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
