"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

interface FooterContent {
  brandName: string;
  tagline: string;
  adresseLigne1: string;
  adresseLigne2: string;
  rcsInfo: string;
  capitalInfo: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    houzz: string;
  };
  mentionsLegalesHref: string;
  politiqueConfidentialiteHref: string;
  directeurPublication: string;
  copyrightText: string;
  designedBy: string;
}

const defaultContent: FooterContent = {
  brandName: "ABP Partner",
  tagline: "Cuisiniste à domicile & Conseil en aménagement.",
  adresseLigne1: "13, rue de la ferme",
  adresseLigne2: "60530 Le Mesnil en Thelle",
  rcsInfo: "RCS COMPIEGNE : 798 153 169",
  capitalInfo: "SAS au Capital de 5 000 Euros",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    houzz: ""
  },
  mentionsLegalesHref: "/mentions-legales",
  politiqueConfidentialiteHref: "/politique-confidentialite",
  directeurPublication: "Arnaud Bourak-Partouche",
  copyrightText: "ABP Partner. All rights reserved.",
  designedBy: "Designed by ABP"
};

// Composant icône Houzz personnalisé
const HouzzIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.5 3L4 7.5V21h7v-7h5v7h4V7.5L12.5 3z"/>
  </svg>
);

export default function Footer() {
  const [content, setContent] = useState<FooterContent>(defaultContent);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.footer) {
          setContent(prev => ({ ...prev, ...data.footer }));
        }
      })
      .catch(console.error);
  }, []);

  // Filtrer les réseaux sociaux qui ont un lien
  const activeSocialLinks = [
    { key: 'houzz', url: content.socialLinks.houzz, Icon: HouzzIcon },
    { key: 'instagram', url: content.socialLinks.instagram, Icon: Instagram },
    { key: 'facebook', url: content.socialLinks.facebook, Icon: Facebook },
    { key: 'linkedin', url: content.socialLinks.linkedin, Icon: Linkedin },
  ].filter(social => social.url);

  return (
    <footer className="bg-abp-primary text-white py-16 border-t border-white/10">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="block text-xl font-bold tracking-tighter text-white font-serif">
              {content.brandName}
            </a>
            <p className="text-gray-400 text-xs font-medium max-w-xs leading-relaxed">
              {content.tagline}
              <br />
              {content.adresseLigne1}
              <br />
              {content.adresseLigne2}
            </p>
            <p className="text-gray-500 text-[10px]">
              {content.rcsInfo}
              <br />
              {content.capitalInfo}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-abp-gold">Navigation</h4>
            <ul className="space-y-2 text-xs font-bold">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Cuisines', href: '/cuisines' },
                { name: 'Salles de Bains', href: '/autres-amenagements/salles-de-bains' },
                { name: 'Dressings', href: '/autres-amenagements/dressings' },
                { name: 'Fournisseurs', href: '/fournisseurs' },
                { name: 'Réalisations', href: '/realisations' },
                { name: 'Contact', href: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-abp-gold transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-abp-gold">Social</h4>
            {activeSocialLinks.length > 0 ? (
              <div className="flex space-x-4">
                {activeSocialLinks.map(({ key, url, Icon }) => (
                  <a 
                    key={key} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-abp-gold transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">Aucun réseau social configuré</p>
            )}
          </div>

          {/* Legal */}
          <div>
             <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-abp-gold">Légal</h4>
             <ul className="space-y-2 text-xs font-bold">
                <li>
                  <a href={content.mentionsLegalesHref} className="hover:text-abp-gold transition-colors">
                    Mentions Légales
                  </a>
                </li>
                <li>
                  <a href={content.politiqueConfidentialiteHref} className="hover:text-abp-gold transition-colors">
                    Politique de confidentialité
                  </a>
                </li>
                <li className="text-gray-500 font-normal text-[10px] mt-2">
                  Directeur de la publication :<br/>{content.directeurPublication}
                </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} {content.copyrightText}</p>
          <p>{content.designedBy}</p>
        </div>
      </div>
    </footer>
  );
}
