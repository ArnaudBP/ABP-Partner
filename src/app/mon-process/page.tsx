import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MonProcess from "@/components/process/MonProcess";

export const metadata = {
  title: "Mon Process - ABP Partner",
  description: "Découvrez comment se déroule votre projet de A à Z avec ABP Partner.",
};

export default function MonProcessPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <MonProcess />
      <Footer />
    </main>
  );
}