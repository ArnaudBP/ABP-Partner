"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteContent } from '../SiteContentProvider';

interface CTASectionData {
  title?: string;
  titleHighlight?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  testimonialTitle?: string;
  testimonialSubtitle?: string;
  testimonialQuote?: string;
}

export default function CTAContact() {
  const siteContent = useSiteContent();
  const [data, setData] = useState<CTASectionData | null>(
    (siteContent?.homepage as Record<string, unknown>)?.ctaSection as CTASectionData || null
  );
  const [contact, setContact] = useState<{phone?: string; email?: string; address?: string} | null>(
    (siteContent?.contact as {phone?: string; email?: string; address?: string}) || null
  );

  useEffect(() => {
    if (siteContent) {
      const hp = siteContent.homepage as Record<string, unknown>;
      if (hp?.ctaSection) setData(hp.ctaSection as CTASectionData);
      if (siteContent.contact) setContact(siteContent.contact as {phone?: string; email?: string; address?: string});
      return;
    }
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.homepage?.ctaSection) {
          setData(content.homepage.ctaSection);
        }
        if (content.contact) {
          setContact(content.contact);
        }
      })
      .catch(console.error);
  }, [siteContent]);

  const title = data?.title || "Envie d'en";
  const titleHighlight = data?.titleHighlight || "discuter ?";
  const description = data?.description || "Appelez-moi ou envoyez-moi un message, on prend un café ensemble et on parle de votre projet. Pas de pression, juste une discussion pour voir si on peut travailler ensemble.";
  const ctaText = data?.ctaText || "Prendre Rendez-vous";
  const image = data?.image || "/cuisine1.png";
  const testimonialTitle = data?.testimonialTitle || "100% Satisfaits";
  const testimonialSubtitle = data?.testimonialSubtitle || "Mes clients me recommandent";
  const testimonialQuote = data?.testimonialQuote || "Un accompagnement personnalisé du début à la fin. Résultat impeccable !";

  const phone = contact?.phone || "+33 1 23 45 67 89";
  const email = contact?.email || "contact@abp-partner.com";
  const address = contact?.address || "13, rue de la ferme - 60530 Le Mesnil en Thelle";

  return (
    <section className="py-24 bg-abp-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-abp-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-abp-gold rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-abp-gold text-sm font-medium tracking-wide mb-2 block">
              Premier contact
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-abp-primary mb-6 leading-tight">
              {title} <br />
              <span className="font-serif italic font-normal text-abp-gold">{titleHighlight}</span>
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-abp-gold/10 rounded-sm flex items-center justify-center">
                  <Phone className="text-abp-gold" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Téléphone</p>
                  <p className="font-bold text-abp-primary">{phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-abp-gold/10 rounded-sm flex items-center justify-center">
                  <Mail className="text-abp-gold" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-bold text-abp-primary">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-abp-gold/10 rounded-sm flex items-center justify-center">
                  <MapPin className="text-abp-gold" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Adresse</p>
                  <p className="font-bold text-abp-primary">{address}</p>
                </div>
              </div>
            </div>

            <Link 
              href="/contact"
              className="inline-block px-8 py-4 bg-abp-gold text-white font-bold text-base rounded-lg hover:bg-abp-primary transition-colors shadow-lg"
            >
              ☕ {ctaText}
            </Link>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={image}
                alt="Consultation à domicile"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
