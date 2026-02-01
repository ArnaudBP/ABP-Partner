import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RealisationsContent from "@/components/realisations/RealisationsContent";

export const metadata: Metadata = {
  title: "Nos Réalisations | ABP Partner",
  description: "Découvrez nos réalisations de cuisines, salles de bains et dressings sur mesure.",
};

function RealisationsLoading() {
  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <div className="h-4 w-20 bg-gray-200 mx-auto mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-gray-200 mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 mb-4" />
              <div className="h-6 bg-gray-200 w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RealisationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<RealisationsLoading />}>
        <RealisationsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
