"use client";

import { Fragment, useId } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { cvFileByLocale } from "@/lib/cv";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// "Role · City, Country" never fits one line beside the photo, and wrapping
// it left a dangling "·". So each segment gets its own line; the separator
// stays for screen readers (and textContent stays identical to the message).
function StackedSegments({ text }: { text: string }) {
  return text.split(" · ").map((segment, i) => (
    <Fragment key={segment}>
      {i > 0 && <span className="sr-only"> · </span>}
      <span className="block">{segment}</span>
    </Fragment>
  ));
}

function ConvergeMotif({ label }: { label: string }) {
  return (
    <svg
      className="converge max-w-85"
      viewBox="0 0 320 84"
      role="img"
      aria-label={label}
    >
      <path className="ln" d="M4 12 C 120 12, 170 42, 246 42" />
      <path className="ln" d="M4 32 C 110 32, 168 42, 246 42" />
      <path className="ln ln-soft" d="M4 52 C 110 52, 168 42, 246 42" />
      <path className="ln ln-soft" d="M4 72 C 120 72, 170 42, 246 42" />
      <circle className="halo" cx="246" cy="42" r="11" />
      <circle className="node" cx="246" cy="42" r="3.5" />
    </svg>
  );
}

// Static on purpose: a recruiter scans the hero in seconds and won't type
// commands, so the facts are shown, not hidden behind an input.
function ProfileTerminal() {
  const t = useTranslations("Hero.terminal");
  const titleId = useId();
  const lines = [
    { command: "whoami", output: t("whoami") },
    { command: "stack --core", output: t("stack") },
    { command: "cat estado.txt", output: t("status") },
  ];

  return (
    <figure
      className="card p-0 overflow-hidden self-center"
      aria-labelledby={titleId}
    >
      <figcaption className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="w-3 h-3 rounded-full bg-error/70" aria-hidden="true" />
        <span
          className="w-3 h-3 rounded-full bg-warning/70"
          aria-hidden="true"
        />
        <span
          className="w-3 h-3 rounded-full bg-success/70"
          aria-hidden="true"
        />
        <span id={titleId} className="ml-2 font-mono text-xs text-text-muted">
          perfil.sh
        </span>
      </figcaption>

      <div className="p-5 font-mono text-sm leading-relaxed">
        {lines.map((line) => (
          <div key={line.command}>
            <p>
              <span className="text-accent">$</span>{" "}
              <span className="text-text-primary">{line.command}</span>
            </p>
            <p className="text-text-secondary">{line.output}</p>
          </div>
        ))}
        <p>
          <span className="text-accent">$</span>{" "}
          <span className="animate-caret text-text-primary" aria-hidden="true">
            ▌
          </span>
        </p>
      </div>
    </figure>
  );
}

export default function Hero() {
  const t = useTranslations("Hero");
  // next-intl's useLocale() types as plain `string` (no module augmentation
  // configured), so it can't index cvFileByLocale on its own — narrow it with
  // our own guard instead of casting past the compiler.
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <section
      id="inicio"
      className="section min-h-screen flex items-center relative"
    >
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full relative z-10">
        {/* Left column */}
        <div className="flex flex-col justify-center gap-6">
          <div className="flex items-center gap-5 md:gap-7">
            {/* Same framing as the About photo: square, top-anchored so the
                face and shoulders fill it, accent hairline on top. */}
            <div className="relative shrink-0 size-32 md:size-44">
              <div className="relative size-full rounded-xl overflow-hidden">
                <Image
                  src="/Foto-Linkedin.jpeg"
                  alt={t("photoAlt")}
                  fill
                  sizes="(min-width: 768px) 176px, 128px"
                  loading="eager"
                  className="object-cover object-top"
                />
              </div>
              <div
                className="absolute inset-0 rounded-xl border-2 border-brand/45 pointer-events-none"
                aria-hidden="true"
              />
              {/* Echoes the meta line's "open to offers". */}
              <div
                className="absolute -bottom-2 -right-2 flex items-center justify-center size-5 rounded-full bg-bg-primary"
                aria-hidden="true"
              >
                <div className="size-3 rounded-full bg-success animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              {/* A proper name isn't translated, so it isn't a message. */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary"
              >
                Carlos Vásquez
              </motion.p>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="kicker text-[13px] md:text-sm"
              >
                <StackedSegments text={t("kicker")} />
              </motion.p>
            </div>
          </div>

          {/* Not animated: the h1 is the LCP element, and fading it in
              would delay the metric. */}
          <h1 className="font-sans font-medium leading-tight text-[clamp(2rem,5vw,2.625rem)]">
            {t("headline")}
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-text-secondary text-[17px] leading-[1.6]"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex gap-4 flex-wrap items-center"
          >
            <a href="#proyectos" className="btn-primary">
              {t("viewProjects")} <span aria-hidden="true">↓</span>
            </a>

            <a
              href={cvFileByLocale[locale]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t("downloadCv")}
            </a>

            <Link
              href="https://github.com/Carlou134"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-11 min-w-11 p-3 rounded-lg border border-border hover:border-border-hover text-text-secondary hover:text-text-primary transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <ConvergeMotif label={t("convergeAlt")} />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="font-mono text-xs text-text-muted"
          >
            {t("meta")}
          </motion.p>
        </div>

        {/* Right column — static profile terminal */}
        <ProfileTerminal />
      </div>
    </section>
  );
}
