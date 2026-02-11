"use client";

import { useState, useEffect } from "react";
import AvisSection from "./AvisSection";
import { useSiteContent } from '../SiteContentProvider';

interface AvisSectionData {
  houzzProfileUrl: string;
  houzzProId: string;
  houzzHzid: string;
}

export default function AvisSectionWrapper() {
  const siteContent = useSiteContent();
  const [data, setData] = useState<AvisSectionData | null>(
    (siteContent?.homepage as Record<string, unknown>)?.avisSection as AvisSectionData || null
  );

  useEffect(() => {
    if (siteContent?.homepage) {
      const hp = siteContent.homepage as Record<string, unknown>;
      if (hp.avisSection) setData(hp.avisSection as AvisSectionData);
    }
  }, [siteContent]);

  if (!data) {
    return null;
  }

  return (
    <AvisSection
      houzzProfileUrl={data.houzzProfileUrl}
      houzzProId={data.houzzProId}
      houzzHzid={data.houzzHzid}
    />
  );
}
