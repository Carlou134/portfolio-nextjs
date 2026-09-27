"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/LanguageContext";
import { setLocale } from "@/i18n/actions";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Two i18n systems coexist during the migration (plan commits 9-16):
  // LanguageContext still drives every not-yet-migrated component, so
  // `toggle()` keeps flipping it instantly. next-intl (used below via `t`)
  // resolves its locale from a cookie, so the same click also calls
  // `setLocale` to keep both in lockstep. LanguageContext is removed once
  // nothing depends on it anymore (commit 17), and this dual call goes with it.
  const { lang, toggle } = useLanguage();
  const t = useTranslations("Nav");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { labelKey: "linkProjects", href: "#proyectos" },
    { labelKey: "linkStack", href: "#stack" },
    { labelKey: "linkExperience", href: "#experiencia" },
    { labelKey: "linkContact", href: "#contacto" },
  ] as const;

  const handleToggleLanguage = () => {
    toggle();
    void setLocale(lang === "es" ? "en" : "es");
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
        <a href="#" className="font-mono font-medium text-text-primary text-lg">
          cfvasquez<span className="text-accent-green">.</span>dev
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link">
                {t(item.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="badge-green hidden sm:inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            {t("available")}
          </span>

          <button
            type="button"
            onClick={handleToggleLanguage}
            className="nav-link border border-border rounded-md px-2 py-1 text-xs font-mono hover:border-border-hover"
            aria-label="Switch language / Cambiar idioma"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-text-primary"
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
