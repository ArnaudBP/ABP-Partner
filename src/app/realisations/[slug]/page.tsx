import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RealisationDetail from "@/components/realisations/RealisationDetail";
import { getRealisationBySlug, getRealisations } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const realisation = await getRealisationBySlug(slug);
  
  if (!realisation) {
    return {
      title: "Réalisation non trouvée | ABP Partner",
    };
  }

  return {
    title: `${realisation.title} | ABP Partner`,
    description: realisation.description,
  };
}

export async function generateStaticParams() {
  const realisations = await getRealisations();
  return realisations.map((r) => ({ slug: r.slug }));
}

export default async function RealisationPage({ params }: Props) {
  const { slug } = await params;
  const realisation = await getRealisationBySlug(slug);

  if (!realisation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <RealisationDetail realisation={realisation} />
      <Footer />
    </main>
  );
}
