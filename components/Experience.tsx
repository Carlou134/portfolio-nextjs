"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { experiences, type Experience } from "@/content/experience";

const HIGHLIGHT_PATTERN =
  /(\+10 (?:módulos|(?:enterprise )?modules)|20%|15%|40%)/g;

function Highlighted({ text }: { text: string }) {
  // split() with a capturing group keeps the matches, always at odd indexes.
  return text.split(HIGHLIGHT_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-text-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
  const t = useTranslations("Experience");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
    >
      {/* Dot sobre la línea */}
      <div className="absolute -left-8 md:-left-12 top-1.5 flex items-center justify-center">
        {exp.current ? (
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
            <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-accent-green" />
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
        )}
      </div>

      {/* Contenido */}
      <motion.div
        className="card hover:border-accent-green/30 hover:glow-green transition-all duration-300"
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="font-mono font-medium text-base text-text-primary">
              {exp.company}
            </h3>
            <p className="font-mono text-sm mt-0.5 text-accent-green">
              {exp.role[locale]}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-xs text-text-muted">
              {exp.period[locale]}
            </span>
            {exp.current && (
              <span className="badge-green text-[10px] px-2 py-0.5">
                {t("current")}
              </span>
            )}
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {exp.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed"
            >
              <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0 bg-accent-green" />
              <span>
                <Highlighted text={bullet[locale]} />
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default function Experience() {
  const t = useTranslations("Experience");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experiencia" className="section">
      <p className="section-label">{t("sectionLabel")}</p>

      <div
        ref={containerRef}
        className="relative"
        style={{ position: "relative" }}
      >
        {/* Línea de fondo (gris) */}
        <div className="absolute left-0 top-0 w-px h-full bg-border" />

        {/* Línea animada (verde) */}
        <motion.div
          className="absolute left-0 top-0 w-px origin-top bg-accent-green"
          style={{ scaleY, height: "100%" }}
        />

        {/* Items */}
        <div className="flex flex-col gap-12 pl-8 md:pl-12">
          {experiences.map((exp, index) => (
            <ExperienceItem key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
