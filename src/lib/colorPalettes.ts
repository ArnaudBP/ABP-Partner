export interface ColorPalette {
  id: string;
  name: string;
  preview: string;
  colors: {
    // Couleurs principales
    primary: string;        // Titres, textes importants
    accent: string;         // Boutons, liens, éléments d'accentuation
    accentHover: string;    // Hover des boutons
    
    // Fonds
    background: string;     // Fond principal (blanc/crème)
    backgroundAlt: string;  // Fond sections alternées
    backgroundDark: string; // Fond sombre (footer, hero overlay)
    
    // Textes
    text: string;           // Texte principal
    textMuted: string;      // Texte secondaire
    textOnDark: string;     // Texte sur fond sombre
    textOnAccent: string;   // Texte sur boutons accent
    
    // Bordures & Séparateurs
    border: string;
    borderLight: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'classic-gold',
    name: 'Or Classique',
    preview: '#C5A059',
    colors: {
      primary: '#1A1A1A',
      accent: '#C5A059',
      accentHover: '#B08A3E',
      background: '#FDFBF7',
      backgroundAlt: '#F5F3EE',
      backgroundDark: '#1A1A1A',
      text: '#2D2D2D',
      textMuted: '#6B6B6B',
      textOnDark: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      border: '#E5E2DC',
      borderLight: '#F0EDE7',
    },
  },
  {
    id: 'midnight-navy',
    name: 'Bleu Nuit',
    preview: '#1E3A5F',
    colors: {
      primary: '#1E3A5F',
      accent: '#C9A962',
      accentHover: '#B89545',
      background: '#FFFFFF',
      backgroundAlt: '#F8FAFC',
      backgroundDark: '#0F172A',
      text: '#1E293B',
      textMuted: '#64748B',
      textOnDark: '#FFFFFF',
      textOnAccent: '#1E3A5F',
      border: '#E2E8F0',
      borderLight: '#F1F5F9',
    },
  },
  {
    id: 'forest-bronze',
    name: 'Forêt & Bronze',
    preview: '#2D4A3E',
    colors: {
      primary: '#2D4A3E',
      accent: '#A67C52',
      accentHover: '#8B6642',
      background: '#FAFBFA',
      backgroundAlt: '#F3F5F3',
      backgroundDark: '#1C2E26',
      text: '#1F2937',
      textMuted: '#6B7280',
      textOnDark: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      border: '#D4DBD7',
      borderLight: '#E8EBE9',
    },
  },
  {
    id: 'warm-earth',
    name: 'Terre Chaude',
    preview: '#8B5E3C',
    colors: {
      primary: '#4A3428',
      accent: '#8B5E3C',
      accentHover: '#6F4A2E',
      background: '#FFFCF9',
      backgroundAlt: '#FAF6F2',
      backgroundDark: '#2C1F18',
      text: '#3D3028',
      textMuted: '#7A6E64',
      textOnDark: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      border: '#E8DED4',
      borderLight: '#F4EEE8',
    },
  },
  {
    id: 'pure-elegant',
    name: 'Noir Élégant',
    preview: '#1A1A1A',
    colors: {
      primary: '#1A1A1A',
      accent: '#1A1A1A',
      accentHover: '#333333',
      background: '#FFFFFF',
      backgroundAlt: '#FAFAFA',
      backgroundDark: '#0A0A0A',
      text: '#1A1A1A',
      textMuted: '#6B6B6B',
      textOnDark: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      border: '#E5E5E5',
      borderLight: '#F5F5F5',
    },
  },
  {
    id: 'burgundy-cream',
    name: 'Bordeaux & Crème',
    preview: '#722F37',
    colors: {
      primary: '#4A1C23',
      accent: '#722F37',
      accentHover: '#5A252C',
      background: '#FFFBFA',
      backgroundAlt: '#FBF7F6',
      backgroundDark: '#2D1216',
      text: '#2D2024',
      textMuted: '#7A6B6E',
      textOnDark: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      border: '#EAE0E2',
      borderLight: '#F5EEEF',
    },
  },
  {
    id: 'steel-copper',
    name: 'Acier & Cuivre',
    preview: '#B87333',
    colors: {
      primary: '#2C3E50',
      accent: '#B87333',
      accentHover: '#9A5F28',
      background: '#FFFFFF',
      backgroundAlt: '#F8F9FA',
      backgroundDark: '#1A252F',
      text: '#2C3E50',
      textMuted: '#7F8C8D',
      textOnDark: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      border: '#DEE2E6',
      borderLight: '#F1F3F5',
    },
  },
  {
    id: 'sage-stone',
    name: 'Sauge & Pierre',
    preview: '#87A878',
    colors: {
      primary: '#3D4F4F',
      accent: '#87A878',
      accentHover: '#6E8F60',
      background: '#FAFCFA',
      backgroundAlt: '#F2F5F2',
      backgroundDark: '#2A3535',
      text: '#2D3B3B',
      textMuted: '#6B7A7A',
      textOnDark: '#FFFFFF',
      textOnAccent: '#2D3B3B',
      border: '#D4DED4',
      borderLight: '#E8EEE8',
    },
  },
  {
    id: 'charcoal-brass',
    name: 'Charbon & Laiton',
    preview: '#D4AF37',
    colors: {
      primary: '#2D2D2D',
      accent: '#D4AF37',
      accentHover: '#C4A030',
      background: '#FFFFFF',
      backgroundAlt: '#F7F7F7',
      backgroundDark: '#1A1A1A',
      text: '#2D2D2D',
      textMuted: '#757575',
      textOnDark: '#FFFFFF',
      textOnAccent: '#2D2D2D',
      border: '#E0E0E0',
      borderLight: '#F0F0F0',
    },
  },
  {
    id: 'ocean-sand',
    name: 'Océan & Sable',
    preview: '#2E5D5A',
    colors: {
      primary: '#2E5D5A',
      accent: '#C9A962',
      accentHover: '#B89545',
      background: '#FFFEFA',
      backgroundAlt: '#F8F7F3',
      backgroundDark: '#1C3836',
      text: '#2D3B3A',
      textMuted: '#6B7978',
      textOnDark: '#FFFFFF',
      textOnAccent: '#2E5D5A',
      border: '#DDE3DF',
      borderLight: '#EEF1EE',
    },
  },
];

export function getPaletteById(id: string): ColorPalette {
  return COLOR_PALETTES.find(p => p.id === id) || COLOR_PALETTES[0];
}
