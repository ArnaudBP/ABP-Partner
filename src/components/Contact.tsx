"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-abp-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-abp-gold font-bold tracking-widest uppercase text-xs mb-2 block">
              Contact
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-abp-primary mb-6">
              Parlons de votre <br/>
              <span className="italic text-abp-gold">Projet</span>
            </h2>
            
            <p className="text-gray-600 text-sm md:text-base font-medium mb-8 max-w-md">
              Prêt à transformer votre vision en réalité ? Notre équipe est à votre écoute pour discuter de vos ambitions.
            </p>

            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="mr-4 mt-1">
                  <MapPin className="text-abp-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-abp-primary text-xs font-bold uppercase tracking-widest mb-1">Adresse</h4>
                  <p className="text-gray-600 text-sm">
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris, France
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="mr-4 mt-1">
                  <Phone className="text-abp-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-abp-primary text-xs font-bold uppercase tracking-widest mb-1">Téléphone</h4>
                  <p className="text-gray-600 text-sm">+33 1 23 45 67 89</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="mr-4 mt-1">
                  <Mail className="text-abp-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-abp-primary text-xs font-bold uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-gray-600 text-sm">contact@abp-partner.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 shadow-sm border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    className="block w-full bg-transparent border-b border-gray-200 py-2 text-abp-primary placeholder-gray-400 focus:outline-none focus:border-abp-gold transition-colors duration-300 text-sm"
                    placeholder="Prénom"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    className="block w-full bg-transparent border-b border-gray-200 py-2 text-abp-primary placeholder-gray-400 focus:outline-none focus:border-abp-gold transition-colors duration-300 text-sm"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="block w-full bg-transparent border-b border-gray-200 py-2 text-abp-primary placeholder-gray-400 focus:outline-none focus:border-abp-gold transition-colors duration-300 text-sm"
                  placeholder="Email"
                />
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  rows={4}
                  className="block w-full bg-transparent border-b border-gray-200 py-2 text-abp-primary placeholder-gray-400 focus:outline-none focus:border-abp-gold transition-colors duration-300 text-sm resize-none"
                  placeholder="Votre message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-abp-primary text-white py-3 px-6 text-xs font-bold uppercase tracking-widest hover:bg-abp-gold transition-colors duration-300"
              >
                Envoyer le message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}