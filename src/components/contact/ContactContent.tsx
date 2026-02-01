"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from "lucide-react";

interface PageContactContent {
  headerAccroche: string;
  headerTitle: string;
  headerDescription: string;
  coordonneesTitle: string;
  adresseLigne1: string;
  adresseLigne2: string;
  telephone: string;
  email: string;
  horairesLigne1: string;
  horairesLigne2: string;
  mapEmbedUrl: string;
  formTitle: string;
  typesProjet: string[];
  successTitle: string;
  successMessage: string;
  successButtonText: string;
  formDisclaimer: string;
}

const defaultContent: PageContactContent = {
  headerAccroche: "Parlons-en",
  headerTitle: "Envie de discuter ?",
  headerDescription: "Appelez-moi, envoyez-moi un message ou remplissez le formulaire. Je vous rappelle rapidement pour échanger sur votre projet, sans engagement.",
  coordonneesTitle: "Mes Coordonnées",
  adresseLigne1: "13, rue de la ferme",
  adresseLigne2: "60530 Le Mesnil en Thelle",
  telephone: "+33 6 12 34 56 78",
  email: "contact@abp-partner.fr",
  horairesLigne1: "Lun - Ven : 9h00 - 18h00",
  horairesLigne2: "Sam : Sur rendez-vous",
  mapEmbedUrl: "",
  formTitle: "Envoyez-moi un message",
  typesProjet: ["Cuisine sur mesure", "Salle de bains", "Dressing", "Autre aménagement"],
  successTitle: "Message Envoyé !",
  successMessage: "Merci pour votre message. Je vous recontacterai dans les plus brefs délais.",
  successButtonText: "Envoyer un autre message",
  formDisclaimer: "En soumettant ce formulaire, vous acceptez notre politique de confidentialité."
};

export default function ContactContent() {
  const [content, setContent] = useState<PageContactContent>(defaultContent);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageContact) {
          setContent(prev => ({ ...prev, ...data.pageContact }));
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          projectType: "",
          message: "",
        });
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  // Formater le numéro de téléphone pour le lien tel:
  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/\s+/g, '').replace(/^\+/, '');
  };

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
            {content.headerAccroche}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-abp-primary mb-4">
            {content.headerTitle}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content.headerDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-abp-primary rounded-sm p-8 text-white mb-8">
              <h2 className="text-2xl font-bold mb-6">{content.coordonneesTitle}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-abp-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Adresse</h3>
                    <p className="text-gray-300 text-sm">
                      {content.adresseLigne1}<br />
                      {content.adresseLigne2}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Phone className="text-abp-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Téléphone</h3>
                    <a href={`tel:+${formatPhoneForLink(content.telephone)}`} className="text-gray-300 text-sm hover:text-abp-gold transition-colors">
                      {content.telephone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Mail className="text-abp-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <a href={`mailto:${content.email}`} className="text-gray-300 text-sm hover:text-abp-gold transition-colors">
                      {content.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Clock className="text-abp-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Horaires</h3>
                    <p className="text-gray-300 text-sm">
                      {content.horairesLigne1}<br />
                      {content.horairesLigne2}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {content.mapEmbedUrl && (
              <div className="aspect-video bg-gray-200 rounded-sm overflow-hidden">
                <iframe
                  src={content.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-sm p-12 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-abp-primary mb-4">
                  {content.successTitle}
                </h2>
                <p className="text-gray-600 mb-6">
                  {content.successMessage}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-abp-gold hover:text-abp-primary transition-colors font-medium"
                >
                  {content.successButtonText}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-abp-white rounded-sm p-8">
                <h2 className="text-2xl font-bold text-abp-primary mb-6">
                  {content.formTitle}
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-abp-primary mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-abp-gold transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-abp-primary mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-abp-gold transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-abp-primary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-abp-gold transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-abp-primary mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-abp-gold transition-colors"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="projectType" className="block text-sm font-bold text-abp-primary mb-2">
                    Type de projet
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-abp-gold transition-colors bg-white"
                  >
                    <option value="">Sélectionnez un type de projet</option>
                    {content.typesProjet.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-bold text-abp-primary mb-2">
                    Votre message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-abp-gold transition-colors resize-none"
                    placeholder="Décrivez votre projet..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-abp-gold text-white font-bold text-sm uppercase tracking-wider hover:bg-abp-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer le message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  {content.formDisclaimer}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
