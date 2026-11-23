"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale, locales } from "@/i18n/locale";
import { setLocale } from "@/i18n/actions";
import { cvFileByLocale } from "@/lib/cv";
import { useActiveSection } from "@/lib/use-active-section";

// Same order as the sections in app/page.tsx.

// On "/" a native "#id" anchor: a plain same-document jump. Elsewhere "#id"
// would resolve against the current path (/case-study/soc-ml#experiencia, a
// dead link), so it's a <Link> to "/#id". Not <Link> on "/" too: after a soft
// navigation to "/#a", Next 16.2's router appends the next hash to the cached
// canonical URL ("/#a#b" — segment-cache/navigation.js), a URL that scrolls
// nowhere if shared.
function SectionLink({
  id,
  onHome,
  ...rest
}: { id: string; onHome: boolean } & Omit<ComponentProps<"a">, "href">) {
  return onHome ? (
    <a href={`#${id}`} {...rest} />
  ) : (
    <Link href={`/#${id}`} {...rest} />
  );
}
const navLinks = [
  { labelKey: "linkAbout", id: "sobre-mi" },
  { labelKey: "linkStack", id: "stack" },
  { labelKey: "linkProjects", id: "proyectos" },
  { labelKey: "linkExperience", id: "experiencia" },
  { labelKey: "linkContact", id: "contacto" },
] as const;

const sectionIds = navLinks.map((item) => item.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = useTranslations("Nav");
  const activeId = useActiveSection(sectionIds);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the open menu and hands focus back to the toggle, so a
  // keyboard user isn't dropped at the top of the document (Nielsen #3).
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The hero has its own "Download CV" button. While it's on screen the
  // header one would offer the same action twice, so it only shows once the
  // hero's has scrolled away. Starts hidden so it doesn't flash on load.
  // Only "/" has the hero: on any other route (the case study) the header
  // button is the only CV link, so it must always show there.
  const onHome = usePathname() === "/";
  const [heroCvInView, setHeroCvInView] = useState(true);
  const hideHeaderCv = onHome && heroCvInView;

  useEffect(() => {
    const heroCv = document.getElementById("hero-cv");
    if (!heroCv) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroCvInView(entry.isIntersecting),
      // The fixed h-20 header covers the top 80px of the viewport.
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(heroCv);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // e2e/helpers.ts's gotoHydrated() waits on this marker to know click
    // handlers are attached — it used to piggyback on LanguageContext's own
    // localStorage write for the same purpose, now gone with that context.
    document.documentElement.dataset.hydrated = "true";
  }, []);

  // aria-current="location" is what screen readers announce as "current
  // location"; the CSS indicator keys off the same attribute.
  const currentProps = (id: string) =>
    activeId === id ? { "aria-current": "location" as const } : {};

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "backdrop-blur-md bg-bg-primary/80"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        <SectionLink
          id={"inicio"}
          onHome={onHome}
          className="inline-flex items-center min-h-11 font-mono font-medium text-text-primary text-lg"
        >
          cfvasquez<span className="text-accent">.</span>dev
        </SectionLink>

        {/* From lg, not md: at 768px the five links plus logo, CV and the
            language toggle don't fit — "Sobre mí" wrapped and the toggle
            was clipped off the right edge. */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <li key={item.id}>
              <SectionLink
                id={item.id}
                onHome={onHome}
                className="nav-link inline-flex items-center min-h-11"
                {...currentProps(item.id)}
              >
                {t(item.labelKey)}
              </SectionLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={cvFileByLocale[locale]}
            target="_blank"
            rel="noopener noreferrer"
            // invisible, not hidden: it keeps its width so the nav links
            // don't shift, and visibility drops it from tab order and the
            // accessibility tree while the hero's button is on screen.
            className={`btn-secondary hidden sm:inline-flex items-center gap-2 min-h-11 px-4 transition-[opacity,visibility] duration-(--duration-base) ${
              hideHeaderCv ? "invisible opacity-0" : "opacity-100"
            }`}
            aria-label={t("cvLabel")}
          >
            <Download size={14} aria-hidden="true" />
            {t("cv")}
          </a>

          <div role="group" aria-label={t("language")} className="seg">
            {locales.map((option) => (
              <button
                key={option}
                type="button"
                lang={option}
                aria-pressed={locale === option}
                onClick={() => {
                  if (option !== locale) void setLocale(option);
                }}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 -mr-2 text-text-primary"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <ul
          id="mobile-menu"
          className="lg:hidden flex flex-col px-6 pb-4 border-t border-border"
        >
          {navLinks.map((item) => (
            <li key={item.id}>
              <SectionLink
                id={item.id}
                onHome={onHome}
                onClick={() => setMobileOpen(false)}
                className="nav-link block py-3"
                {...currentProps(item.id)}
              >
                {t(item.labelKey)}
              </SectionLink>
            </li>
          ))}
          {/* The header CV button hides below sm, so it lives here instead. */}
          <li className="sm:hidden">
            <a
              href={cvFileByLocale[locale]}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link flex items-center gap-2 py-3"
              aria-label={t("cvLabel")}
            >
              <Download size={14} aria-hidden="true" />
              {t("cv")}
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
