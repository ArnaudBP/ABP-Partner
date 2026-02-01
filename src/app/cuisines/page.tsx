import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CuisinesHero from "@/components/cuisines/CuisinesHero";
import CuisinesExpertise from "@/components/cuisines/CuisinesExpertise";
import CuisinesProcess from "@/components/cuisines/CuisinesProcess";
import CuisinesStyles from "@/components/cuisines/CuisinesStyles";
import CuisinesCTA from "@/components/cuisines/CuisinesCTA";

export const metadata: Metadata = {
  title: "Cuisines Sur Mesure | ABP Partner",
  description: "Conception et installation de cuisines sur mesure haut de gamme. Expertise, qualité et accompagnement personnalisé.",
};

export default function CuisinesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <CuisinesHero />
      <CuisinesExpertise />
      <CuisinesProcess />
      <CuisinesStyles />
      <CuisinesCTA />
      <Footer />
    </main>
  );
}
