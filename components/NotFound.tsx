import Link from "next/link";
import { useTranslations } from "next-intl";

// Same shell as every page: the visitor keeps the navbar, the footer and the
// site's look instead of Next's bare white default, and gets two ways out
// (Nielsen #3: an emergency exit from a dead end).
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="max-w-[900px] mx-auto px-6 pt-28 pb-24 min-h-[70vh] flex flex-col justify-center">
      <p className="kicker">{t("kicker")}</p>
      <h1 className="font-sans font-medium text-[clamp(32px,4.4vw,46px)] leading-tight mb-5">
        {t("heading")}
      </h1>
      <p className="text-text-secondary leading-[1.65] max-w-[62ch] mb-8">
        {t("body")}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          {t("home")}
        </Link>
        <Link
          href="/#proyectos"
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          {t("projects")}
        </Link>
      </div>
    </section>
  );
}
