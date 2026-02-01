"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  ChevronDown, 
  ChevronUp,
  Home,
  UtensilsCrossed,
  Bath,
  Phone,
  Star,
  Truck,
  Image as ImageIcon,
  Loader2,
  Check,
  Palette,
  Eye,
  GripVertical,
  Plus,
  Trash2,
  ExternalLink,
  PanelTop
} from "lucide-react";
import FileUpload from "./FileUpload";
import { COLOR_PALETTES } from "@/lib/colorPalettes";

interface SiteContent {
  [key: string]: unknown;
}

const tabs = [
  { id: 'header', label: 'Header', icon: PanelTop, description: 'Logo et titre du site' },
  { id: 'hero', label: 'Hero', icon: Home, description: 'Bannière principale' },
  { id: 'cuisines-teaser', label: 'Section Cuisines', icon: UtensilsCrossed, description: 'Section cuisines sur l\'accueil' },
  { id: 'amenagements-teaser', label: 'Section Aménagements', icon: Bath, description: 'Salles de bains & Dressings' },
  { id: 'realisations-teaser', label: 'Section Réalisations', icon: ImageIcon, description: 'Galerie de projets' },
  { id: 'fournisseurs-teaser', label: 'Section Fournisseurs', icon: Truck, description: 'Mes partenaires' },
  { id: 'avis', label: 'Section Avis', icon: Star, description: 'Widget Houzz' },
  { id: 'cta', label: 'Section Contact', icon: Phone, description: 'Appel à l\'action' },
  { id: 'sections-order', label: 'Ordre des sections', icon: GripVertical, description: 'Réorganiser l\'accueil' },
];

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (path: string, value: unknown) => {
    if (!content) return;
    
    const newContent = { ...content };
    const keys = path.split('.');
    let current: Record<string, unknown> = newContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    
    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-abp-gold" size={32} />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12 text-gray-500">
        Erreur lors du chargement du contenu
      </div>
    );
  }

  const homepage = content.homepage as Record<string, unknown> || {};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header fixe */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Éditeur de contenu</h1>
            <p className="text-sm text-gray-500">Modifiez les textes et images de votre site</p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Eye size={18} />
              <span className="text-sm">Voir le site</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                saved 
                  ? 'bg-green-500 text-white' 
                  : 'bg-abp-gold text-white hover:bg-abp-primary shadow-lg hover:shadow-xl'
              }`}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : saved ? (
                <Check size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-abp-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description de l'onglet actif */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-700">
              💡 {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          {/* Contenu de l'onglet */}
          <div className="p-6">
            {activeTab === 'header' && (
              <HeaderEditor 
                content={content.navbar as Record<string, unknown>} 
                onChange={(val) => updateContent('navbar', val)} 
              />
            )}
            {activeTab === 'hero' && (
              <HeroEditor 
                content={content.hero as Record<string, unknown>} 
                onChange={(val) => updateContent('hero', val)} 
              />
            )}
            {activeTab === 'cuisines-teaser' && (
              <CuisinesTeaserEditor 
                content={homepage.cuisinesTeaser as Record<string, unknown>} 
                onChange={(val) => updateContent('homepage.cuisinesTeaser', val)} 
              />
            )}
            {activeTab === 'amenagements-teaser' && (
              <AmenagementsTeaserEditor 
                content={homepage.autresAmenagementsTeaser as Record<string, unknown>} 
                onChange={(val) => updateContent('homepage.autresAmenagementsTeaser', val)} 
              />
            )}
            {activeTab === 'realisations-teaser' && (
              <RealisationsTeaserEditor 
                content={homepage.realisationsTeaser as Record<string, unknown>} 
                onChange={(val) => updateContent('homepage.realisationsTeaser', val)} 
              />
            )}
            {activeTab === 'fournisseurs-teaser' && (
              <FournisseursTeaserEditor 
                content={homepage.fournisseursTeaser as Record<string, unknown>} 
                onChange={(val) => updateContent('homepage.fournisseursTeaser', val)} 
              />
            )}
            {activeTab === 'avis' && (
              <AvisEditor 
                content={homepage.avisSection as Record<string, unknown>} 
                onChange={(val) => updateContent('homepage.avisSection', val)} 
              />
            )}
            {activeTab === 'cta' && (
              <CTAEditor 
                content={homepage.ctaSection as Record<string, unknown>} 
                onChange={(val) => updateContent('homepage.ctaSection', val)} 
              />
            )}
            {activeTab === 'sections-order' && (
              <SectionsOrderEditor 
                content={homepage.sectionsOrder as Array<{id: string; label: string; enabled: boolean}>} 
                onChange={(val) => updateContent('homepage.sectionsOrder', val)} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPOSANTS GÉNÉRIQUES ====================

function InputField({ label, value, onChange, placeholder, hint }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-abp-gold/50 focus:border-abp-gold transition-all"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, hint, rows = 3 }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-abp-gold/50 focus:border-abp-gold transition-all resize-none"
      />
    </div>
  );
}

function ImageField({ label, value, onChange, hint }: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div className="flex gap-4 items-start">
        {value && (
          <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <FileUpload
            onUpload={onChange}
            folder="content"
            accept="image/*"
            label={value ? "Changer l'image" : "Ajouter une image"}
            currentFile={value}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== ÉDITEURS DE SECTIONS ====================

// Theme Editor
function ThemeEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const currentPaletteId = (content?.paletteId as string) || 'classic-gold';
  const currentPalette = COLOR_PALETTES.find(p => p.id === currentPaletteId);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Choisissez votre palette de couleurs</h3>
        <p className="text-sm text-gray-500 mb-6">
          La palette sélectionnée sera appliquée à l&apos;ensemble du site (boutons, titres, fonds...).
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.id}
              onClick={() => onChange({ ...content, paletteId: palette.id })}
              className={`relative p-4 rounded-xl border-2 transition-all hover:scale-102 ${
                currentPaletteId === palette.id
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {currentPaletteId === palette.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                  <Check size={14} className="text-white" />
                </div>
              )}
              
              {/* Aperçu des couleurs */}
              <div className="flex gap-1 mb-3">
                <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: palette.colors.primary }} />
                <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: palette.colors.accent }} />
                <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: palette.colors.backgroundAlt }} />
              </div>
              
              <p className="text-xs font-medium text-gray-700 text-center">
                {palette.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Aperçu détaillé */}
      {currentPalette && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Aperçu : {currentPalette.name}</h4>
          <div className="rounded-xl overflow-hidden border shadow-lg">
            <div className="h-24 flex items-center px-6" style={{ backgroundColor: currentPalette.colors.backgroundDark }}>
              <div>
                <p className="text-xs font-bold tracking-widest mb-1" style={{ color: currentPalette.colors.accent }}>
                  ABP PARTNER
                </p>
                <h3 className="text-xl font-bold" style={{ color: currentPalette.colors.textOnDark }}>
                  L&apos;Art de la Cuisine
                </h3>
              </div>
            </div>
            <div className="p-6" style={{ backgroundColor: currentPalette.colors.background }}>
              <h4 className="font-bold mb-2" style={{ color: currentPalette.colors.primary }}>
                Votre Cuisine Sur Mesure
              </h4>
              <p className="text-sm mb-4" style={{ color: currentPalette.colors.textMuted }}>
                Conception à domicile, fabrication premium.
              </p>
              <button
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: currentPalette.colors.accent, color: currentPalette.colors.textOnAccent }}
              >
                Découvrir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Header Editor (Logo et titre du site)
function HeaderEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const data = content || {};
  const update = (key: string, value: unknown) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche - Logo */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">1</span>
            Logo du site
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
            <p className="text-xs text-gray-400 mb-3">Format PNG ou SVG recommandé (fond transparent)</p>
            <FileUpload
              onUpload={(url) => update('logo', url)}
              folder="content"
              accept="image/*"
              label="Uploader un logo"
              currentFile={data.logo as string}
            />
            {typeof data.logo === 'string' && data.logo && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg inline-block">
                <img src={data.logo} alt="Logo preview" className="h-16 object-contain" />
              </div>
            )}
            {typeof data.logo === 'string' && data.logo && (
              <button
                onClick={() => update('logo', '')}
                className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
              >
                Supprimer le logo
              </button>
            )}
          </div>
        </div>

        {/* Colonne droite - Textes */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">2</span>
            Textes du header
          </h3>
          
          <InputField
            label="Titre principal"
            value={data.title as string}
            onChange={(val) => update('title', val)}
            hint="Ex: La cuisine d'Arnaud"
            placeholder="La cuisine d'Arnaud"
          />
          
          <InputField
            label="Sous-titre"
            value={data.subtitle as string}
            onChange={(val) => update('subtitle', val)}
            hint="Le mot 'Partner' sera automatiquement coloré en or"
            placeholder="ABP Partner"
          />
        </div>
      </div>

      {/* Aperçu */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-4">Aperçu du header</h4>
        <div className="flex items-center gap-3">
          {typeof data.logo === 'string' && data.logo && (
            <div className="w-12 h-12 flex-shrink-0">
              <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold tracking-tight">
              {(data.title as string) || "La cuisine d'Arnaud"}
            </span>
            <span className="text-sm font-medium tracking-wider text-white/70">
              {((data.subtitle as string) || "ABP Partner").replace('Partner', '')}
              <span className="text-yellow-500">Partner</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hero Editor
function HeroEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche - Textes */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">1</span>
            Textes de la bannière
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Titre (ligne 1)"
              value={content.title as string}
              onChange={(val) => update('title', val)}
              hint="Ex: L'Art de la Cuisine"
            />
            <InputField
              label="Titre coloré (ligne 2)"
              value={content.titleHighlight as string}
              onChange={(val) => update('titleHighlight', val)}
              hint="Texte en couleur accent"
            />
          </div>
          
          <InputField
            label="Sous-titre"
            value={content.subtitle as string}
            onChange={(val) => update('subtitle', val)}
            hint="Apparaît au-dessus du titre"
          />
          
          <TextareaField
            label="Description"
            value={content.description as string}
            onChange={(val) => update('description', val)}
            hint="Texte descriptif sous le titre"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Bouton principal"
              value={content.ctaPrimary as string}
              onChange={(val) => update('ctaPrimary', val)}
            />
            <InputField
              label="Bouton secondaire"
              value={content.ctaSecondary as string}
              onChange={(val) => update('ctaSecondary', val)}
            />
          </div>
        </div>

        {/* Colonne droite - Médias */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">2</span>
            Médias de fond
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vidéo de fond</label>
              <p className="text-xs text-gray-400 mb-3">Format MP4 recommandé (max 10MB)</p>
              <FileUpload
                onUpload={(url) => update('videoUrl', url)}
                folder="hero"
                accept="video/*"
                label="Uploader une vidéo"
                currentFile={content.videoUrl as string}
              />
              {typeof content.videoUrl === 'string' && content.videoUrl && (
                <div className="mt-3 aspect-video bg-black rounded-lg overflow-hidden">
                  <video src={content.videoUrl} className="w-full h-full object-cover" muted loop autoPlay />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image de secours</label>
              <p className="text-xs text-gray-400 mb-3">Affichée si la vidéo ne charge pas</p>
              <FileUpload
                onUpload={(url) => update('backgroundImage', url)}
                folder="hero"
                accept="image/*"
                label="Uploader une image"
                currentFile={content.backgroundImage as string}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cuisines Teaser Editor
function CuisinesTeaserEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });
  const features = (content?.features as Array<{icon: string; title: string; description: string}>) || [];

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    update('features', newFeatures);
  };

  const addFeature = () => {
    update('features', [...features, { icon: 'star', title: 'Nouveau point', description: 'Description...' }]);
  };

  const removeFeature = (index: number) => {
    update('features', features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Titres */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Titres et description</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Titre"
            value={content?.title as string}
            onChange={(val) => update('title', val)}
            hint="Ex: Votre Cuisine"
          />
          <InputField
            label="Titre en surbrillance"
            value={content?.titleHighlight as string}
            onChange={(val) => update('titleHighlight', val)}
            hint="Texte stylisé italique"
          />
        </div>
        <div className="mt-4">
          <TextareaField
            label="Description"
            value={content?.description as string}
            onChange={(val) => update('description', val)}
            hint="Paragraphe de présentation"
          />
        </div>
      </div>

      {/* Points forts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Points forts (3 max recommandé)</h3>
          <button
            onClick={addFeature}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
        
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField
                    label={`Point ${index + 1} - Titre`}
                    value={feature.title}
                    onChange={(val) => updateFeature(index, 'title', val)}
                  />
                  <InputField
                    label="Description"
                    value={feature.description}
                    onChange={(val) => updateFeature(index, 'description', val)}
                  />
                </div>
                <button
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Images de la section</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageField
            label="Image cuisine 1"
            value={content?.image1 as string}
            onChange={(url) => update('image1', url)}
            hint="Format portrait (3:4)"
          />
          <ImageField
            label="Image cuisine 2"
            value={content?.image2 as string}
            onChange={(url) => update('image2', url)}
            hint="Format carré (1:1)"
          />
          <ImageField
            label="Image cuisine 3"
            value={content?.image3 as string}
            onChange={(url) => update('image3', url)}
            hint="Format portrait (3:4)"
          />
        </div>
      </div>

      {/* Bouton */}
      <div>
        <InputField
          label="Texte du bouton"
          value={content?.ctaText as string}
          onChange={(val) => update('ctaText', val)}
          hint="Bouton de redirection vers la page Cuisines"
        />
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Statistique mise en avant</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Nombre"
            value={content?.statNumber as string}
            onChange={(val) => update('statNumber', val)}
            placeholder="15+"
          />
          <InputField
            label="Texte"
            value={content?.statText as string}
            onChange={(val) => update('statText', val)}
            placeholder="Ans d'expérience"
          />
        </div>
      </div>
    </div>
  );
}

// Aménagements Teaser Editor
function AmenagementsTeaserEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });
  const items = (content?.items as Array<{title: string; description: string; image: string; link: string}>) || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    update('items', newItems);
  };

  return (
    <div className="space-y-8">
      {/* Titres */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Titres de la section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Titre"
            value={content?.title as string}
            onChange={(val) => update('title', val)}
            hint="Ex: Au-delà de la"
          />
          <InputField
            label="Titre en surbrillance"
            value={content?.titleHighlight as string}
            onChange={(val) => update('titleHighlight', val)}
            hint="Ex: Cuisine"
          />
        </div>
        <div className="mt-4">
          <TextareaField
            label="Description"
            value={content?.description as string}
            onChange={(val) => update('description', val)}
          />
        </div>
      </div>

      {/* Items - Salles de bains & Dressings */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Aménagements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                {index === 0 ? <Bath size={20} className="text-blue-500" /> : <span>👔</span>}
                {index === 0 ? 'Salles de Bains' : 'Dressings'}
              </h4>
              
              <div className="space-y-4">
                <InputField
                  label="Titre affiché"
                  value={item.title}
                  onChange={(val) => updateItem(index, 'title', val)}
                />
                <TextareaField
                  label="Description"
                  value={item.description}
                  onChange={(val) => updateItem(index, 'description', val)}
                  rows={2}
                />
                <ImageField
                  label="Image"
                  value={item.image}
                  onChange={(url) => updateItem(index, 'image', url)}
                  hint="Format 16:9 recommandé"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Réalisations Teaser Editor
function RealisationsTeaserEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          ℹ️ Cette section affiche automatiquement vos dernières réalisations. 
          Vous pouvez personnaliser les textes d&apos;en-tête ci-dessous.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Titre"
          value={content?.title as string}
          onChange={(val) => update('title', val)}
          hint="Ex: Nos"
        />
        <InputField
          label="Titre en surbrillance"
          value={content?.titleHighlight as string}
          onChange={(val) => update('titleHighlight', val)}
          hint="Ex: Réalisations"
        />
      </div>

      <TextareaField
        label="Description"
        value={content?.description as string}
        onChange={(val) => update('description', val)}
        hint="Texte d'introduction de la galerie"
      />

      <InputField
        label="Texte du bouton"
        value={content?.ctaText as string}
        onChange={(val) => update('ctaText', val)}
        hint="Lien vers la page Réalisations"
      />
    </div>
  );
}

// Fournisseurs Teaser Editor
function FournisseursTeaserEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          ℹ️ Les logos des fournisseurs sont gérés dans la section &quot;Fournisseurs&quot; du site.
          Ici vous pouvez modifier les textes de présentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Titre"
          value={content?.title as string}
          onChange={(val) => update('title', val)}
          hint="Ex: Nos"
        />
        <InputField
          label="Titre en surbrillance"
          value={content?.titleHighlight as string}
          onChange={(val) => update('titleHighlight', val)}
          hint="Ex: Partenaires"
        />
      </div>

      <TextareaField
        label="Description"
        value={content?.description as string}
        onChange={(val) => update('description', val)}
      />
    </div>
  );
}

// Avis Editor
function AvisEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-700">
          ⭐ Cette section affiche le widget officiel Houzz avec vos avis clients en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Titre"
          value={content?.title as string}
          onChange={(val) => update('title', val)}
          hint="Ex: Ce que nos"
        />
        <InputField
          label="Titre en surbrillance"
          value={content?.titleHighlight as string}
          onChange={(val) => update('titleHighlight', val)}
          hint="Ex: Clients disent"
        />
      </div>

      <TextareaField
        label="Description"
        value={content?.description as string}
        onChange={(val) => update('description', val)}
      />

      <div className="pt-4 border-t">
        <h4 className="font-semibold text-gray-700 mb-4">Configuration Houzz</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="URL profil Houzz"
            value={content?.houzzProfileUrl as string}
            onChange={(val) => update('houzzProfileUrl', val)}
            placeholder="https://www.houzz.fr/pro/abppartner"
          />
          <InputField
            label="Houzz Pro ID"
            value={content?.houzzProId as string}
            onChange={(val) => update('houzzProId', val)}
            placeholder="abppartner"
          />
        </div>
        <div className="mt-4">
          <InputField
            label="Houzz HZ ID"
            value={content?.houzzHzid as string}
            onChange={(val) => update('houzzHzid', val)}
            placeholder="41538"
          />
        </div>
      </div>
    </div>
  );
}

// CTA Editor
function CTAEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void }) {
  const update = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  return (
    <div className="space-y-8">
      {/* Textes */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Textes de l&apos;appel à l&apos;action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Titre"
            value={content?.title as string}
            onChange={(val) => update('title', val)}
            hint="Ex: Prêt à Transformer"
          />
          <InputField
            label="Titre en surbrillance"
            value={content?.titleHighlight as string}
            onChange={(val) => update('titleHighlight', val)}
            hint="Ex: Votre Intérieur ?"
          />
        </div>
        <div className="mt-4">
          <TextareaField
            label="Description"
            value={content?.description as string}
            onChange={(val) => update('description', val)}
            hint="Texte incitatif"
          />
        </div>
        <div className="mt-4">
          <InputField
            label="Texte du bouton"
            value={content?.ctaText as string}
            onChange={(val) => update('ctaText', val)}
            hint="Ex: Demander un RDV gratuit"
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Image d&apos;illustration</h3>
        <ImageField
          label="Image"
          value={content?.image as string}
          onChange={(url) => update('image', url)}
          hint="Format 4:3 recommandé"
        />
      </div>

      {/* Témoignage flottant */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Carte témoignage</h3>
        <p className="text-sm text-gray-500 mb-4">Petite carte qui apparaît sur l&apos;image</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Titre de la carte"
            value={content?.testimonialTitle as string}
            onChange={(val) => update('testimonialTitle', val)}
            placeholder="100% Satisfaits"
          />
          <InputField
            label="Sous-titre"
            value={content?.testimonialSubtitle as string}
            onChange={(val) => update('testimonialSubtitle', val)}
            placeholder="Nos clients nous recommandent"
          />
        </div>
        <div className="mt-4">
          <TextareaField
            label="Citation"
            value={content?.testimonialQuote as string}
            onChange={(val) => update('testimonialQuote', val)}
            placeholder="Un accompagnement personnalisé du début à la fin..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}

// Sections Order Editor
function SectionsOrderEditor({ content, onChange }: { 
  content: Array<{id: string; label: string; enabled: boolean}>; 
  onChange: (val: Array<{id: string; label: string; enabled: boolean}>) => void 
}) {
  const sections = content || [
    { id: 'cuisines', label: 'Cuisines', enabled: true },
    { id: 'avis', label: 'Avis Houzz', enabled: true },
    { id: 'realisations', label: 'Réalisations', enabled: true },
    { id: 'autresAmenagements', label: 'Autres Aménagements', enabled: true },
    { id: 'fournisseurs', label: 'Fournisseurs', enabled: true },
    { id: 'cta', label: 'CTA Contact', enabled: true },
  ];

  const move = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onChange(newSections);
  };

  const toggle = (index: number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], enabled: !newSections[index].enabled };
    onChange(newSections);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          🎯 Réorganisez les sections de votre page d&apos;accueil. Utilisez les flèches pour changer l&apos;ordre 
          et le bouton pour masquer/afficher une section.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              section.enabled 
                ? 'bg-white border-gray-200 shadow-sm' 
                : 'bg-gray-50 border-gray-100 opacity-60'
            }`}
          >
            {/* Position */}
            <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500">
              {index + 1}
            </span>

            {/* Flèches */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => move(index, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => move(index, 'down')}
                disabled={index === sections.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Nom */}
            <span className={`flex-1 font-medium ${section.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
              {section.label}
            </span>

            {/* Toggle */}
            <button
              onClick={() => toggle(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                section.enabled 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
            >
              {section.enabled ? '✓ Visible' : 'Masqué'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
