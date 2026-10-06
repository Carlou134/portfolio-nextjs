"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { projects, type Project } from "@/content/projects";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function Badge({
  color,
  label,
}: {
  color: Project["badgeColor"];
  label: string;
}) {
  if (color === "pink") {
    return (
      <span className="badge bg-pink-900/20 border border-pink-500/40 text-pink-400 text-xs font-mono px-3 py-1 rounded-full tracking-wide">
        {label}
      </span>
    );
  }
  return <span className={`badge-${color}`}>{label}</span>;
}

function ProjectImage({
  src,
  alt,
  eager = false,
  aspect = "aspect-video",
  grow = false,
  sizes,
  fit = "cover",
}: {
  src: string;
  alt: string;
  eager?: boolean;
  aspect?: string;
  grow?: boolean;
  sizes: string;
  fit?: "cover" | "contain";
}) {
  const [hasError, setHasError] = useState(false);
  const fileName = src.split("/").pop() ?? src;
  const containerClass = grow
    ? "relative w-full flex-1 min-h-0"
    : `relative w-full ${aspect}`;

  if (hasError) {
    return (
      <div
        className={`${containerClass} rounded-lg bg-bg-secondary overflow-hidden flex items-center justify-center`}
      >
        <span className="font-mono text-xs text-text-muted">{fileName}</span>
      </div>
    );
  }

  return (
    <div className={`${containerClass} rounded-lg overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className={fit === "contain" ? "object-contain" : "object-cover"}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function Projects() {
  const t = useTranslations("Projects");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <section id="proyectos" className="section">
      <p className="section-label">{t("sectionLabel")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project, index) => {
          const isFeatured = project.featured;
          const isLast = project.id === 4;

          return (
            <motion.div
              key={project.id}
              className={[
                isFeatured ? "card-featured" : "card",
                isFeatured ? "md:col-span-2 md:row-span-2" : "",
                isLast ? "md:col-span-3" : "",
                isFeatured
                  ? "motion-safe:hover:scale-101"
                  : "motion-safe:hover:scale-102",
                "hover:border-accent/50 hover:glow-accent transition-all duration-300",
                "flex flex-col gap-4",
              ]
                .filter(Boolean)
                .join(" ")}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              {/* Badge + Links */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge
                  color={project.badgeColor}
                  label={project.badge[locale]}
                />
                {project.links.length > 0 && (
                  <div className="flex gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 min-h-11 text-xs font-mono text-text-secondary hover:text-accent transition-colors"
                      >
                        {link.label}
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              {project.image && (
                <ProjectImage
                  src={project.image}
                  alt={project.title[locale]}
                  eager={isFeatured || isLast}
                  grow={isFeatured}
                  sizes={
                    isFeatured
                      ? "(max-width: 768px) 100vw, 66vw"
                      : isLast
                        ? "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                        : "(max-width: 768px) 100vw, 33vw"
                  }
                  fit={isLast ? "contain" : "cover"}
                />
              )}

              {/* Title */}
              <h3
                className={[
                  "font-mono text-text-primary",
                  isFeatured ? "text-xl font-bold" : "text-base font-medium",
                ].join(" ")}
              >
                {project.title[locale]}
              </h3>

              {/* Description */}
              <p
                className={[
                  "text-sm text-text-secondary leading-relaxed",
                  "",
                ].join(" ")}
              >
                {project.description[locale]}
              </p>

              {/* Metrics (featured only) */}
              {isFeatured && project.metrics.length > 0 && (
                <div className="bg-bg-secondary border border-border p-3 rounded-lg flex gap-6">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-mono text-2xl text-accent">
                        {m.value}
                      </span>
                      <p className="text-xs text-text-muted mt-0.5">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Stack */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.stack.map((tech) => (
                  <span key={tech} className="stack-tag">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer */}
              {project.footer && (
                <p className="text-xs font-mono text-text-muted border-t border-border pt-3">
                  {project.footer[locale]}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
