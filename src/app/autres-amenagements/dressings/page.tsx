import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DressingsContent from "@/components/autres-amenagements/DressingsContent";

export const metadata: Metadata = {
  title: "Dressings Sur Mesure | ABP Partner",
  description: "Conception et installation de dressings sur mesure. Solutions de rangement optimisées pour votre garde-robe.",
};

export default function DressingsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <DressingsContent />
      <Footer />
    </main>
  );
}
