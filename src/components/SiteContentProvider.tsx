'use client';

import { createContext, useContext, ReactNode } from 'react';
import { SiteContent } from '@/types';

const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({ 
  children, 
  content 
}: { 
  children: ReactNode; 
  content: SiteContent;
}) {
  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContent | null {
  return useContext(SiteContentContext);
}
