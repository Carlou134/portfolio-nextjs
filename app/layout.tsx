import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cfvasquez.dev"),
  title: "Carlos Vásquez | Fullstack Developer",
  description:
    "Portfolio de Carlos Vásquez, desarrollador Fullstack especializado en .NET, React y Next.js. Disponible para proyectos freelance.",
  keywords: [".NET", "React", "Next.js", "Fullstack Developer", "Lima", "Perú"],
  authors: [{ name: "Carlos Vásquez" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Carlos Vásquez | Fullstack Developer",
    description: "Desarrollador Fullstack especializado en .NET, React y Next.js.",
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carlos Vásquez | Fullstack Developer",
    description: "Desarrollador Fullstack especializado en .NET, React y Next.js.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Carlos Vásquez",
  jobTitle: "Solutions Center of Excellence Associate",
  worksFor: {
    "@type": "Organization",
    name: "Zoluxiones IT Services",
  },
  url: "https://www.cfvasquez.dev",
  sameAs: [
    "https://github.com/Carlou134",
    "https://www.linkedin.com/in/carlos-vasquez-rod/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0A0F1E] text-[#F9FAFB] font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LanguageProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
