import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutresAmenagementsHub from "@/components/autres-amenagements/AutresAmenagementsHub";

export const metadata: Metadata = {
  title: "Autres Aménagements | ABP Partner",
  description: "Salles de bains et dressings sur mesure. Notre expertise s'étend à tous vos espaces de vie.",
};

export default function AutresAmenagementsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <AutresAmenagementsHub />
      <Footer />
    </main>
  );
}
