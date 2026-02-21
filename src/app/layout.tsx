import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Nothing_You_Could_Do } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getSiteContent } from "@/lib/data";
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script'

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const nothingYouCouldDo = Nothing_You_Could_Do({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ABP Partner - Cuisiniste à Domicile & Conseil",
  description: "Expert cuisiniste à domicile en Île-de-France. Conception sur mesure, optimisation d'espace et conseil professionnel.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${nothingYouCouldDo.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <SiteContentProvider content={content}>
          <ThemeProvider>
            <SmoothScroll />
            {children}
          </ThemeProvider>
        </SiteContentProvider>
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JG6YZ6F17M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JG6YZ6F17M');
          `}
        </Script>
      </body>
    </html>
  );
}
