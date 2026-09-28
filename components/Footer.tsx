"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-text-muted">
          {t("location")} · {new Date().getFullYear()}
        </span>
        <span className="font-mono text-xs text-text-muted">
          {t("builtWith")}
        </span>
      </div>
    </footer>
  );
}
