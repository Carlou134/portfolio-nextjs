import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";

// Root not-found: renders inside the root layout (fonts, i18n, skip link)
// for notFound() calls and for every unmatched URL. Next adds the 404 status
// and a noindex robots tag on its own.
// The tab says what happened too, not the home page's title (Nielsen #1).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: `${t("heading")} | Carlos Vásquez` };
}

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <NotFound />
      </main>
      <Footer />
    </>
  );
}
