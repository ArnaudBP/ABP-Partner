import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import DynamicHomeSections from "@/components/home/DynamicHomeSections";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getSiteContent } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
      <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
        <Navbar />
        <HeroSection />
        <DynamicHomeSections />
        <Footer />
      </main>
    </SiteContentProvider>
  );
}
