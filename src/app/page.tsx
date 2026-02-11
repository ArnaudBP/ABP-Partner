import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import DynamicHomeSections from "@/components/home/DynamicHomeSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />
      <HeroSection />
      <DynamicHomeSections />
      <Footer />
    </main>
  );
}
