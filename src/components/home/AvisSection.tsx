'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface AvisSectionProps {
  houzzProfileUrl: string;
  houzzProId?: string;
  houzzHzid?: string;
}

export default function AvisSection({
  houzzProfileUrl,
  houzzProId = 'abppartner',
  houzzHzid = '41538'
}: AvisSectionProps) {
  
  // Charger le script Houzz
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('houzzwidget-js')) {
      const script = document.createElement('script');
      script.id = 'houzzwidget-js';
      script.async = true;
      script.src = `//platform.houzz.com/js/widgets.js?${new Date().getTime()}`;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#f9f9f9] rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icône et titre */}
            <div className="flex-shrink-0 text-center md:text-left">
              <div className="w-16 h-16 bg-abp-gold/20 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                <svg className="w-8 h-8 text-abp-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">100% Satisfaits</h3>
              <p className="text-gray-500 text-sm">Mes clients me recommandent</p>
            </div>

            {/* Widget Houzz */}
            <div className="flex-1 flex flex-col items-center md:items-start">
              <a 
                className="houzz-review-widget" 
                data-pro={houzzProId}
                data-hzid={houzzHzid}
                data-locale="fr-FR"
                href="https://www.houzz.fr"
              >
                Houzz
              </a>
              
              <a
                href={houzzProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#4DBC15] hover:underline"
              >
                Voir tous mes avis sur Houzz
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
