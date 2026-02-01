"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MarbleBackground() {
  const { scrollYProgress } = useScroll();

  // A more organic, vein-like path
  const pathDefinition = "M100,0 C120,100 80,200 100,300 C130,450 70,600 100,750 C140,900 60,1050 100,1200 C130,1350 70,1500 100,1650 C140,1800 60,1950 100,2100 C130,2250 70,2400 100,2550 C140,2700 60,2850 100,3000 C130,3150 70,3300 100,3450 C140,3600 60,3750 100,3900 C130,4050 70,4200 100,4350";

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-white">
      {/* White Marble Texture - High Quality */}
      <div 
        className="absolute inset-0 opacity-100 mix-blend-normal"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.05) brightness(1.1)'
        }}
      />
      
      {/* Central Glow / Luminous Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_70%)] mix-blend-overlay" />

      {/* Shimmer Effect for "Incrustations de Lumière" */}
      <div className="marble-shine"></div>

      {/* Animated Gold Vein */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1920px] opacity-100">
        <svg 
          viewBox="0 0 200 4350" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          {/* Base Vein (Faint Gold) */}
          <path
            d={pathDefinition}
            fill="none"
            stroke="rgba(198, 168, 124, 0.2)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Glowing Gold Vein (Scroll Linked) */}
          <motion.path
            d={pathDefinition}
            fill="none"
            stroke="#C6A87C"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              pathLength: scrollYProgress,
              filter: "drop-shadow(0 0 8px rgba(198, 168, 124, 0.5))"
            }}
          />
        </svg>
      </div>

      {/* Ambient Light Spots - Adjusted for Light Theme */}
      <motion.div 
        className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-abp-gold/10 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-abp-gold/10 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}