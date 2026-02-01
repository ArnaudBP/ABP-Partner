import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact | ABP Partner",
  description: "Contactez-nous pour votre projet de cuisine, salle de bains ou dressing sur mesure. Consultation gratuite à domicile.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ContactContent />
      <Footer />
    </main>
  );
}
