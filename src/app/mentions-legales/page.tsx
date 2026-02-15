"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

interface MentionsSection {
  titre: string;
  contenu: string;
}

interface MentionsLegalesData {
  titre: string;
  titreHighlight: string;
  editeur: {
    titre: string;
    intro: string;
    societe: string;
    adresseLigne1: string;
    adresseLigne2: string;
    capitalInfo: string;
    rcsInfo: string;
    directeurPublication: string;
  };
  hebergement: {
    titre: string;
    societe: string;
    details: string;
  };
  credits: {
    titre: string;
    conceptionGraphique: string;
    photos: string;
  };
  sections: MentionsSection[];
}

const defaultContent: MentionsLegalesData = {
  titre: "Mentions",
  titreHighlight: "Légales",
  editeur: {
    titre: "Éditeur du site",
    intro: "Le site www.abp-partner.fr est édité par :",
    societe: "ABP Partner SAS",
    adresseLigne1: "13, rue de la ferme",
    adresseLigne2: "60530 Le Mesnil en Thelle",
    capitalInfo: "SAS au Capital de 5 000 Euros",
    rcsInfo: "RCS COMPIEGNE : 798 153 169",
    directeurPublication: "Arnaud Bourak-Partouche",
  },
  hebergement: {
    titre: "Hébergement",
    societe: "OVH",
    details:
      "SAS au capital de 10 000 000 €\nRCS Roubaix – Tourcoing 424 761 419 00045\nCode APE 6202A - N° TVA : FR 22 424 761 419\nSiège social : 2 rue Kellermann 59100 Roubaix - France",
  },
  credits: {
    titre: "Crédits",
    conceptionGraphique: "ABP Partner",
    photos: "ABP Partner",
  },
  sections: [],
};

export default function MentionsLegales() {
  const siteContent = useSiteContent();
  const raw = siteContent?.pageMentionsLegales as Partial<MentionsLegalesData> | undefined;
  const content = raw
    ? {
        ...defaultContent,
        ...raw,
        editeur: { ...defaultContent.editeur, ...(raw.editeur as object) },
        hebergement: { ...defaultContent.hebergement, ...(raw.hebergement as object) },
        credits: { ...defaultContent.credits, ...(raw.credits as object) },
      }
    : defaultContent;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900">
          {content.titre} <span className="text-abp-gold">{content.titreHighlight}</span>
        </h1>

        <div className="space-y-12 leading-relaxed text-gray-600">
          {/* Éditeur + Hébergement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{content.editeur.titre}</h2>
              <p className="mb-4">{content.editeur.intro}</p>
              <p className="font-bold text-gray-900">{content.editeur.societe}</p>
              <p>{content.editeur.adresseLigne1}</p>
              <p>{content.editeur.adresseLigne2}</p>
              <p className="mt-4">
                {content.editeur.capitalInfo}
                <br />
                {content.editeur.rcsInfo}
              </p>
              <p className="mt-4">
                <span className="font-bold text-gray-900">Directeur de la publication :</span>
                <br />
                {content.editeur.directeurPublication}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{content.hebergement.titre}</h2>
              <p className="font-bold text-gray-900">{content.hebergement.societe}</p>
              {content.hebergement.details.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}

              <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">{content.credits.titre}</h2>
              <p>
                <span className="font-bold text-gray-900">Conception graphique :</span>{" "}
                {content.credits.conceptionGraphique}
                <br />
                <span className="font-bold text-gray-900">Photos :</span> {content.credits.photos}
              </p>
            </div>
          </div>

          {/* Sections dynamiques */}
          {content.sections.map((section, index) => (
            <div key={index} className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.titre}</h2>
              {section.contenu.split("\n\n").map((paragraph, pIdx) => (
                <p key={pIdx} className={pIdx > 0 ? "mt-4" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}