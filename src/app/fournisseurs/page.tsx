import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FournisseursContent from "@/components/fournisseurs/FournisseursContent";

export const metadata: Metadata = {
  title: "Mes Fournisseurs & Catalogues | ABP Partner",
  description: "Découvrez nos partenaires fabricants et consultez leurs catalogues. Nobilia, Siemens, Bosch et plus encore.",
};

export default function FournisseursPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FournisseursContent />
      <Footer />
    </main>
  );
}
