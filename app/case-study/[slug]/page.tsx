import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import { getCaseStudy } from "@/content/case-studies";

// Preview only: the case study still mixes real content with MOCK blocks, so
// production answers 404 until commits 37-42 finish it.
const isPreview = process.env.NODE_ENV !== "production";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isPreview) notFound();

  const { slug } = await params;
  const data = getCaseStudy(slug);
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
