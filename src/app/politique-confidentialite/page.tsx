"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

interface Section {
  titre: string;
  contenu: string;
}

interface PolitiqueData {
  titre: string;
  titreHighlight: string;
  intro: string;
  sections: Section[];
}

const defaultContent: PolitiqueData = {
  titre: "Politique de",
  titreHighlight: "Confidentialité",
  intro: "La présente politique de confidentialité décrit comment ABP Partner collecte, utilise et protège les informations personnelles que vous fournissez sur le site www.abp-partner.fr.",
  sections: [],
};

export default function PolitiqueConfidentialite() {
  const siteContent = useSiteContent();
  const raw = siteContent?.pagePolitiqueConfidentialite as Partial<PolitiqueData> | undefined;
  const content = raw ? { ...defaultContent, ...raw } : defaultContent;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900">
          {content.titre} <span className="text-abp-gold">{content.titreHighlight}</span>
        </h1>

        {content.intro && (
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            {content.intro}
          </p>
        )}

        <div className="space-y-12 leading-relaxed text-gray-600">
          {content.sections.map((section, index) => (
            <div key={index} className={index > 0 ? "border-t border-gray-200 pt-8" : ""}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.titre}</h2>
              {section.contenu.split("\n\n").map((paragraph, pIdx) => {
                // Handle bullet points
                if (paragraph.startsWith("- ") || paragraph.includes("\n- ")) {
                  const lines = paragraph.split("\n");
                  return (
                    <ul key={pIdx} className={`list-disc list-inside space-y-1 ${pIdx > 0 ? "mt-4" : ""}`}>
                      {lines.map((line, lIdx) => (
                        <li key={lIdx}>{line.replace(/^- /, "")}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={pIdx} className={pIdx > 0 ? "mt-4" : ""}>
                    {paragraph.split("\n").map((line, lIdx) => (
                      <span key={lIdx}>
                        {line}
                        {lIdx < paragraph.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
