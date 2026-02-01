"use client";

import { useState, useEffect } from "react";
import AvisSection from "./AvisSection";

interface AvisSectionData {
  houzzProfileUrl: string;
  houzzProId: string;
  houzzHzid: string;
}

export default function AvisSectionWrapper() {
  const [data, setData] = useState<AvisSectionData | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content.homepage?.avisSection) {
          setData(content.homepage.avisSection);
        }
      })
      .catch(console.error);
  }, []);

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
