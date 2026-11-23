import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import { getCaseStudy } from "@/content/case-studies";
import { defaultLocale, isLocale } from "@/i18n/locale";

type Props = { params: Promise<{ slug: string }> };

// Same source as the rest of the site: the locale cookie (see i18n/request.ts).
async function resolve(params: Props["params"]) {
  const { slug } = await params;
  const raw = await getLocale();
  const locale = isLocale(raw) ? raw : defaultLocale;
  return getCaseStudy(slug, locale);
}

// Overrides the layout's canonical "/": inheriting it would tell search
// engines this page duplicates the home page.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await resolve(params);
  if (!data) return {};
  const title = `${data.title} | Carlos Vásquez`;
  const path = `/case-study/${data.slug}`;
  return {
    title,
    description: data.description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: data.description,
      type: "article",
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.description,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const data = await resolve(params);
  if (!data) notFound();

  return (
    <>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <CaseStudy data={data} />
      </main>
      <Footer />
    </>
  );
}
