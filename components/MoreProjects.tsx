"use client";

import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { projects } from "@/content/projects";

// Pending-content notices are a dev aid; production never renders them.
const showPending = process.env.NODE_ENV !== "production";

// Newest first; same year keeps the order of content/projects.ts.
const rows = projects
  .filter((p) => p.placement === "table")
  .sort((a, b) => b.year - a.year);

export default function MoreProjects() {
  const t = useTranslations("MoreProjects");
  const tp = useTranslations("Projects");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <section id="mas-proyectos" className="section">
      <p className="section-label">{t("sectionLabel")}</p>
      <p className="text-text-secondary text-[15.5px] leading-[1.6] max-w-[62ch] -mt-4 mb-6">
        {t("subtitle")}
      </p>

      {/* A list, not a <table>: each row is a short story (title, what it
          does, stack, links), and a list reflows to one column on mobile
          without horizontal scroll. */}
      <ul className="flex flex-col border-t border-border">
        {rows.map((project) => (
          <li
            key={project.id}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-8 gap-y-3 py-6 border-b border-border"
          >
            <div className="flex flex-col gap-2 min-w-0">
              <p className="font-mono text-xs text-text-muted">
                {project.year} · {tp(`kind.${project.kind}`)}
              </p>
              <h3 className="font-sans font-medium text-lg text-text-primary leading-snug">
                {project.title[locale]}
              </h3>
              <p className="text-[15px] text-text-secondary leading-relaxed max-w-[72ch]">
                {project.description[locale]}
              </p>
              <ul
                aria-label={t("stackLabel")}
                className="flex flex-wrap gap-1.5 mt-1"
              >
                {project.stack.map((tech) => (
                  <li key={tech} className="tag tag-outline">
                    {tech}
                  </li>
                ))}
              </ul>
              {showPending && project.pending && project.pending.length > 0 && (
                <div
                  role="note"
                  data-testid="pending-notice"
                  className="mt-2 rounded-lg border-2 border-dashed border-warning bg-warning/10 p-3"
                >
                  <p className="font-mono text-xs font-medium text-warning mb-1">
                    FALTA (solo visible en desarrollo)
                  </p>
                  <ul className="list-disc pl-5 text-sm text-text-primary">
                    {project.pending.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-wrap md:flex-col md:items-end gap-2 md:pt-6">
              {project.repos.map((repo) => (
                <a
                  key={repo.href}
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title[locale]}: ${
                    project.repos.length > 1 ? repo.label : tp("links.repo")
                  }`}
                  className="btn-secondary inline-flex items-center gap-2 min-h-11 px-4 py-2 hover:bg-bg-hover"
                >
                  {project.repos.length > 1 ? repo.label : tp("links.repo")}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
