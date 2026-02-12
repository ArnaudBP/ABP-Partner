"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Image, 
  Truck, 
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Save,
  ChevronLeft,
  Home,
  UtensilsCrossed,
  Bath,
  Shirt,
  Check,
  Palette,
  Eye,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ExternalLink
} from "lucide-react";
import { Realisation, Fournisseur, ContactSubmission } from "@/types";
import { COLOR_PALETTES } from "@/lib/colorPalettes";
import FileUpload from "./FileUpload";
import MultiImageUpload from "./MultiImageUpload";
import ContentEditor from "./ContentEditor";
import FileCleanup from "./FileCleanup";
import { SaveBarProvider, useSaveBar } from "./SaveBarProvider";
import { Phone, Mail } from "lucide-react";

type Tab = 'dashboard' | 'accueil' | 'cuisines' | 'salles-de-bains' | 'dressings' | 'contact' | 'footer' | 'realisations' | 'fournisseurs' | 'messages' | 'settings';

const tabs = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accueil' as Tab, label: 'Page d\'accueil', icon: Home },
  { id: 'cuisines' as Tab, label: 'Page Cuisines', icon: UtensilsCrossed },
  { id: 'salles-de-bains' as Tab, label: 'Page Salles de Bains', icon: Bath },
  { id: 'dressings' as Tab, label: 'Page Dressings', icon: Shirt },
  { id: 'contact' as Tab, label: 'Page Contact', icon: Mail },
  { id: 'footer' as Tab, label: 'Footer', icon: Settings },
  { id: 'realisations' as Tab, label: 'Réalisations', icon: Image },
  { id: 'fournisseurs' as Tab, label: 'Partenaires', icon: Truck },
  { id: 'messages' as Tab, label: 'Messages', icon: MessageSquare },
  { id: 'settings' as Tab, label: 'Paramètres', icon: Settings },
];

export default function AdminDashboard() {
  return (
    <SaveBarProvider>
      <AdminDashboardInner />
    </SaveBarProvider>
  );
}

function AdminDashboardInner() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [realsRes, fournsRes, msgsRes] = await Promise.all([
        fetch('/api/realisations'),
        fetch('/api/fournisseurs'),
        fetch('/api/contact'),
      ]);
      
      setRealisations(await realsRes.json());
      setFournisseurs(await fournsRes.json());
      if (msgsRes.ok) {
        setMessages(await msgsRes.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Check authentication
    fetch("/api/auth/check")
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          router.push("/admin");
        } else {
          fetchData();
        }
      })
      .catch(() => router.push("/admin"));
  }, [router, fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const unreadMessages = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-abp-gold/30 border-t-abp-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-abp-primary text-white transition-all duration-300 flex flex-col fixed h-full z-40`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <span className="font-bold text-lg">ABP Admin</span>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-sm"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-abp-gold text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              {sidebarOpen && (
                <span className="text-sm font-medium">{tab.label}</span>
              )}
              {tab.id === 'messages' && unreadMessages > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-sm transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-abp-primary capitalize">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              realisations={realisations}
              fournisseurs={fournisseurs}
              messages={messages}
            />
          )}
          {activeTab === 'accueil' && (
            <ContentEditor />
          )}
          {activeTab === 'cuisines' && (
            <PageEditorCuisines />
          )}
          {activeTab === 'salles-de-bains' && (
            <PageEditorSallesDeBains />
          )}
          {activeTab === 'dressings' && (
            <PageEditorDressings />
          )}
          {activeTab === 'contact' && (
            <PageEditorContact />
          )}
          {activeTab === 'footer' && (
            <PageEditorFooter />
          )}
          {activeTab === 'realisations' && (
            <RealisationsTab 
              realisations={realisations} 
              onUpdate={fetchData}
            />
          )}
          {activeTab === 'fournisseurs' && (
            <FournisseursTab 
              fournisseurs={fournisseurs}
              onUpdate={fetchData}
            />
          )}
          {activeTab === 'messages' && (
            <MessagesTab 
              messages={messages}
              onUpdate={fetchData}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </main>
    </div>
  );
}

// Dashboard Tab
function DashboardTab({ realisations, fournisseurs, messages }: {
  realisations: Realisation[];
  fournisseurs: Fournisseur[];
  messages: ContactSubmission[];
}) {
  const cataloguesCount = fournisseurs.filter(f => f.cataloguePdf).length;
  const stats = [
    { label: 'Réalisations', value: realisations.length, color: 'bg-blue-500' },
    { label: 'Partenaires', value: fournisseurs.length, color: 'bg-green-500' },
    { label: 'Catalogues', value: cataloguesCount, color: 'bg-purple-500' },
    { label: 'Messages non lus', value: messages.filter(m => !m.read).length, color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-sm p-6 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-sm flex items-center justify-center mb-4`}>
              <span className="text-white font-bold text-xl">{stat.value}</span>
            </div>
            <h3 className="text-gray-600 text-sm">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm p-6 shadow-sm">
          <h3 className="font-bold text-abp-primary mb-4">Dernières réalisations</h3>
          <div className="space-y-3">
            {realisations.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm">
                <div className="w-12 h-12 bg-gray-200 rounded-sm overflow-hidden">
                  <img src={r.images[0]} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm p-6 shadow-sm">
          <h3 className="font-bold text-abp-primary mb-4">Derniers messages</h3>
          <div className="space-y-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m.id} className={`p-3 rounded-sm ${m.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{m.firstName} {m.lastName}</p>
                  {!m.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Editor pour Cuisines - COMPLET avec Preview
function PageEditorCuisines() {
  const saveBar = useSaveBar();
  const [activeSection, setActiveSection] = useState<'hero' | 'expertise' | 'styles' | 'process' | 'cta'>('hero');
  const [content, setContent] = useState({
    // Hero
    hero: {
      accroche: "Ma spécialité",
      titre: "Des cuisines",
      sousTitre: "qui vous ressemblent",
      description: "15 ans que je conçois des cuisines, et chacune est unique. Parce que votre façon de cuisiner, de vivre, de recevoir... c'est ce qui fait toute la différence.",
      image: "/cuisine1.png"
    },
    // Expertise section
    expertise: {
      accroche: "Ce que je vous apporte",
      titre: "Un artisan, pas une enseigne",
      description: "Avec moi, vous avez un seul interlocuteur du début à la fin. Je connais votre projet par cœur et je suis disponible quand vous avez besoin.",
      items: [
        { icon: "Ruler", title: "Conception Sur Mesure", description: "Chaque cuisine est unique. J'adapte mes créations à votre espace, vos habitudes et votre style de vie." },
        { icon: "Eye", title: "Visualisation 3D", description: "Visualisez votre future cuisine en 3D photoréaliste avant le début des travaux. Modifiez jusqu'à satisfaction totale." },
        { icon: "Shield", title: "Garantie Décennale", description: "Tous mes travaux sont couverts par une garantie décennale. Votre tranquillité est ma priorité." },
        { icon: "Sparkles", title: "Finitions Premium", description: "Des matériaux nobles et des finitions impeccables pour une cuisine qui traversera les années." },
        { icon: "Clock", title: "Délais Respectés", description: "Planning précis et respect des délais annoncés. Nous nous engageons sur un calendrier clair." },
        { icon: "Users", title: "Accompagnement", description: "Un interlocuteur unique du début à la fin de votre projet. Disponibilité et réactivité garanties." }
      ],
      avantagesTitre: "Les avantages ABP Partner",
      avantages: [
        "Consultation gratuite à domicile",
        "Devis détaillé sans engagement",
        "Partenaires fabricants premium",
        "Installation par artisans qualifiés",
        "Service après-vente réactif",
        "Prix justes et transparents"
      ],
      anneesExperience: 15
    },
    // Styles section
    styles: {
      accroche: "Inspirations",
      titre: "Quel style vous attire ?",
      description: "Moderne, classique, design... On trouve ensemble ce qui correspond à vos goûts et à votre intérieur.",
      items: [
        { name: "Contemporain", description: "Lignes épurées, matériaux nobles et fonctionnalité optimale. Le choix de l'élégance moderne.", image: "/cuisine1.png", features: ["Façades sans poignées", "Plan de travail quartz", "Éclairage LED intégré"] },
        { name: "Classique", description: "L'élégance intemporelle revisitée. Des finitions raffinées pour une cuisine chaleureuse.", image: "/cuisine2.png", features: ["Moulures et cadres", "Poignées laiton", "Finitions mates"] },
        { name: "Design", description: "Pour les amateurs d'audace. Des matériaux innovants et des lignes architecturales.", image: "/cuisine3.png", features: ["Îlot central", "Matériaux high-tech", "Couleurs affirmées"] }
      ],
      ctaTexte: "Voir mes réalisations cuisines"
    },
    // Process section
    process: {
      accroche: "Comment ça se passe",
      titre: "Votre projet, étape par étape",
      description: "Pas de surprise, pas de stress. Je vous explique tout et on avance ensemble à votre rythme.",
      etapes: [
        { number: "01", title: "Premier Contact", description: "Échange téléphonique ou par email pour comprendre vos besoins et planifier une visite à domicile gratuite.", duration: "Jour 1" },
        { number: "02", title: "Visite & Mesures", description: "Je me déplace chez vous pour prendre les mesures précises et analyser votre espace et vos contraintes.", duration: "Semaine 1" },
        { number: "03", title: "Conception 3D", description: "Création de votre projet en 3D photoréaliste avec plusieurs propositions d'aménagement et de styles.", duration: "Semaine 2" },
        { number: "04", title: "Devis Détaillé", description: "Présentation du devis complet et transparent, incluant tous les équipements et la pose.", duration: "Semaine 2" },
        { number: "05", title: "Validation & Commande", description: "Ajustements selon vos retours, validation finale du projet et passage de commande chez mes fournisseurs partenaires.", duration: "Semaine 3" },
        { number: "06", title: "Installation", description: "Pose professionnelle avec soin et précision. Nettoyage du chantier et remise des clés de votre nouvelle cuisine.", duration: "Semaine 8-10" }
      ]
    },
    // CTA section
    cta: {
      accroche: "Prêt à Commencer ?",
      titre: "Votre cuisine de rêve",
      sousTitre: "commence ici",
      description: "Prenez rendez-vous pour une consultation gratuite à domicile. Sans engagement, nous analysons votre projet et vous proposons des solutions sur mesure.",
      boutonTexte: "Prendre Rendez-vous",
      telephone: "+33 1 23 45 67 89"
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageCuisines) {
          setContent(prev => ({ ...prev, ...data.pageCuisines }));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    saveBar.showSaving();
    try {
      const res = await fetch('/api/content');
      const allContent = await res.json();
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allContent, pageCuisines: content }),
      });
      setSaved(true);
      saveBar.showSaved('Page Cuisines enregistrée !', { url: '/cuisines', label: 'Voir la page Cuisines' });
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      saveBar.showError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'hero' as const, label: '1. Bannière', color: 'bg-blue-500' },
    { id: 'expertise' as const, label: '2. Expertise', color: 'bg-green-500' },
    { id: 'styles' as const, label: '3. Styles', color: 'bg-purple-500' },
    { id: 'process' as const, label: '4. Processus', color: 'bg-orange-500' },
    { id: 'cta' as const, label: '5. Contact', color: 'bg-red-500' },
  ];

  const updateExpertiseItem = (index: number, field: string, value: string) => {
    const newItems = [...content.expertise.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, expertise: { ...content.expertise, items: newItems } });
  };

  const updateAvantage = (index: number, value: string) => {
    const newAvantages = [...content.expertise.avantages];
    newAvantages[index] = value;
    setContent({ ...content, expertise: { ...content.expertise, avantages: newAvantages } });
  };

  const updateStyleItem = (index: number, field: string, value: string | string[]) => {
    const newItems = [...content.styles.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, styles: { ...content.styles, items: newItems } });
  };

  const updateStyleFeature = (styleIndex: number, featureIndex: number, value: string) => {
    const newItems = [...content.styles.items];
    const newFeatures = [...newItems[styleIndex].features];
    newFeatures[featureIndex] = value;
    newItems[styleIndex] = { ...newItems[styleIndex], features: newFeatures };
    setContent({ ...content, styles: { ...content.styles, items: newItems } });
  };

  const updateEtape = (index: number, field: string, value: string) => {
    const newEtapes = [...content.process.etapes];
    newEtapes[index] = { ...newEtapes[index], [field]: value };
    setContent({ ...content, process: { ...content.process, etapes: newEtapes } });
  };

  // Mini Page Schema Component
  const PageSchema = () => (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">📄 Structure de la page Cuisines</span>
        <a 
          href="/cuisines" 
          target="_blank" 
          className="text-sm text-abp-gold hover:underline flex items-center gap-1"
        >
          Voir la page →
        </a>
      </div>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-all ${
              activeSection === section.id 
                ? 'bg-white shadow ring-2 ring-abp-gold' 
                : 'hover:bg-white/50'
            }`}
          >
            <span className={`w-3 h-3 rounded ${section.color}`}></span>
            <span className={activeSection === section.id ? 'font-medium' : ''}>{section.label}</span>
            {activeSection === section.id && <span className="ml-auto text-abp-gold">✎ En cours d'édition</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with save button */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-abp-primary">Page Cuisines</h2>
            <p className="text-sm text-gray-500 mt-1">Modifiez le contenu de votre page cuisines</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/cuisines"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Eye size={18} />
              Aperçu
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                saved ? 'bg-green-500' : 'bg-abp-gold hover:bg-abp-primary'
              } text-white transition-colors`}
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Schema de la page - sidebar gauche */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
            <PageSchema />
            
            {/* Mini Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white text-xs px-3 py-1.5">Aperçu de la section</div>
              <div className="p-3 bg-gray-50 min-h-[200px]">
                {activeSection === 'hero' && (
                  <div className="relative rounded overflow-hidden h-32 bg-gray-300">
                    {content.hero.image && (
                      <img src={content.hero.image} alt="" className="w-full h-full object-cover opacity-50" />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-center p-3">
                      <span className="text-[8px] text-yellow-600">{content.hero.accroche}</span>
                      <span className="text-xs font-bold">{content.hero.titre}</span>
                      <span className="text-[10px] italic text-gray-600">{content.hero.sousTitre}</span>
                    </div>
                  </div>
                )}
                {activeSection === 'expertise' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-[8px] text-yellow-600 block">{content.expertise.accroche}</span>
                      <span className="text-xs font-bold block">{content.expertise.titre}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {content.expertise.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="bg-white p-1 rounded text-center">
                          <div className="w-4 h-4 bg-yellow-100 rounded mx-auto mb-1"></div>
                          <span className="text-[6px] block truncate">{item.title}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-800 rounded p-2 flex items-center justify-between">
                      <span className="text-[7px] text-white">{content.expertise.avantagesTitre}</span>
                      <span className="text-sm font-bold text-yellow-500">{content.expertise.anneesExperience}+</span>
                    </div>
                  </div>
                )}
                {activeSection === 'styles' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-xs font-bold">{content.styles.titre}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {content.styles.items.map((style, i) => (
                        <div key={i} className="rounded overflow-hidden">
                          <div className="h-12 bg-gray-300">
                            {style.image && <img src={style.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <span className="text-[7px] block text-center bg-white py-0.5">{style.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeSection === 'process' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-xs font-bold">{content.process.titre}</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      {content.process.etapes.map((etape, i) => (
                        <div key={i} className="text-center">
                          <div className="w-4 h-4 rounded-full bg-yellow-500 text-[6px] text-white flex items-center justify-center mx-auto">
                            {etape.number}
                          </div>
                          <span className="text-[5px] block mt-0.5 truncate w-8">{etape.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeSection === 'cta' && (
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <span className="text-[7px] text-yellow-500 block">{content.cta.accroche}</span>
                    <span className="text-xs font-bold text-white block">{content.cta.titre}</span>
                    <span className="text-[8px] italic text-gray-400 block">{content.cta.sousTitre}</span>
                    <div className="flex gap-1 justify-center mt-2">
                      <span className="text-[6px] bg-yellow-500 text-white px-2 py-0.5 rounded">{content.cta.boutonTexte}</span>
                      <span className="text-[6px] border border-white text-white px-2 py-0.5 rounded">{content.cta.telephone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor - main content */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${sections.find(s => s.id === activeSection)?.color} bg-opacity-10`}>
              <span className={`w-4 h-4 rounded ${sections.find(s => s.id === activeSection)?.color}`}></span>
              <div>
                <h3 className="font-bold text-abp-primary">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeSection === 'hero' && "La grande image en haut de page avec le titre principal"}
                  {activeSection === 'expertise' && "Les 6 points forts + l'encadré avec vos avantages"}
                  {activeSection === 'styles' && "Les 3 styles de cuisines avec photos"}
                  {activeSection === 'process' && "Les 6 étapes de votre accompagnement client"}
                  {activeSection === 'cta' && "Le bloc final qui invite à vous contacter"}
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* HERO SECTION */}
              {activeSection === 'hero' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accroche
                          <span className="font-normal text-gray-400 ml-2">— Petit texte doré au-dessus du titre</span>
                        </label>
                        <input
                          type="text"
                          value={content.hero.accroche}
                          onChange={(e) => setContent({ ...content, hero: { ...content.hero, accroche: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
                          placeholder="Ex: Ma spécialité"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre principal
                          <span className="font-normal text-gray-400 ml-2">— En gros et en blanc</span>
                        </label>
                        <input
                          type="text"
                          value={content.hero.titre}
                          onChange={(e) => setContent({ ...content, hero: { ...content.hero, titre: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-lg font-bold"
                          placeholder="Ex: Des cuisines"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sous-titre
                          <span className="font-normal text-gray-400 ml-2">— En italique, sous le titre</span>
                        </label>
                        <input
                          type="text"
                          value={content.hero.sousTitre}
                          onChange={(e) => setContent({ ...content, hero: { ...content.hero, sousTitre: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold italic"
                          placeholder="Ex: qui vous ressemblent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texte d'accroche
                          <span className="font-normal text-gray-400 ml-2">— Paragraphe sous les titres</span>
                        </label>
                        <textarea
                          value={content.hero.description}
                          onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                          rows={3}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
                          placeholder="Décrivez votre approche en quelques phrases..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image de fond
                        <span className="font-normal text-gray-400 ml-2">— Grande photo derrière le texte</span>
                      </label>
                      <FileUpload
                        onUpload={(url) => setContent({ ...content, hero: { ...content.hero, image: url } })}
                        folder="content"
                        accept="image/*"
                        label="Cliquez pour changer l'image"
                        currentFile={content.hero.image}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERTISE SECTION */}
              {activeSection === 'expertise' && (
                <div className="space-y-8">
                  {/* Header de section */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-3">📝 Texte d'introduction de la section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Accroche (en doré)</label>
                        <input
                          type="text"
                          value={content.expertise.accroche}
                          onChange={(e) => setContent({ ...content, expertise: { ...content.expertise, accroche: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre de section</label>
                        <input
                          type="text"
                          value={content.expertise.titre}
                          onChange={(e) => setContent({ ...content, expertise: { ...content.expertise, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={content.expertise.description}
                          onChange={(e) => setContent({ ...content, expertise: { ...content.expertise, description: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6 expertises */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">🏆 Vos 6 points forts (cartes blanches)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {content.expertise.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <span className="w-6 h-6 rounded bg-abp-gold/20 flex items-center justify-center text-xs">{index + 1}</span>
                            Point fort n°{index + 1}
                          </div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateExpertiseItem(index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold font-medium"
                            placeholder="Titre du point fort"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => updateExpertiseItem(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold"
                            placeholder="Description courte..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-5 text-white">
                      <h4 className="font-medium mb-3">📋 Encadré "Avantages" (fond sombre)</h4>
                      <div className="mb-4">
                        <label className="block text-xs text-gray-400 mb-1">Titre de l'encadré</label>
                        <input
                          type="text"
                          value={content.expertise.avantagesTitre}
                          onChange={(e) => setContent({ ...content, expertise: { ...content.expertise, avantagesTitre: e.target.value } })}
                          className="w-full px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:border-abp-gold text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        {content.expertise.avantages.map((avantage, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-abp-gold">✓</span>
                            <input
                              type="text"
                              value={avantage}
                              onChange={(e) => updateAvantage(index, e.target.value)}
                              className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:border-abp-gold text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <label className="block text-sm text-gray-500 mb-2">Nombre d'années d'expérience</label>
                        <div className="flex items-center gap-2 justify-center">
                          <input
                            type="number"
                            value={content.expertise.anneesExperience}
                            onChange={(e) => setContent({ ...content, expertise: { ...content.expertise, anneesExperience: parseInt(e.target.value) || 0 } })}
                            className="w-24 px-4 py-3 border-2 border-abp-gold rounded-lg focus:outline-none text-3xl font-bold text-center"
                          />
                          <span className="text-3xl font-bold text-abp-gold">+</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Affiché en grand à droite de l'encadré</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STYLES SECTION */}
              {activeSection === 'styles' && (
                <div className="space-y-8">
                  {/* Header de section */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-3">📝 Introduction de la section styles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Accroche</label>
                        <input
                          type="text"
                          value={content.styles.accroche}
                          onChange={(e) => setContent({ ...content, styles: { ...content.styles, accroche: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre</label>
                        <input
                          type="text"
                          value={content.styles.titre}
                          onChange={(e) => setContent({ ...content, styles: { ...content.styles, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={content.styles.description}
                          onChange={(e) => setContent({ ...content, styles: { ...content.styles, description: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 Styles */}
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-700">🎨 Les 3 styles de cuisines</h4>
                    {content.styles.items.map((style, index) => (
                      <div key={index} className="border-2 border-purple-200 rounded-lg overflow-hidden">
                        <div className="bg-purple-100 px-4 py-2 font-medium text-purple-800">
                          Style {index + 1}: {style.name || '(sans nom)'}
                        </div>
                        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nom du style</label>
                              <input
                                type="text"
                                value={style.name}
                                onChange={(e) => updateStyleItem(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Description</label>
                              <textarea
                                value={style.description}
                                onChange={(e) => updateStyleItem(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">3 caractéristiques (puces sur la photo)</label>
                            <div className="space-y-2">
                              {style.features.map((feature, fIndex) => (
                                <div key={fIndex} className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-abp-gold"></span>
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateStyleFeature(index, fIndex, e.target.value)}
                                    className="flex-1 px-3 py-1.5 border rounded focus:outline-none focus:border-abp-gold text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Photo du style</label>
                            <FileUpload
                              onUpload={(url) => updateStyleItem(index, 'image', url)}
                              folder="content"
                              accept="image/*"
                              label="Changer l'image"
                              currentFile={style.image}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Texte du bouton (vers réalisations)</label>
                    <input
                      type="text"
                      value={content.styles.ctaTexte}
                      onChange={(e) => setContent({ ...content, styles: { ...content.styles, ctaTexte: e.target.value } })}
                      className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
                    />
                  </div>
                </div>
              )}

              {/* PROCESS SECTION */}
              {activeSection === 'process' && (
                <div className="space-y-8">
                  {/* Header de section */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-3">📝 Introduction du processus</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Accroche</label>
                        <input
                          type="text"
                          value={content.process.accroche}
                          onChange={(e) => setContent({ ...content, process: { ...content.process, accroche: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre</label>
                        <input
                          type="text"
                          value={content.process.titre}
                          onChange={(e) => setContent({ ...content, process: { ...content.process, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={content.process.description}
                          onChange={(e) => setContent({ ...content, process: { ...content.process, description: e.target.value } })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6 Étapes */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">🔢 Les 6 étapes de votre accompagnement</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {content.process.etapes.map((etape, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="bg-abp-gold text-white px-3 py-2 flex items-center justify-between">
                            <span className="font-bold">Étape {etape.number}</span>
                            <input
                              type="text"
                              value={etape.duration}
                              onChange={(e) => updateEtape(index, 'duration', e.target.value)}
                              className="w-24 px-2 py-0.5 text-xs bg-white/20 rounded text-right"
                              placeholder="Durée"
                            />
                          </div>
                          <div className="p-3 space-y-2">
                            <input
                              type="text"
                              value={etape.title}
                              onChange={(e) => updateEtape(index, 'title', e.target.value)}
                              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:border-abp-gold font-medium"
                              placeholder="Titre de l'étape"
                            />
                            <textarea
                              value={etape.description}
                              onChange={(e) => updateEtape(index, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:border-abp-gold"
                              placeholder="Description..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA SECTION */}
              {activeSection === 'cta' && (
                <div className="space-y-6">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">💡 Cette section apparaît tout en bas de la page</h4>
                    <p className="text-sm text-red-600">C'est le dernier élément que voit le visiteur — invitez-le à vous contacter !</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 text-white">
                    <div className="max-w-xl mx-auto space-y-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Accroche (en doré)</label>
                        <input
                          type="text"
                          value={content.cta.accroche}
                          onChange={(e) => setContent({ ...content, cta: { ...content.cta, accroche: e.target.value } })}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-abp-gold text-abp-gold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Titre principal</label>
                        <input
                          type="text"
                          value={content.cta.titre}
                          onChange={(e) => setContent({ ...content, cta: { ...content.cta, titre: e.target.value } })}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-abp-gold text-white text-xl font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Sous-titre (italique)</label>
                        <input
                          type="text"
                          value={content.cta.sousTitre}
                          onChange={(e) => setContent({ ...content, cta: { ...content.cta, sousTitre: e.target.value } })}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-abp-gold text-gray-300 italic text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Texte d'invitation</label>
                        <textarea
                          value={content.cta.description}
                          onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
                          rows={2}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-abp-gold text-gray-300 text-center text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Bouton principal</label>
                          <input
                            type="text"
                            value={content.cta.boutonTexte}
                            onChange={(e) => setContent({ ...content, cta: { ...content.cta, boutonTexte: e.target.value } })}
                            className="w-full px-4 py-2 bg-abp-gold text-white rounded-lg focus:outline-none text-center text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Numéro de téléphone</label>
                          <input
                            type="text"
                            value={content.cta.telephone}
                            onChange={(e) => setContent({ ...content, cta: { ...content.cta, telephone: e.target.value } })}
                            className="w-full px-4 py-2 bg-white/10 border border-white rounded-lg focus:outline-none focus:border-abp-gold text-white text-center text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Editor pour Salles de Bains - COMPLET avec Preview
function PageEditorSallesDeBains() {
  const saveBar = useSaveBar();
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'services'>('hero');
  const [content, setContent] = useState({
    hero: {
      accroche: "Votre espace bien-être",
      titre: "Salles de Bains",
      sousTitre: "conçues pour vous",
      description: "Une salle de bains, c'est plus qu'une pièce fonctionnelle. C'est votre moment de détente le matin et le soir. Je la conçois pour qu'elle vous ressemble et vous apaise.",
      image: "/sdb1.png",
      boutonDevis: "Demander un devis",
      boutonRealisations: "Voir mes réalisations"
    },
    features: {
      titre: "Ce que je maîtrise",
      description: "La salle de bains demande un savoir-faire particulier. Voici ce que je vous apporte.",
      items: [
        { icon: "Bath", title: "Douches à l'italienne", description: "Design épuré et accès facilité. Receveurs extra-plats et parois sur mesure." },
        { icon: "Droplets", title: "Robinetterie Premium", description: "Marques reconnues et finitions haut de gamme. Chrome, noir mat, or brossé..." },
        { icon: "Sparkles", title: "Finitions Soignées", description: "Joints étanches, faïence posée avec précision, mobilier parfaitement ajusté." },
        { icon: "Shield", title: "Garantie Qualité", description: "Travaux garantis et assurance décennale. Votre sérénité est ma priorité." }
      ]
    },
    services: {
      titre: "Mes Services",
      description: "Une prise en charge complète de votre projet, de la conception à la réalisation. Je coordonne tous les corps de métier pour un résultat impeccable.",
      items: [
        "Conception 3D de votre salle de bains",
        "Meubles vasques sur mesure",
        "Douches et baignoires",
        "Carrelage et faïence",
        "Plomberie et raccordements",
        "Éclairage et ventilation",
        "Chauffage (sèche-serviettes)",
        "Rangements optimisés"
      ],
      image: "/sdb1.png"
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageSallesDeBains) {
          setContent(prev => ({ ...prev, ...data.pageSallesDeBains }));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    saveBar.showSaving();
    try {
      const res = await fetch('/api/content');
      const allContent = await res.json();
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allContent, pageSallesDeBains: content }),
      });
      setSaved(true);
      saveBar.showSaved('Page Salles de Bains enregistrée !', { url: '/autres-amenagements/salles-de-bains', label: 'Voir la page' });
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      saveBar.showError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'hero' as const, label: '1. Bannière', color: 'bg-blue-500' },
    { id: 'features' as const, label: '2. Points Forts', color: 'bg-cyan-500' },
    { id: 'services' as const, label: '3. Services', color: 'bg-teal-500' },
  ];

  const updateFeatureItem = (index: number, field: string, value: string) => {
    const newItems = [...content.features.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, features: { ...content.features, items: newItems } });
  };

  const updateServiceItem = (index: number, value: string) => {
    const newItems = [...content.services.items];
    newItems[index] = value;
    setContent({ ...content, services: { ...content.services, items: newItems } });
  };

  // Mini Page Schema
  const PageSchema = () => (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">📄 Structure de la page Salles de Bains</span>
        <a href="/autres-amenagements/salles-de-bains" target="_blank" className="text-sm text-abp-gold hover:underline flex items-center gap-1">
          Voir la page →
        </a>
      </div>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-all ${
              activeSection === section.id ? 'bg-white shadow ring-2 ring-abp-gold' : 'hover:bg-white/50'
            }`}
          >
            <span className={`w-3 h-3 rounded ${section.color}`}></span>
            <span className={activeSection === section.id ? 'font-medium' : ''}>{section.label}</span>
            {activeSection === section.id && <span className="ml-auto text-abp-gold">✎ En cours d'édition</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-abp-primary">Page Salles de Bains</h2>
            <p className="text-sm text-gray-500 mt-1">Modifiez le contenu de votre page salles de bains</p>
          </div>
          <div className="flex gap-3">
            <a href="/autres-amenagements/salles-de-bains" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Eye size={18} />
              Aperçu
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg ${saved ? 'bg-green-500' : 'bg-abp-gold hover:bg-abp-primary'} text-white transition-colors`}
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Schema sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
            <PageSchema />
            
            {/* Mini Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white text-xs px-3 py-1.5">Aperçu de la section</div>
              <div className="p-3 bg-gray-50 min-h-[200px]">
                {activeSection === 'hero' && (
                  <div className="space-y-2">
                    <div className="relative rounded overflow-hidden h-24 bg-gray-300">
                      {content.hero.image && <img src={content.hero.image} alt="" className="w-full h-full object-cover opacity-50" />}
                      <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
                        <span className="text-[8px] text-yellow-600">{content.hero.accroche}</span>
                        <span className="text-xs font-bold">{content.hero.titre}</span>
                        <span className="text-[8px] italic text-gray-600">{content.hero.sousTitre}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 justify-center">
                      <span className="text-[6px] bg-abp-gold text-white px-2 py-0.5 rounded">{content.hero.boutonDevis}</span>
                      <span className="text-[6px] border border-gray-400 px-2 py-0.5 rounded">{content.hero.boutonRealisations}</span>
                    </div>
                  </div>
                )}
                {activeSection === 'features' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-xs font-bold block">{content.features.titre}</span>
                      <span className="text-[7px] text-gray-500">{content.features.description.substring(0, 50)}...</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {content.features.items.map((item, i) => (
                        <div key={i} className="bg-white p-1.5 rounded shadow-sm">
                          <div className="w-4 h-4 bg-cyan-100 rounded mx-auto mb-1 flex items-center justify-center text-[8px]">🛁</div>
                          <span className="text-[6px] block text-center font-medium truncate">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeSection === 'services' && (
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] font-bold block">{content.services.titre}</span>
                      <div className="space-y-0.5">
                        {content.services.items.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-[6px] text-abp-gold">✓</span>
                            <span className="text-[6px] truncate">{item}</span>
                          </div>
                        ))}
                        <span className="text-[6px] text-gray-400">+ {content.services.items.length - 4} autres...</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gray-300 rounded">
                      {content.services.image && <img src={content.services.image} alt="" className="w-full h-full object-cover rounded" />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${sections.find(s => s.id === activeSection)?.color} bg-opacity-10`}>
              <span className={`w-4 h-4 rounded ${sections.find(s => s.id === activeSection)?.color}`}></span>
              <div>
                <h3 className="font-bold text-abp-primary">{sections.find(s => s.id === activeSection)?.label}</h3>
                <p className="text-sm text-gray-500">
                  {activeSection === 'hero' && "La grande image en haut de page avec le titre et les boutons"}
                  {activeSection === 'features' && "Les 4 cartes qui présentent vos points forts"}
                  {activeSection === 'services' && "La liste de vos services avec image"}
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* HERO */}
              {activeSection === 'hero' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accroche <span className="font-normal text-gray-400">— Petit texte doré au-dessus du titre</span>
                        </label>
                        <input type="text" value={content.hero.accroche} onChange={(e) => setContent({ ...content, hero: { ...content.hero, accroche: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre principal <span className="font-normal text-gray-400">— En gros et en blanc</span>
                        </label>
                        <input type="text" value={content.hero.titre} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titre: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-lg font-bold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sous-titre <span className="font-normal text-gray-400">— En italique sous le titre</span>
                        </label>
                        <input type="text" value={content.hero.sousTitre} onChange={(e) => setContent({ ...content, hero: { ...content.hero, sousTitre: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold italic" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texte d'accroche <span className="font-normal text-gray-400">— Paragraphe sous les titres</span>
                        </label>
                        <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                          rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold" />
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-3">🔘 Texte des boutons</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bouton principal (doré)</label>
                            <input type="text" value={content.hero.boutonDevis} onChange={(e) => setContent({ ...content, hero: { ...content.hero, boutonDevis: e.target.value } })}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm bg-abp-gold/10" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bouton secondaire (contour)</label>
                            <input type="text" value={content.hero.boutonRealisations} onChange={(e) => setContent({ ...content, hero: { ...content.hero, boutonRealisations: e.target.value } })}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image de fond <span className="font-normal text-gray-400">— Grande photo derrière le texte</span>
                      </label>
                      <FileUpload onUpload={(url) => setContent({ ...content, hero: { ...content.hero, image: url } })}
                        folder="content" accept="image/*" label="Cliquez pour changer l'image" currentFile={content.hero.image} />
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURES */}
              {activeSection === 'features' && (
                <div className="space-y-6">
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <h4 className="font-medium text-cyan-800 mb-3">📝 Introduction de la section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre de section</label>
                        <input type="text" value={content.features.titre} onChange={(e) => setContent({ ...content, features: { ...content.features, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input type="text" value={content.features.description} onChange={(e) => setContent({ ...content, features: { ...content.features, description: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">🛁 Vos 4 points forts (cartes)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.features.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <span className="w-6 h-6 rounded bg-cyan-100 flex items-center justify-center text-xs">{index + 1}</span>
                            Point fort n°{index + 1}
                          </div>
                          <input type="text" value={item.title} onChange={(e) => updateFeatureItem(index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold font-medium" placeholder="Titre" />
                          <textarea value={item.description} onChange={(e) => updateFeatureItem(index, 'description', e.target.value)}
                            rows={2} className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold" placeholder="Description" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {activeSection === 'services' && (
                <div className="space-y-6">
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-medium text-teal-800 mb-3">📝 Introduction de la section</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre de section</label>
                        <input type="text" value={content.services.titre} onChange={(e) => setContent({ ...content, services: { ...content.services, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <textarea value={content.services.description} onChange={(e) => setContent({ ...content, services: { ...content.services, description: e.target.value } })}
                          rows={2} className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">✅ Liste des services (8 éléments avec ✓)</h4>
                      <div className="space-y-2">
                        {content.services.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-abp-gold font-bold">✓</span>
                            <input type="text" value={item} onChange={(e) => updateServiceItem(index, e.target.value)}
                              className="flex-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold" placeholder={`Service ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">📷 Image d'illustration</h4>
                      <FileUpload onUpload={(url) => setContent({ ...content, services: { ...content.services, image: url } })}
                        folder="content" accept="image/*" label="Cliquez pour changer l'image" currentFile={content.services.image} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Editor pour Dressings - COMPLET avec Preview
function PageEditorDressings() {
  const saveBar = useSaveBar();
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'configurations'>('hero');
  const [content, setContent] = useState({
    hero: {
      accroche: "Rangement intelligent",
      titre: "Dressings",
      sousTitre: "pensés pour vous",
      description: "Un bon dressing, c'est celui où chaque vêtement a sa place et où vous trouvez tout en un clin d'œil. Je le conçois sur mesure, adapté à vos habitudes.",
      image: "/dressing1.png",
      boutonDevis: "Demander un devis",
      boutonRealisations: "Voir mes réalisations"
    },
    features: {
      titre: "Les Avantages du Sur Mesure",
      description: "Un dressing parfaitement adapté à votre espace et vos habitudes.",
      items: [
        { icon: "Maximize", title: "Optimisation Espace", description: "Chaque centimètre est exploité intelligemment pour maximiser votre capacité de rangement." },
        { icon: "Layers", title: "Modulabilité", description: "Systèmes évolutifs qui s'adaptent à vos besoins. Ajoutez ou modifiez des éléments facilement." },
        { icon: "Lightbulb", title: "Éclairage Intégré", description: "LED automatiques à l'ouverture des portes. Visibilité parfaite sur toute votre garde-robe." },
        { icon: "Shirt", title: "Accessoires", description: "Tiroirs à bijoux, porte-cravates, supports à chaussures... Tout pour une organisation parfaite." }
      ]
    },
    configurations: {
      titre: "Configurations Possibles",
      description: "Quelle que soit la forme de votre espace, nous avons une solution.",
      items: [
        { title: "Dressing d'angle", description: "Solution idéale pour exploiter les coins perdus et créer un espace de rangement généreux." },
        { title: "Dressing linéaire", description: "Configuration classique le long d'un mur. Parfait pour les chambres ou couloirs." },
        { title: "Dressing en U", description: "Pour les pièces dédiées. Maximum de rangement et circulation centrale." },
        { title: "Dressing sous pente", description: "Exploitation optimale des combles et espaces atypiques." }
      ]
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageDressings) {
          setContent(prev => ({ ...prev, ...data.pageDressings }));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    saveBar.showSaving();
    try {
      const res = await fetch('/api/content');
      const allContent = await res.json();
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allContent, pageDressings: content }),
      });
      setSaved(true);
      saveBar.showSaved('Page Dressings enregistrée !', { url: '/autres-amenagements/dressings', label: 'Voir la page' });
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      saveBar.showError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'hero' as const, label: '1. Bannière', color: 'bg-purple-500' },
    { id: 'features' as const, label: '2. Avantages', color: 'bg-indigo-500' },
    { id: 'configurations' as const, label: '3. Configurations', color: 'bg-violet-500' },
  ];

  const updateFeatureItem = (index: number, field: string, value: string) => {
    const newItems = [...content.features.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, features: { ...content.features, items: newItems } });
  };

  const updateConfigurationItem = (index: number, field: string, value: string) => {
    const newItems = [...content.configurations.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, configurations: { ...content.configurations, items: newItems } });
  };

  // Mini Page Schema
  const PageSchema = () => (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">📄 Structure de la page Dressings</span>
        <a href="/autres-amenagements/dressings" target="_blank" className="text-sm text-abp-gold hover:underline flex items-center gap-1">
          Voir la page →
        </a>
      </div>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-all ${
              activeSection === section.id ? 'bg-white shadow ring-2 ring-abp-gold' : 'hover:bg-white/50'
            }`}
          >
            <span className={`w-3 h-3 rounded ${section.color}`}></span>
            <span className={activeSection === section.id ? 'font-medium' : ''}>{section.label}</span>
            {activeSection === section.id && <span className="ml-auto text-abp-gold">✎ En cours d'édition</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-abp-primary">Page Dressings</h2>
            <p className="text-sm text-gray-500 mt-1">Modifiez le contenu de votre page dressings</p>
          </div>
          <div className="flex gap-3">
            <a href="/autres-amenagements/dressings" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Eye size={18} />
              Aperçu
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg ${saved ? 'bg-green-500' : 'bg-abp-gold hover:bg-abp-primary'} text-white transition-colors`}
            >
              {saved ? <Check size={18} /> : <Save size={18} />}
              {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Schema sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
            <PageSchema />
            
            {/* Mini Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white text-xs px-3 py-1.5">Aperçu de la section</div>
              <div className="p-3 bg-gray-50 min-h-[200px]">
                {activeSection === 'hero' && (
                  <div className="space-y-2">
                    <div className="relative rounded overflow-hidden h-24 bg-gray-300">
                      {content.hero.image && <img src={content.hero.image} alt="" className="w-full h-full object-cover opacity-50" />}
                      <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
                        <span className="text-[8px] text-yellow-600">{content.hero.accroche}</span>
                        <span className="text-xs font-bold">{content.hero.titre}</span>
                        <span className="text-[8px] italic text-gray-600">{content.hero.sousTitre}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 justify-center">
                      <span className="text-[6px] bg-abp-gold text-white px-2 py-0.5 rounded">{content.hero.boutonDevis}</span>
                      <span className="text-[6px] border border-gray-400 px-2 py-0.5 rounded">{content.hero.boutonRealisations}</span>
                    </div>
                  </div>
                )}
                {activeSection === 'features' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-xs font-bold block">{content.features.titre}</span>
                      <span className="text-[7px] text-gray-500">{content.features.description.substring(0, 50)}...</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {content.features.items.map((item, i) => (
                        <div key={i} className="bg-white p-1.5 rounded shadow-sm">
                          <div className="w-4 h-4 bg-purple-100 rounded mx-auto mb-1 flex items-center justify-center text-[8px]">👔</div>
                          <span className="text-[6px] block text-center font-medium truncate">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeSection === 'configurations' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <span className="text-xs font-bold block">{content.configurations.titre}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {content.configurations.items.map((item, i) => (
                        <div key={i} className="bg-white p-1.5 rounded shadow-sm border-l-2 border-abp-gold">
                          <span className="text-[7px] font-medium block">{item.title}</span>
                          <span className="text-[5px] text-gray-500 line-clamp-2">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${sections.find(s => s.id === activeSection)?.color} bg-opacity-10`}>
              <span className={`w-4 h-4 rounded ${sections.find(s => s.id === activeSection)?.color}`}></span>
              <div>
                <h3 className="font-bold text-abp-primary">{sections.find(s => s.id === activeSection)?.label}</h3>
                <p className="text-sm text-gray-500">
                  {activeSection === 'hero' && "La grande image en haut de page avec le titre et les boutons"}
                  {activeSection === 'features' && "Les 4 avantages clés du sur-mesure"}
                  {activeSection === 'configurations' && "Les 4 types de dressings possibles"}
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* HERO */}
              {activeSection === 'hero' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accroche <span className="font-normal text-gray-400">— Petit texte doré au-dessus du titre</span>
                        </label>
                        <input type="text" value={content.hero.accroche} onChange={(e) => setContent({ ...content, hero: { ...content.hero, accroche: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre principal <span className="font-normal text-gray-400">— En gros et en blanc</span>
                        </label>
                        <input type="text" value={content.hero.titre} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titre: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold text-lg font-bold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sous-titre <span className="font-normal text-gray-400">— En italique sous le titre</span>
                        </label>
                        <input type="text" value={content.hero.sousTitre} onChange={(e) => setContent({ ...content, hero: { ...content.hero, sousTitre: e.target.value } })}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold italic" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texte d'accroche <span className="font-normal text-gray-400">— Paragraphe sous les titres</span>
                        </label>
                        <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                          rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold" />
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-purple-800 mb-3">🔘 Texte des boutons</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bouton principal (doré)</label>
                            <input type="text" value={content.hero.boutonDevis} onChange={(e) => setContent({ ...content, hero: { ...content.hero, boutonDevis: e.target.value } })}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm bg-abp-gold/10" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bouton secondaire (contour)</label>
                            <input type="text" value={content.hero.boutonRealisations} onChange={(e) => setContent({ ...content, hero: { ...content.hero, boutonRealisations: e.target.value } })}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image de fond <span className="font-normal text-gray-400">— Grande photo derrière le texte</span>
                      </label>
                      <FileUpload onUpload={(url) => setContent({ ...content, hero: { ...content.hero, image: url } })}
                        folder="content" accept="image/*" label="Cliquez pour changer l'image" currentFile={content.hero.image} />
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURES */}
              {activeSection === 'features' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-medium text-indigo-800 mb-3">📝 Introduction de la section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre de section</label>
                        <input type="text" value={content.features.titre} onChange={(e) => setContent({ ...content, features: { ...content.features, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input type="text" value={content.features.description} onChange={(e) => setContent({ ...content, features: { ...content.features, description: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">👔 Vos 4 avantages du sur-mesure</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.features.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <span className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-xs">{index + 1}</span>
                            Avantage n°{index + 1}
                          </div>
                          <input type="text" value={item.title} onChange={(e) => updateFeatureItem(index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold font-medium" placeholder="Titre" />
                          <textarea value={item.description} onChange={(e) => updateFeatureItem(index, 'description', e.target.value)}
                            rows={2} className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold" placeholder="Description" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONFIGURATIONS */}
              {activeSection === 'configurations' && (
                <div className="space-y-6">
                  <div className="bg-violet-50 rounded-lg p-4">
                    <h4 className="font-medium text-violet-800 mb-3">📝 Introduction de la section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Titre de section</label>
                        <input type="text" value={content.configurations.titre} onChange={(e) => setContent({ ...content, configurations: { ...content.configurations, titre: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input type="text" value={content.configurations.description} onChange={(e) => setContent({ ...content, configurations: { ...content.configurations, description: e.target.value } })}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">📐 Les 4 types de configurations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.configurations.items.map((item, index) => (
                        <div key={index} className="border-l-4 border-abp-gold bg-gray-50 rounded-r-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <span className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center text-xs">{index + 1}</span>
                            Configuration n°{index + 1}
                          </div>
                          <input type="text" value={item.title} onChange={(e) => updateConfigurationItem(index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold font-medium bg-white" placeholder="Nom du dressing" />
                          <textarea value={item.description} onChange={(e) => updateConfigurationItem(index, 'description', e.target.value)}
                            rows={2} className="w-full px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-abp-gold bg-white" placeholder="Description" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Contact Editor
function PageEditorContact() {
  const saveBar = useSaveBar();
  const [activeSection, setActiveSection] = useState<'header' | 'coordonnees' | 'formulaire' | 'succes'>('header');
  const [content, setContent] = useState({
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
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.pageContact) {
          setContent(prev => ({ ...prev, ...data.pageContact }));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    saveBar.showSaving();
    try {
      const res = await fetch('/api/content');
      const allContent = await res.json();
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allContent, pageContact: content }),
      });
      setSaved(true);
      saveBar.showSaved('Page Contact enregistrée !', { url: '/contact', label: 'Voir la page Contact' });
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      saveBar.showError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'header' as const, label: '1. En-tête', color: 'bg-blue-500' },
    { id: 'coordonnees' as const, label: '2. Coordonnées', color: 'bg-green-500' },
    { id: 'formulaire' as const, label: '3. Formulaire', color: 'bg-purple-500' },
    { id: 'succes' as const, label: '4. Confirmation', color: 'bg-emerald-500' },
  ];

  const updateTypeProjet = (index: number, value: string) => {
    const newTypes = [...content.typesProjet];
    newTypes[index] = value;
    setContent({ ...content, typesProjet: newTypes });
  };

  const addTypeProjet = () => {
    setContent({ ...content, typesProjet: [...content.typesProjet, "Nouveau type"] });
  };

  const removeTypeProjet = (index: number) => {
    const newTypes = content.typesProjet.filter((_, i) => i !== index);
    setContent({ ...content, typesProjet: newTypes });
  };

  // Mini Page Schema
  const PageSchema = () => (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">📄 Structure de la page Contact</span>
        <a href="/contact" target="_blank" className="text-sm text-abp-gold hover:underline flex items-center gap-1">
          <Eye size={14} />
          Voir la page →
        </a>
      </div>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-all ${
              activeSection === section.id ? 'bg-white shadow ring-2 ring-abp-gold' : 'hover:bg-white/50'
            }`}
          >
            <span className={`w-3 h-3 rounded ${section.color}`}></span>
            <span className={activeSection === section.id ? 'font-medium' : ''}>{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-abp-primary">Page Contact</h2>
          <p className="text-gray-500 text-sm">Éditez les informations de contact et le formulaire</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded font-medium transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-abp-gold text-white hover:bg-abp-primary'
          }`}
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Enregistrer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PageSchema />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-4 h-4 rounded ${sections.find(s => s.id === activeSection)?.color}`}></span>
              <h3 className="text-lg font-bold text-abp-primary">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
            </div>

            {activeSection === 'header' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  ✨ L'en-tête de la page contact avec le titre et la description d'introduction.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accroche (petite ligne)</label>
                  <input type="text" value={content.headerAccroche} onChange={(e) => setContent({ ...content, headerAccroche: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre principal</label>
                  <input type="text" value={content.headerTitle} onChange={(e) => setContent({ ...content, headerTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold text-xl font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={content.headerDescription} onChange={(e) => setContent({ ...content, headerDescription: e.target.value })}
                    rows={3} className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                </div>
              </div>
            )}

            {activeSection === 'coordonnees' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  📍 Les informations de contact affichées dans l'encart sombre à gauche du formulaire.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la section</label>
                  <input type="text" value={content.coordonneesTitle} onChange={(e) => setContent({ ...content, coordonneesTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold font-bold" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📍 Adresse ligne 1</label>
                    <input type="text" value={content.adresseLigne1} onChange={(e) => setContent({ ...content, adresseLigne1: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="13, rue de la ferme" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📍 Adresse ligne 2</label>
                    <input type="text" value={content.adresseLigne2} onChange={(e) => setContent({ ...content, adresseLigne2: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="60530 Le Mesnil en Thelle" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📞 Téléphone</label>
                    <input type="text" value={content.telephone} onChange={(e) => setContent({ ...content, telephone: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="+33 6 12 34 56 78" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">✉️ Email</label>
                    <input type="email" value={content.email} onChange={(e) => setContent({ ...content, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="contact@abp-partner.fr" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🕐 Horaires ligne 1</label>
                    <input type="text" value={content.horairesLigne1} onChange={(e) => setContent({ ...content, horairesLigne1: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="Lun - Ven : 9h00 - 18h00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🕐 Horaires ligne 2</label>
                    <input type="text" value={content.horairesLigne2} onChange={(e) => setContent({ ...content, horairesLigne2: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="Sam : Sur rendez-vous" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">🗺️ URL Google Maps Embed</label>
                  <input type="text" value={content.mapEmbedUrl} onChange={(e) => setContent({ ...content, mapEmbedUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" 
                    placeholder="https://www.google.com/maps/embed?pb=..." />
                  <p className="text-xs text-gray-500 mt-1">Copiez le lien d'intégration depuis Google Maps (iframe src)</p>
                </div>
              </div>
            )}

            {activeSection === 'formulaire' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  📝 Configuration du formulaire de contact et des types de projets disponibles.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre du formulaire</label>
                  <input type="text" value={content.formTitle} onChange={(e) => setContent({ ...content, formTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold font-bold" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Types de projet (menu déroulant)</label>
                  <div className="space-y-2">
                    {content.typesProjet.map((type, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">{index + 1}</span>
                        <input type="text" value={type} onChange={(e) => updateTypeProjet(index, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                        <button onClick={() => removeTypeProjet(index)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button onClick={addTypeProjet} className="flex items-center gap-2 text-sm text-abp-gold hover:text-abp-primary">
                      <Plus size={16} />
                      Ajouter un type de projet
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texte de disclaimer (bas du formulaire)</label>
                  <input type="text" value={content.formDisclaimer} onChange={(e) => setContent({ ...content, formDisclaimer: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                </div>
              </div>
            )}

            {activeSection === 'succes' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  ✅ Message affiché après l'envoi réussi du formulaire.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de confirmation</label>
                  <input type="text" value={content.successTitle} onChange={(e) => setContent({ ...content, successTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message de confirmation</label>
                  <textarea value={content.successMessage} onChange={(e) => setContent({ ...content, successMessage: e.target.value })}
                    rows={2} className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton "Nouveau message"</label>
                  <input type="text" value={content.successButtonText} onChange={(e) => setContent({ ...content, successButtonText: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Footer Editor
function PageEditorFooter() {
  const saveBar = useSaveBar();
  const [activeSection, setActiveSection] = useState<'marque' | 'social' | 'legal'>('marque');
  const [content, setContent] = useState({
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
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.footer) {
          setContent(prev => ({ ...prev, ...data.footer }));
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    saveBar.showSaving();
    try {
      const res = await fetch('/api/content');
      const allContent = await res.json();
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allContent, footer: content }),
      });
      setSaved(true);
      saveBar.showSaved('Footer enregistré !', { url: '/#footer', label: 'Voir le footer' });
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      saveBar.showError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'marque' as const, label: '1. Marque & Adresse', color: 'bg-blue-500' },
    { id: 'social' as const, label: '2. Réseaux Sociaux', color: 'bg-pink-500' },
    { id: 'legal' as const, label: '3. Mentions Légales', color: 'bg-gray-500' },
  ];

  // Mini Page Schema
  const PageSchema = () => (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">📄 Structure du Footer</span>
        <span className="text-xs text-gray-500">Visible sur toutes les pages</span>
      </div>
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm transition-all ${
              activeSection === section.id ? 'bg-white shadow ring-2 ring-abp-gold' : 'hover:bg-white/50'
            }`}
          >
            <span className={`w-3 h-3 rounded ${section.color}`}></span>
            <span className={activeSection === section.id ? 'font-medium' : ''}>{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-abp-primary">Footer du site</h2>
          <p className="text-gray-500 text-sm">Le pied de page visible sur toutes les pages du site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded font-medium transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-abp-gold text-white hover:bg-abp-primary'
          }`}
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Enregistrer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PageSchema />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-4 h-4 rounded ${sections.find(s => s.id === activeSection)?.color}`}></span>
              <h3 className="text-lg font-bold text-abp-primary">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
            </div>

            {activeSection === 'marque' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  🏢 Informations de l'entreprise affichées dans la colonne de gauche du footer.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la marque</label>
                    <input type="text" value={content.brandName} onChange={(e) => setContent({ ...content, brandName: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slogan / Tagline</label>
                    <input type="text" value={content.tagline} onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📍 Adresse ligne 1</label>
                    <input type="text" value={content.adresseLigne1} onChange={(e) => setContent({ ...content, adresseLigne1: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📍 Adresse ligne 2</label>
                    <input type="text" value={content.adresseLigne2} onChange={(e) => setContent({ ...content, adresseLigne2: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RCS</label>
                    <input type="text" value={content.rcsInfo} onChange={(e) => setContent({ ...content, rcsInfo: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capital</label>
                    <input type="text" value={content.capitalInfo} onChange={(e) => setContent({ ...content, capitalInfo: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold text-sm" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'social' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  📱 Liens vers vos réseaux sociaux. Laissez vide pour masquer une icône.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🏠 Houzz</label>
                    <input type="url" value={content.socialLinks.houzz} onChange={(e) => setContent({ ...content, socialLinks: { ...content.socialLinks, houzz: e.target.value } })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="https://www.houzz.fr/pro/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📷 Instagram</label>
                    <input type="url" value={content.socialLinks.instagram} onChange={(e) => setContent({ ...content, socialLinks: { ...content.socialLinks, instagram: e.target.value } })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="https://www.instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📘 Facebook</label>
                    <input type="url" value={content.socialLinks.facebook} onChange={(e) => setContent({ ...content, socialLinks: { ...content.socialLinks, facebook: e.target.value } })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="https://www.facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">💼 LinkedIn</label>
                    <input type="url" value={content.socialLinks.linkedin} onChange={(e) => setContent({ ...content, socialLinks: { ...content.socialLinks, linkedin: e.target.value } })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="https://www.linkedin.com/..." />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'legal' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  ⚖️ Informations légales et liens obligatoires.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lien Mentions Légales</label>
                    <input type="text" value={content.mentionsLegalesHref} onChange={(e) => setContent({ ...content, mentionsLegalesHref: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="/mentions-legales" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lien Politique de confidentialité</label>
                    <input type="text" value={content.politiqueConfidentialiteHref} onChange={(e) => setContent({ ...content, politiqueConfidentialiteHref: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="/politique-confidentialite" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Directeur de la publication</label>
                  <input type="text" value={content.directeurPublication} onChange={(e) => setContent({ ...content, directeurPublication: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texte copyright</label>
                    <input type="text" value={content.copyrightText} onChange={(e) => setContent({ ...content, copyrightText: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="ABP Partner. All rights reserved." />
                    <p className="text-xs text-gray-500 mt-1">L'année sera ajoutée automatiquement</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crédit design</label>
                    <input type="text" value={content.designedBy} onChange={(e) => setContent({ ...content, designedBy: e.target.value })}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:border-abp-gold" placeholder="Designed by ABP" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Realisations Tab
function RealisationsTab({ realisations, onUpdate }: { realisations: Realisation[]; onUpdate: () => void }) {
  const [editing, setEditing] = useState<Realisation | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [orderedRealisations, setOrderedRealisations] = useState<Realisation[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Trier par order si défini, sinon par date de création
  useEffect(() => {
    const sorted = [...realisations].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setOrderedRealisations(sorted);
  }, [realisations]);

  const emptyRealisation: Realisation = {
    id: '',
    slug: '',
    title: '',
    subtitle: '',
    category: 'cuisine',
    style: '',
    description: '',
    details: [],
    images: [],
    featured: false,
    createdAt: new Date().toISOString().split('T')[0],
    lien3D: '',
    order: realisations.length,
  };

  const handleSave = async () => {
    if (!editing) return;
    
    const data = {
      ...editing,
      id: editing.id || editing.title.toLowerCase().replace(/\s+/g, '-'),
      slug: editing.slug || editing.title.toLowerCase().replace(/\s+/g, '-'),
    };

    await fetch('/api/realisations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setEditing(null);
    setIsNew(false);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette réalisation ?')) return;
    
    await fetch('/api/realisations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    onUpdate();
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedRealisations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setOrderedRealisations(newOrder);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      // Mettre à jour l'ordre de chaque réalisation
      for (let i = 0; i < orderedRealisations.length; i++) {
        const real = orderedRealisations[i];
        await fetch('/api/realisations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...real, order: i }),
        });
      }
      setIsReordering(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSavingOrder(false);
    }
  };

  if (editing) {
    return (
      <RealisationForm 
        realisation={editing}
        onChange={setEditing}
        onSave={handleSave}
        onCancel={() => { setEditing(null); setIsNew(false); }}
        isNew={isNew}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{realisations.length} réalisation(s)</p>
        <div className="flex gap-3">
          {isReordering ? (
            <>
              <button
                onClick={() => {
                  setIsReordering(false);
                  setOrderedRealisations([...realisations].sort((a, b) => {
                    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveOrder}
                disabled={savingOrder}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={18} />
                {savingOrder ? 'Enregistrement...' : 'Valider l\'ordre'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsReordering(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GripVertical size={18} />
                Réorganiser
              </button>
              <button
                onClick={() => { setEditing(emptyRealisation); setIsNew(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-abp-gold text-white rounded-lg hover:bg-abp-primary transition-colors"
              >
                <Plus size={18} />
                Nouvelle réalisation
              </button>
            </>
          )}
        </div>
      </div>

      {isReordering && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Mode réorganisation :</strong> Utilisez les flèches pour changer l'ordre d'affichage des réalisations sur le site.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {isReordering && (
                <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase w-20">Ordre</th>
              )}
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Image</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Titre</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Catégorie</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">3D</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Vedette</th>
              {!isReordering && (
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {orderedRealisations.map((r, index) => (
              <tr key={r.id} className={`border-t border-gray-100 ${isReordering ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}>
                {isReordering && (
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-abp-gold hover:text-white'}`}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === orderedRealisations.length - 1}
                        className={`p-1 rounded ${index === orderedRealisations.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-abp-gold hover:text-white'}`}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                    <img src={r.images[0]} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.subtitle}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.category}</span>
                </td>
                <td className="px-4 py-3">
                  {r.lien3D ? (
                    <a href={r.lien3D} target="_blank" rel="noopener noreferrer" className="text-abp-gold hover:text-abp-primary">
                      <Eye size={18} />
                    </a>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.featured && <span className="text-abp-gold">★</span>}
                </td>
                {!isReordering && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditing(r)}
                        className="p-2 text-gray-500 hover:text-abp-gold"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Realisation Form
function RealisationForm({ realisation, onChange, onSave, onCancel, isNew }: {
  realisation: Realisation;
  onChange: (r: Realisation) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const [detailsText, setDetailsText] = useState(realisation.details.join('\n'));

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-abp-primary">
          {isNew ? 'Nouvelle réalisation' : 'Modifier la réalisation'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Titre</label>
          <input
            type="text"
            value={realisation.title}
            onChange={(e) => onChange({ ...realisation, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sous-titre</label>
          <input
            type="text"
            value={realisation.subtitle}
            onChange={(e) => onChange({ ...realisation, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:border-abp-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
          <select
            value={realisation.category}
            onChange={(e) => onChange({ ...realisation, category: e.target.value as Realisation['category'] })}
            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:border-abp-gold"
          >
            <option value="cuisine">Cuisine</option>
            <option value="salle-de-bains">Salle de Bains</option>
            <option value="dressing">Dressing</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Style</label>
          <input
            type="text"
            value={realisation.style}
            onChange={(e) => onChange({ ...realisation, style: e.target.value })}
            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:border-abp-gold"
            placeholder="contemporain, classique, design..."
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
        <textarea
          value={realisation.description}
          onChange={(e) => onChange({ ...realisation, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
        />
      </div>

      {/* Lien 3D */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          <span className="flex items-center gap-2">
            <Eye size={16} className="text-abp-gold" />
            Lien vers les visuels 3D
          </span>
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={realisation.lien3D || ''}
            onChange={(e) => onChange({ ...realisation, lien3D: e.target.value })}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
            placeholder="https://exemple.com/visuels-3d-projet"
          />
          {realisation.lien3D && (
            <a
              href={realisation.lien3D}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
            >
              <ExternalLink size={16} />
              Tester
            </a>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Lien externe vers une galerie 3D, un drive ou un site de présentation du projet
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">Détails (un par ligne)</label>
        <textarea
          value={detailsText}
          onChange={(e) => {
            setDetailsText(e.target.value);
            onChange({ ...realisation, details: e.target.value.split('\n').filter(d => d.trim()) });
          }}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold font-mono text-sm"
          placeholder="Caractéristique 1&#10;Caractéristique 2&#10;..."
        />
      </div>

      <div className="mb-6">
        <MultiImageUpload
          images={realisation.images}
          onChange={(images) => {
            onChange({ ...realisation, images });
          }}
          folder="realisations"
          label="Images de la réalisation"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={realisation.featured}
            onChange={(e) => onChange({ ...realisation, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Mettre en vedette sur la page d&apos;accueil</span>
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2 bg-abp-gold text-white rounded-lg hover:bg-abp-primary transition-colors"
        >
          <Save size={18} />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// Fournisseurs Tab
function FournisseursTab({ fournisseurs, onUpdate }: { fournisseurs: Fournisseur[]; onUpdate: () => void }) {
  const [editing, setEditing] = useState<Fournisseur | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [orderedFournisseurs, setOrderedFournisseurs] = useState<Fournisseur[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Trier par order si défini
  useEffect(() => {
    const sorted = [...fournisseurs].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
    setOrderedFournisseurs(sorted);
  }, [fournisseurs]);

  const emptyFournisseur: Fournisseur = {
    id: '',
    name: '',
    description: '',
    logo: '',
    website: '',
    featured: false,
    cataloguePdf: '',
    catalogueYear: new Date().getFullYear(),
    order: fournisseurs.length,
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedFournisseurs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setOrderedFournisseurs(newOrder);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      for (let i = 0; i < orderedFournisseurs.length; i++) {
        const f = orderedFournisseurs[i];
        await fetch('/api/fournisseurs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...f, order: i }),
        });
      }
      setIsReordering(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    
    const data = {
      ...editing,
      id: editing.id || editing.name.toLowerCase().replace(/\s+/g, '-'),
    };

    await fetch('/api/fournisseurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setEditing(null);
    setIsNew(false);
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?') ) return;
    
    await fetch('/api/fournisseurs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    onUpdate();
  };

  if (editing) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-abp-primary">
            {isNew ? 'Nouveau partenaire' : 'Modifier le partenaire'}
          </h2>
          <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Site web</label>
            <input
              type="url"
              value={editing.website}
              onChange={(e) => setEditing({ ...editing, website: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
              placeholder="https://"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
          />
        </div>

        <div className="mb-6">
          <FileUpload
            onUpload={(url) => setEditing({ ...editing, logo: url })}
            folder="fournisseurs"
            accept="image/*"
            label="Logo du partenaire"
            currentFile={editing.logo}
          />
        </div>

        {/* Section Catalogue */}
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-bold text-abp-primary mb-4">📄 Catalogue (optionnel)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Année du catalogue</label>
              <input
                type="number"
                value={editing.catalogueYear || new Date().getFullYear()}
                onChange={(e) => setEditing({ ...editing, catalogueYear: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
              />
            </div>
            <div>
              <FileUpload
                onUpload={(url) => setEditing({ ...editing, cataloguePdf: url })}
                folder="catalogues/pdf"
                accept="application/pdf"
                label="Fichier PDF du catalogue"
                currentFile={editing.cataloguePdf}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editing.featured}
              onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Afficher sur la page d&apos;accueil</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => { setEditing(null); setIsNew(false); }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-abp-gold text-white rounded-lg hover:bg-abp-primary"
          >
            <Save size={18} />
            Enregistrer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{fournisseurs.length} partenaire(s)</p>
        <div className="flex gap-3">
          {isReordering ? (
            <>
              <button
                onClick={() => {
                  setIsReordering(false);
                  setOrderedFournisseurs([...fournisseurs].sort((a, b) => {
                    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
                    return 0;
                  }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveOrder}
                disabled={savingOrder}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={18} />
                {savingOrder ? 'Enregistrement...' : 'Valider l\'ordre'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsReordering(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <GripVertical size={18} />
                Réorganiser
              </button>
              <button
                onClick={() => { setEditing(emptyFournisseur); setIsNew(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-abp-gold text-white rounded-lg hover:bg-abp-primary transition-colors"
              >
                <Plus size={18} />
                Nouveau partenaire
              </button>
            </>
          )}
        </div>
      </div>

      {isReordering && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Mode réorganisation :</strong> Utilisez les flèches pour changer l'ordre d'affichage des partenaires sur le site.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orderedFournisseurs.map((f, index) => (
          <div key={f.id} className={`bg-white rounded-lg p-6 shadow-sm ${isReordering ? 'ring-2 ring-amber-200' : ''}`}>
            {isReordering && (
              <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className={`p-2 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-abp-gold hover:text-white'}`}
                >
                  <ChevronUp size={20} />
                </button>
                <span className="text-lg font-bold text-gray-400 w-8 text-center">{index + 1}</span>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === orderedFournisseurs.length - 1}
                  className={`p-2 rounded ${index === orderedFournisseurs.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-abp-gold hover:text-white'}`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              {f.logo ? (
                <img src={f.logo} alt={f.name} className="h-8 object-contain" />
              ) : (
                <span className="font-bold text-lg text-abp-primary">{f.name}</span>
              )}
              {!isReordering && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(f)} className="p-2 text-gray-500 hover:text-abp-gold">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{f.description}</p>
            <div className="flex flex-wrap gap-2">
              {f.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">★ En vedette</span>}
              {f.cataloguePdf && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  📄 Catalogue {f.catalogueYear}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Messages Tab
function MessagesTab({ messages, onUpdate }: { messages: ContactSubmission[]; onUpdate: () => void }) {
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const handleMarkAsRead = async (id: string) => {
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'markAsRead' }),
    });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    
    await fetch('/api/contact', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (selected?.id === id) setSelected(null);
    onUpdate();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-abp-primary">Messages ({messages.length})</h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">Aucun message</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelected(m);
                  if (!m.read) handleMarkAsRead(m.id);
                }}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selected?.id === m.id ? 'bg-blue-50' : ''
                } ${!m.read ? 'border-l-4 border-l-abp-gold' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{m.firstName} {m.lastName}</span>
                  {!m.read && <span className="w-2 h-2 bg-abp-gold rounded-full" />}
                </div>
                <p className="text-xs text-gray-500 mb-1">{m.email}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{m.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-sm shadow-sm">
        {selected ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-abp-primary">{selected.firstName} {selected.lastName}</h3>
                <p className="text-sm text-gray-500">{selected.email}</p>
                {selected.phone && <p className="text-sm text-gray-500">{selected.phone}</p>}
              </div>
              <button 
                onClick={() => handleDelete(selected.id)}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {selected.projectType && (
              <div className="mb-4">
                <span className="text-xs text-gray-500 uppercase">Type de projet</span>
                <p className="font-medium">{selected.projectType}</p>
              </div>
            )}

            <div className="mb-4">
              <span className="text-xs text-gray-500 uppercase">Message</span>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="text-xs text-gray-400">
              Reçu le {new Date(selected.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <a 
                href={`mailto:${selected.email}?subject=Re: Votre demande ABP Partner`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-abp-gold text-white rounded-sm hover:bg-abp-primary"
              >
                Répondre par email
              </a>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
            <p>Sélectionnez un message pour le lire</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Tab
function SettingsTab() {
  const saveBar = useSaveBar();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  // Gestion des couleurs
  const [paletteId, setPaletteId] = useState('classic-gold');
  const [paletteSaving, setPaletteSaving] = useState(false);
  const [paletteSaved, setPaletteSaved] = useState(false);
  
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.theme?.paletteId) {
          setPaletteId(data.theme.paletteId);
        }
      });
  }, []);
  
  const handleSavePalette = async (newPaletteId: string) => {
    setPaletteId(newPaletteId);
    setPaletteSaving(true);
    saveBar.showSaving();
    try {
      const res = await fetch('/api/content');
      const allContent = await res.json();
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...allContent, theme: { ...allContent.theme, paletteId: newPaletteId } }),
      });
      setPaletteSaved(true);
      saveBar.showSaved('Palette de couleurs appliquée !', { url: '/', label: 'Voir le site' });
      setTimeout(() => setPaletteSaved(false), 2000);
    } catch (error) {
      console.error('Error:', error);
      saveBar.showError('Erreur lors du changement de palette');
    } finally {
      setPaletteSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Erreur lors du changement de mot de passe' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };
  
  const currentPalette = COLOR_PALETTES.find(p => p.id === paletteId);

  return (
    <div className="space-y-6">
      {/* Section Couleurs du site */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="text-abp-gold" size={24} />
          <div>
            <h2 className="text-xl font-bold text-abp-primary">Couleurs du site</h2>
            <p className="text-sm text-gray-500">Choisissez la palette de couleurs de votre site</p>
          </div>
          {paletteSaved && (
            <span className="ml-auto text-green-600 text-sm flex items-center gap-1">
              <Check size={16} /> Enregistré
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.id}
              onClick={() => handleSavePalette(palette.id)}
              disabled={paletteSaving}
              className={`relative p-4 rounded-xl border-2 transition-all hover:scale-102 ${
                paletteId === palette.id
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {paletteId === palette.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                  <Check size={14} className="text-white" />
                </div>
              )}
              
              <div className="flex gap-1 mb-3 justify-center">
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.colors.primary }} />
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.colors.accent }} />
                <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.colors.backgroundAlt }} />
              </div>
              
              <p className="text-xs font-medium text-gray-700 text-center">
                {palette.name}
              </p>
            </button>
          ))}
        </div>
        
        {/* Aperçu */}
        {currentPalette && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Aperçu</p>
            <div className="rounded-xl overflow-hidden border shadow-sm">
              <div className="h-16 flex items-center px-4" style={{ backgroundColor: currentPalette.colors.backgroundDark }}>
                <div>
                  <p className="text-xs font-bold tracking-widest" style={{ color: currentPalette.colors.accent }}>
                    ABP PARTNER
                  </p>
                  <h3 className="text-sm font-bold" style={{ color: currentPalette.colors.textOnDark }}>
                    L&apos;Art de la Cuisine
                  </h3>
                </div>
              </div>
              <div className="p-4" style={{ backgroundColor: currentPalette.colors.background }}>
                <button
                  className="px-3 py-1.5 rounded text-xs font-medium"
                  style={{ backgroundColor: currentPalette.colors.accent, color: currentPalette.colors.textOnAccent }}
                >
                  Bouton exemple
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Section Nettoyage des fichiers */}
      <FileCleanup />
      
      {/* Section Mot de passe */}
      <div className="max-w-2xl bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-abp-primary mb-6">Changer le mot de passe</h2>

        {message.text && (
          <div className={`px-4 py-3 rounded-sm mb-6 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
              required
              minLength={6}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-abp-gold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-abp-gold text-white rounded-lg hover:bg-abp-primary disabled:opacity-50"
          >
            {loading ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>

      {/* Section Informations */}
      <div className="max-w-2xl bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-abp-primary mb-4">Informations</h2>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Identifiant :</strong> admin
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Mot de passe par défaut :</strong> abp2024
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Pensez à changer le mot de passe par défaut après la première connexion.
        </p>
      </div>
    </div>
  );
}
