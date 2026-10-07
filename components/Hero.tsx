"use client";

import { useId } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isLocale } from "@/i18n/locale";
import { cvFileByLocale } from "@/lib/cv";

// Same entrance as the `enter` keyframes in globals.css: fade + 6px,
// --duration-base (300ms) on the standard curve.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Availability is the first segment of the meta line; it reads as the
// status, the rest (timezone, English level) as secondary detail. The dot
// repeats it visually, so the status never depends on color alone.
function Availability({ text }: { text: string }) {
  const [status, ...rest] = text.split(" · ");
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] text-text-primary">
      <span
        className="size-2 rounded-full bg-accent ring-[3px] ring-accent/25"
        aria-hidden="true"
      />
      {status}
      {rest.length > 0 && (
        // Own line on purpose: wrapping naturally left a dangling "·" at
        // the start of the second line. The separator stays for screen
        // readers, so textContent still equals the message.
        <span className="basis-full pl-4 text-text-muted">
          <span className="sr-only"> · </span>
          {rest.join(" · ")}
        </span>
      )}
    </p>
  );
}

function ProfileCard() {
  const t = useTranslations("Hero");

  return (
    // Photo beside the text from sm up, never wrapped below it: the
    // availability line wraps inside its own <p> instead.
    <div className="card flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      {/* The photo's white backdrop was the brightest area on screen and
          pulled focus from the headline: dim it slightly and edge it. */}
      <div className="relative shrink-0 size-28 md:size-30 lg:size-34 rounded-xl overflow-hidden ring-1 ring-border brightness-90">
        <Image
          src="/Foto-Linkedin.jpeg"
          alt={t("photoAlt")}
          fill
          sizes="136px"
          loading="eager"
          className="object-cover object-top"
        />
      </div>

      <div className="flex flex-col gap-2.5 min-w-0">
        {/* A proper name isn't translated, so it isn't a message. */}
        {/* Same weight as the h1 (500): heavier here inverted the hierarchy. */}
        <p className="text-2xl font-medium tracking-tight text-text-primary">
          Carlos Vásquez
        </p>
        <p className="kicker">{t("kicker")}</p>
        <Availability text={t("meta")} />
      </div>
    </div>
  );
}

// Static on purpose: a recruiter scans the hero in seconds and won't type
// commands. Each line carries a plain-language label so the shell framing
// adds flavor without hiding what the fact is about.
function ProfileTerminal() {
  const t = useTranslations("Hero.terminal");
  const titleId = useId();
  const lines = [
    {
      label: t("thesisLabel"),
      command: t("thesisCommand"),
      output: t.rich("thesis", {
        hl: (chunks) => (
          <strong className="font-medium text-accent">{chunks}</strong>
        ),
      }),
    },
    { label: t("nowLabel"), command: t("nowCommand"), output: t("now") },
  ];

  return (
    <figure className="card p-0 overflow-hidden" aria-labelledby={titleId}>
      <figcaption className="flex items-center gap-2 px-4 py-3 border-b border-border">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-2.5 rounded-full bg-text-muted/40"
            aria-hidden="true"
          />
        ))}
        <span id={titleId} className="ml-2 font-mono text-xs text-text-muted">
          perfil.sh
        </span>
      </figcaption>

      <div className="flex flex-col gap-5 p-5 lg:p-6 font-mono text-sm lg:text-[15px] leading-relaxed">
        {lines.map((line) => (
          <div key={line.command}>
            <p className="mb-1 font-sans text-[13px] lg:text-sm text-text-secondary">
              {line.label}
            </p>
            <p>
              <span className="text-accent" aria-hidden="true">
                ${" "}
              </span>
              <span className="text-text-primary">{line.command}</span>
            </p>
            <p className="text-text-secondary">{line.output}</p>
          </div>
        ))}
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
      // Fills the first screen: the hero is the whole first impression, so
      // the next section only starts below the fold. pt-20 clears the fixed
      // h-20 navbar; svh (not vh) so mobile browser chrome doesn't cut it.
      className="section relative min-h-svh flex flex-col justify-center pt-20"
    >
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      {/* The headline opens the page; identity and proof sit in the right
          column, centered against the left one so neither leaves a gap
          below it when their heights differ. */}
      {/* Two columns only from lg: below that each column is ~330px and the
          headline crowds the profile card, so they stack instead. */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:items-center">
        <div className="flex flex-col gap-8 lg:gap-10">
          {/* Not animated: the h1 is the LCP element, and fading it in
              would delay the metric. */}
          {/* 42px (the guide's H1) up to laptop widths; from lg it scales
              up to 48px. Capped there: at 56px the half-width column broke
              it into 6 lines and the left column towered over the right. */}
          <h1 className="font-sans font-medium leading-tight tracking-tight text-balance text-[clamp(2rem,5vw,2.625rem)] lg:text-[clamp(2.625rem,3vw,3rem)]">
            {t("headline")}
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-text-secondary text-[17px] lg:text-[19px] leading-[1.6] max-w-[56ch] text-pretty"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            // Phones: primary CTA full width, then CV + GitHub sharing a
            // row — otherwise GitHub wrapped alone onto a third line.
            className="grid grid-cols-[1fr_auto] gap-3 sm:flex sm:items-stretch"
          >
            <a
              href="#proyectos"
              className="btn-primary col-span-2 inline-flex items-center justify-center gap-2"
            >
              {t("viewProjects")} <span aria-hidden="true">↓</span>
            </a>

            <a
              // The navbar watches this id to hide its own CV button while
              // this one is on screen.
              id="hero-cv"
              href={cvFileByLocale[locale]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              {t("downloadCv")}
              <span
                className="font-mono text-xs text-text-muted"
                aria-hidden="true"
              >
                PDF
              </span>
            </a>

            <Link
              href="https://github.com/Carlou134"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-11 min-w-11 px-4 rounded-lg border border-border hover:border-border-hover text-text-secondary hover:text-text-primary transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon />
            </Link>
          </motion.div>
        </div>

        <motion.aside
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          aria-label={t("profileLabel")}
          className="flex flex-col gap-5"
        >
          <ProfileCard />
          <ProfileTerminal />
        </motion.aside>
      </div>
    </section>
  );
}
