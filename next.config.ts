import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Pour utiliser les API Routes et le back-office, 
  // on ne peut pas utiliser output: 'export'
  // Le site doit être hébergé sur un serveur Node.js (Vercel, Railway, etc.)
  images: {
    unoptimized: true,
  },
  // Augmenter la limite de taille pour les uploads (100 Mo)
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
