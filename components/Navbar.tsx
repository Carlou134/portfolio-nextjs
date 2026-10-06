"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { setLocale } from "@/i18n/actions";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = useTranslations("Nav");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // e2e/helpers.ts's gotoHydrated() waits on this marker to know click
    // handlers are attached — it used to piggyback on LanguageContext's own
    // localStorage write for the same purpose, now gone with that context.
    document.documentElement.dataset.hydrated = "true";
  }, []);

  const navLinks = [
    { labelKey: "linkProjects", href: "#proyectos" },
    { labelKey: "linkStack", href: "#stack" },
    { labelKey: "linkExperience", href: "#experiencia" },
    { labelKey: "linkContact", href: "#contacto" },
  ] as const;

  const handleToggleLanguage = async () => {
    await setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "backdrop-blur-md bg-bg-primary/80"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        <a
          href="#"
          className="inline-flex items-center min-h-11 font-mono font-medium text-text-primary text-lg"
        >
          cfvasquez<span className="text-accent">.</span>dev
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="nav-link inline-flex items-center min-h-11"
              >
                {t(item.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="badge-accent hidden sm:inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t("available")}
          </span>

          <button
            type="button"
            onClick={handleToggleLanguage}
            className="nav-link inline-flex items-center justify-center min-h-11 min-w-11 border border-border rounded-md px-2 text-xs font-mono hover:border-border-hover"
            aria-label="Switch language / Cambiar idioma"
          >
            {locale === "es" ? "EN" : "ES"}
          </button>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 -mr-2 text-text-primary"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <ul className="md:hidden flex flex-col px-6 pb-4 border-t border-border">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="nav-link block py-3"
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
