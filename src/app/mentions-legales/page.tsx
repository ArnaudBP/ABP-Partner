import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-abp-dark text-white selection:bg-abp-gold selection:text-abp-dark">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-playfair text-white mb-12 text-center">
          Mentions <span className="text-abp-gold">Légales</span>
        </h1>

        <div className="space-y-12 font-montserrat font-light text-gray-300 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 font-playfair">Éditeur du site</h2>
              <p className="mb-4">
                Le site www.abp-partner.fr est édité par :
              </p>
              <p className="font-bold text-white">ABP Partner SAS</p>
              <p>13, rue de la ferme</p>
              <p>60530 Le Mesnil en Thelle</p>
              <p className="mt-4">
                SAS au Capital de 5 000 Euros<br />
                RCS COMPIEGNE : 798 153 169
              </p>
              <p className="mt-4">
                <span className="font-bold text-white">Directeur de la publication :</span><br />
                Arnaud Bourak-Partouche
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 font-playfair">Hébergement</h2>
              <p className="font-bold text-white">OVH</p>
              <p>SAS au capital de 10 000 000 €</p>
              <p>RCS Roubaix – Tourcoing 424 761 419 00045</p>
              <p>Code APE 6202A - N° TVA : FR 22 424 761 419</p>
              <p>Siège social : 2 rue Kellermann 59100 Roubaix - France</p>

              <h2 className="text-xl font-bold text-white mb-4 font-playfair mt-8">Crédits</h2>
              <p>
                <span className="font-bold text-white">Conception graphique :</span> ABP Partner<br />
                <span className="font-bold text-white">Photos :</span> ABP Partner
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6 font-playfair">Limite de responsabilités</h2>
            <p>
              ABP Partner met tout en œuvre pour offrir des informations actualisées et vérifiées. Cependant ABP Partner ne saurait être tenu pour responsable d'éventuelles erreurs, omissions ou résultats qui pourraient être obtenus à la suite d'un mauvais usage ou interprétation des ces informations.
            </p>
            <p className="mt-4">
              ABP Partner se réserve le droit de corriger ces informations, dès que ces erreurs sont portées à sa connaissance et, plus généralement, de modifier, à tout moment, sans préavis, tout ou partie du site sans que sa responsabilité puisse être engagée de ce fait.
            </p>
            <p className="mt-4">
              Les informations fournies par ABP Partner le sont à titre indicatif et ne sauraient dispenser l'utilisateur d'une vérification complémentaire. En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6 font-playfair">Liens</h2>
            <p>
              Le site www.abp-partner.fr peut contenir des liens vers d'autres sites dont il n'exploite pas le contenu ou pour lesquels il n'a pas eu d'autorisation.
            </p>
            <p className="mt-4">
              En aucune manière, ABP Partner ne peut être tenu responsable du contenu, publicités, produits, services ou tout autre matériel disponible sur ou à partir de ces sites ou sources externes qui ne sont ni vérifiées ni approuvées par lui.
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6 font-playfair">Copyright et Propriété Intellectuelle</h2>
            <p>
              L'ensemble des éléments figurant sur le site www.abp-partner.fr sont protégés par les dispositions du Code de la Propriété Intellectuelle. En conséquence, toute reproduction, collecte et utilisation à des fins commerciales de ceux-ci, totale ou partielle, ainsi que toute imitation, sans l'accord exprès, préalable et écrit, de ABP Partner est interdite.
            </p>
            <p className="mt-4">
              Cette interdiction s'étend notamment à tout élément rédactionnel figurant sur le site, aux logos, images, photos, cette liste n'étant pas limitative.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}