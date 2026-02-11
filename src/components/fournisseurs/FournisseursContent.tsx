"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Download, Loader2, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { Fournisseur } from "@/types";

// Composant bouton de téléchargement avec progression
function DownloadButton({ url, year }: { url: string; year?: number }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (downloading) return;
    
    setDownloading(true);
    setProgress(0);
    setError(false);

    try {
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Erreur téléchargement');
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Pas de reader');
      
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (total > 0) {
          setProgress(Math.round((received / total) * 100));
        } else {
          // Si pas de content-length, animer progressivement
          setProgress(Math.min(progress + 5, 90));
        }
      }

      // Créer le blob et télécharger
      const blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = url.split('/').pop() || 'catalogue.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setProgress(100);
      setDone(true);
      
      // Reset après 3 secondes
      setTimeout(() => {
        setDownloading(false);
        setDone(false);
        setProgress(0);
      }, 3000);

    } catch (err) {
      console.error('Erreur:', err);
      setError(true);
      setTimeout(() => {
        setDownloading(false);
        setError(false);
        setProgress(0);
      }, 3000);
    }
  };

  if (error) {
    return (
      <button className="inline-flex items-center gap-2 text-red-500 text-sm font-medium">
        <X size={14} />
        Erreur - Réessayer
      </button>
    );
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 text-green-600 text-sm font-medium">
        <CheckCircle size={14} />
        Téléchargé !
      </span>
    );
  }

  if (downloading) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-abp-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-gray-500 w-8">{progress}%</span>
        <Loader2 size={14} className="animate-spin text-abp-gold" />
      </div>
    );
  }

  return (
    <button 
      onClick={handleDownload}
      className="inline-flex items-center gap-2 text-abp-primary hover:text-abp-gold transition-colors text-sm font-medium"
    >
      <Download size={14} />
      Catalogue {year || ''}
    </button>
  );
}

export default function FournisseursContent() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fournisseurs')
      .then(res => res.json())
      .then(data => {
        setFournisseurs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
            Qualité garantie
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-abp-primary mb-4">
            Mes Partenaires
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Après 15 ans de métier, j&apos;ai sélectionné les fournisseurs les plus fiables. 
            Des marques reconnues, des produits durables, et des catalogues à feuilleter ensemble.
          </p>
        </motion.div>

        {/* Fournisseurs Details */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fournisseurs.map((fournisseur, index) => (
                <motion.div
                  key={fournisseur.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-abp-white p-6 rounded-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {fournisseur.logo ? (
                      <img 
                        src={fournisseur.logo} 
                        alt={fournisseur.name}
                        className="h-10 object-contain"
                      />
                    ) : (
                      <div className="h-10 flex items-center">
                        <span className="text-abp-primary font-bold text-xl">
                          {fournisseur.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{fournisseur.description}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    {fournisseur.website && (
                      <a 
                        href={fournisseur.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-abp-gold hover:text-abp-primary transition-colors text-sm font-medium"
                      >
                        Visiter le site
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {fournisseur.cataloguePdf && (
                      <DownloadButton 
                        url={fournisseur.cataloguePdf} 
                        year={fournisseur.catalogueYear} 
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-gray-600 mb-6">
            Besoin d&apos;aide pour choisir vos équipements ? Contactez-moi pour des conseils personnalisés.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-4 bg-abp-gold text-white font-bold text-sm uppercase tracking-wider hover:bg-abp-primary transition-colors rounded-lg"
          >
            Me Contacter
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
