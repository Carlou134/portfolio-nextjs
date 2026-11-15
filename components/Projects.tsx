"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { isLiveDemo } from "@/lib/live-demo";
import { caseStudies } from "@/content/case-studies";
import {
  gridTodo,
  projects,
  type Project,
  type ProjectCategory,
} from "@/content/projects";

// Pending-content notices are a dev aid; production never renders them.
const showPending = process.env.NODE_ENV !== "production";

// Enter animation: fade + 6px on the standard curve, staggered by grid
// position. Cards that come back after a filter change remount, so they
// replay it.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

type Filter = "all" | ProjectCategory;
const filters: Filter[] = ["all", "front", "back", "data", "ops", "ai"];

const statusDot: Record<Project["status"], string> = {
  done: "bg-success",
  prod: "bg-success",
  wip: "bg-warning",
};
const statusText: Record<Project["status"], string> = {
  done: "text-success",
  prod: "text-success",
  wip: "text-warning",
};

// The case study route lands with commits 37-42; keep the URL in one place.
const caseStudyHref = (slug: string) => `/case-study/${slug}`;

function PendingNotice({
  items,
  previewHref,
}: {
  items: string[];
  previewHref?: string;
}) {
  return (
    <div
      role="note"
      data-testid="pending-notice"
      className="rounded-lg border-2 border-dashed border-warning bg-warning/10 p-4"
    >
      <p className="font-mono text-sm font-medium text-warning mb-2">
        FALTA (solo visible en desarrollo)
      </p>
      <ul className="list-disc pl-5 text-sm text-text-primary flex flex-col gap-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {previewHref && (
        <Link
          href={previewHref}
          className="inline-flex items-center gap-2 min-h-11 mt-2 font-mono text-sm text-warning underline underline-offset-4"
        >
          Ver vista preliminar del case study →
        </Link>
      )}
    </div>
  );
}

function EvidenceLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary inline-flex items-center gap-2 min-h-11 px-4 py-2 hover:bg-bg-hover"
    >
      {children}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );
}

function ProjectCard({
  project,
  index,
  locale,
  today,
}: {
  project: Project;
  index: number;
  locale: "es" | "en";
  today: string;
}) {
  const t = useTranslations("Projects");
  const title = project.title[locale];
  const live = isLiveDemo(project.demo, today);
  // Unpublished case study: reachable from the dev-only notice, never from
  // the public "Read case study" button (that one needs caseSlug).
  const preview = project.caseSlug
    ? undefined
    : caseStudies.find((c) => c.projectId === project.id);

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      className="card flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 font-mono text-xs ${statusText[project.status]}`}
        >
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${statusDot[project.status]}`}
          />
          {t(`status.${project.status}`)}
        </span>
        <span className="font-mono text-xs text-text-muted">
          {project.year} · {t(`kind.${project.kind}`)}
        </span>
      </div>

      {/* Every screenshot gets the same 16:9 frame, cropped from the top, so
          captures from different apps still line up across the grid. */}
      {project.image && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-bg-secondary">
          <Image
            src={project.image}
            alt={t("imageAlt", { title })}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover object-top"
          />
        </div>
      )}

      <h3 className="font-sans font-medium text-xl text-text-primary text-balance leading-snug">
        {title}
      </h3>
      <p className="text-base text-text-secondary leading-relaxed">
        {project.description[locale]}
      </p>

      {project.metrics.length > 0 && (
        <dl className="grid grid-cols-3 gap-3">
          {project.metrics.map((m) => (
            <div
              key={m.value}
              className="flex flex-col-reverse pl-3 border-l-2 border-brand/50"
            >
              {/* dt first for screen readers; flex-col-reverse puts the
                  value on top visually. */}
              <dt className="text-xs text-text-muted mt-0.5">
                {m.label[locale]}
              </dt>
              <dd className="font-mono text-xl text-accent leading-tight">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <li key={tech} className="tag tag-accent">
            {tech}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2.5 mt-auto">
        {project.caseSlug && (
          <Link
            href={caseStudyHref(project.caseSlug)}
            className="btn-primary inline-flex items-center gap-2 min-h-11 px-4 py-2"
          >
            {t("links.caseStudy")} <span aria-hidden="true">→</span>
          </Link>
        )}
        {project.repos.map((repo) => (
          <EvidenceLink key={repo.href} href={repo.href}>
            {project.repos.length > 1 ? repo.label : t("links.repo")}
          </EvidenceLink>
        ))}
        {live && project.demo && (
          <EvidenceLink href={project.demo.href}>
            {t("links.demo")}
          </EvidenceLink>
        )}
        {project.video && (
          <EvidenceLink href={project.video}>{t("links.video")}</EvidenceLink>
        )}
      </div>

      {project.footer && (
        <p className="text-xs font-mono text-text-muted border-t border-border pt-3">
          {project.footer[locale]}
        </p>
      )}

      {/* An empty list is truthy: check the length, or a card with nothing
          pending still draws an empty notice. */}
      {showPending && project.pending && project.pending.length > 0 && (
        <PendingNotice
          items={project.pending}
          previewHref={preview ? caseStudyHref(preview.slug) : undefined}
        />
      )}
    </motion.article>
  );
}

export default function Projects() {
  const t = useTranslations("Projects");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const [filter, setFilter] = useState<Filter>("all");

  const grid = projects.filter((p) => p.placement === "grid");
  const shown =
    filter === "all" ? grid : grid.filter((p) => p.categories.includes(filter));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="proyectos" className="section">
      <h2 className="section-heading">{t("sectionLabel")}</h2>
      <p className="text-text-secondary text-base leading-[1.6] max-w-[62ch] -mt-4 mb-6">
        {t("subtitle")}
      </p>

      <div
        role="group"
        aria-label={t("filterLabel")}
        className="flex flex-wrap items-center gap-2.5 mb-3"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted mr-1">
          {t("filterBy")}
        </span>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className="filter"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {t(`filters.${f}`)}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="font-mono text-[13px] text-accent mb-6">
        {t("count", {
          shown: shown.length,
          total: grid.length,
          filter: t(`filters.${filter}`),
        })}
      </p>

      {showPending && gridTodo.length > 0 && (
        <div className="mb-6">
          <PendingNotice items={gridTodo} />
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-text-muted">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shown.map((project, index) => (
            <ProjectCard
              key={`${filter}-${project.id}`}
              project={project}
              index={index}
              locale={locale}
              today={today}
            />
          ))}
        </div>
      )}
    </section>
  );
}
