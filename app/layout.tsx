import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carlos Vásquez | Fullstack Developer",
  description:
    "Portfolio de Carlos Vásquez, desarrollador Fullstack especializado en .NET, React y Next.js. Disponible para proyectos freelance.",
  keywords: [".NET", "React", "Next.js", "Fullstack Developer", "Lima", "Perú"],
  authors: [{ name: "Carlos Vásquez" }],
  openGraph: {
    title: "Carlos Vásquez | Fullstack Developer",
    description: "Desarrollador Fullstack especializado en .NET, React y Next.js.",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
