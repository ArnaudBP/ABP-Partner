"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSiteContent } from './SiteContentProvider';

interface NavbarData {
  logo?: string;
  title?: string;
  subtitle?: string;
}

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Cuisines", href: "/cuisines" },
  { name: "Salles de Bains", href: "/autres-amenagements/salles-de-bains" },
  { name: "Dressings", href: "/autres-amenagements/dressings" },
  { name: "Réalisations", href: "/realisations" },
  { name: "Fournisseurs", href: "/fournisseurs" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const siteContent = useSiteContent();
  const [navbarData, setNavbarData] = useState<NavbarData | null>(
    (siteContent?.navbar as NavbarData) || null
  );
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (siteContent?.navbar) {
      setNavbarData(siteContent.navbar as NavbarData);
      return;
    }
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.navbar) {
          setNavbarData(content.navbar);
        }
      })
      .catch(console.error);
  }, [siteContent]);

  const logo = navbarData?.logo;
  const title = navbarData?.title || "La cuisine d'Arnaud";
  const subtitle = navbarData?.subtitle || "ABP Partner";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled || pathname !== "/" ? "bg-abp-primary py-3 shadow-md" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-end gap-3 group">
            {/* Logo */}
            {logo && (
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                <Image
                  src={logo}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {/* Textes */}
            <div className="flex flex-col items-start">
              {/* Titre principal */}
              <span className="text-white text-xl md:text-2xl font-bold tracking-tight">
                {title}
              </span>
              {/* Sous-titre */}
              <span className="text-xs md:text-sm font-medium tracking-wider text-white/70">
                {subtitle.includes('Partner') ? (
                  <>{subtitle.replace('Partner', '')} <span className="text-abp-gold">Partner</span></>
                ) : (
                  subtitle
                )}
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  isActive(link.href) ? "text-abp-gold" : "text-white/90 hover:text-abp-gold"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col pt-20 px-6 overflow-y-auto"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-black"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-bold uppercase tracking-widest block py-2 ${
                    isActive(link.href) ? "text-abp-gold" : "text-black"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
