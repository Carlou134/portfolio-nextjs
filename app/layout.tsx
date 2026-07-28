import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="bg-[#0A0F1E] text-[#F9FAFB] font-sans antialiased">
        <LanguageProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
