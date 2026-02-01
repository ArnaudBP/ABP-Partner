import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SallesDeBainsContent from "@/components/autres-amenagements/SallesDeBainsContent";

export const metadata: Metadata = {
  title: "Salles de Bains Sur Mesure | ABP Partner",
  description: "Conception et installation de salles de bains sur mesure. Douches à l'italienne, meubles vasques et rangements optimisés.",
};

export default function SallesDeBainsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <SallesDeBainsContent />
      <Footer />
    </main>
  );
}
