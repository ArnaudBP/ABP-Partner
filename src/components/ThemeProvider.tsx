'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ColorPalette, getPaletteById, COLOR_PALETTES } from '@/lib/colorPalettes';

interface ThemeContextType {
  palette: ColorPalette;
  setPaletteId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState<ColorPalette>(COLOR_PALETTES[0]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Charger la palette depuis l'API
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.theme?.paletteId) {
          setPalette(getPaletteById(content.theme.paletteId));
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    
    const root = document.documentElement;
    const c = palette.colors;
    
    // Variables CSS personnalisées pour le thème
    root.style.setProperty('--theme-primary', c.primary);
    root.style.setProperty('--theme-accent', c.accent);
    root.style.setProperty('--theme-accent-hover', c.accentHover);
    root.style.setProperty('--theme-background', c.background);
    root.style.setProperty('--theme-background-alt', c.backgroundAlt);
    root.style.setProperty('--theme-background-dark', c.backgroundDark);
    root.style.setProperty('--theme-text', c.text);
    root.style.setProperty('--theme-text-muted', c.textMuted);
    root.style.setProperty('--theme-text-on-dark', c.textOnDark);
    root.style.setProperty('--theme-text-on-accent', c.textOnAccent);
    root.style.setProperty('--theme-border', c.border);
    root.style.setProperty('--theme-border-light', c.borderLight);
    
    // Variables Tailwind ABP (pour compatibilité)
    root.style.setProperty('--color-abp-primary', c.primary);
    root.style.setProperty('--color-abp-gold', c.accent);
    root.style.setProperty('--color-abp-black', c.text);
    root.style.setProperty('--color-abp-white', c.background);
    root.style.setProperty('--color-abp-gray', c.backgroundAlt);
    root.style.setProperty('--color-abp-dark-gray', c.textMuted);
    
    // Variables globales
    root.style.setProperty('--background', c.background);
    root.style.setProperty('--foreground', c.text);
    
  }, [palette, loaded]);

  const setPaletteId = (id: string) => {
    setPalette(getPaletteById(id));
  };

  return (
    <ThemeContext.Provider value={{ palette, setPaletteId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
