import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Pour utiliser les API Routes et le back-office, 
  // on ne peut pas utiliser output: 'export'
  // Le site doit être hébergé sur un serveur Node.js (Vercel, Railway, etc.)
  images: {
    unoptimized: true,
  },
  // Variables d'environnement SMTP (intégrées au build)
  env: {
    SMTP_HOST: process.env.SMTP_HOST || 'ssl0.ovh.net',
    SMTP_USER: process.env.SMTP_USER || 'site@abp-partner.fr',
    SMTP_PASS: process.env.SMTP_PASS || 'TWqeFnjQPVs2b!i',
    CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'contact@abp-partner.fr',
  },
  // Augmenter la limite de taille pour les uploads (100 Mo)
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
