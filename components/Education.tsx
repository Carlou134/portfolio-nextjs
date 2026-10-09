"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

// Same entrance as the Hero and About: fade + 6px, 300ms on the standard curve.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

// Mockup order: degree, language certification, focus. Only the first two
// carry a footnote line, so the note key is optional per card.
const cards = [
  { key: "degree", hasNote: true, logo: { src: "/upc.png", alt: "UPC" } },
  {
    key: "english",
    hasNote: true,
    logo: { src: "/britanico.png", alt: "Británico" },
  },
  { key: "focus", hasNote: false, logo: null },
] as const;

export default function Education() {
  const t = useTranslations("Education");

  return (
    <section id="educacion" className="section">
      <p className="section-label">{t("sectionLabel")}</p>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map(({ key, hasNote, logo }, i) => (
          <motion.li
            key={key}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={i}
            className="group card flex flex-col gap-2 hover:border-brand/45 motion-safe:hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {t(`cards.${key}.kicker`)}
              </p>
              {/* Institution reds clash with the indigo palette, so logos sit
                  in grayscale and only show their brand color on hover. */}
              {logo && (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={28}
                  height={28}
                  className="rounded-sm grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                />
              )}
            </div>
            <h3 className="font-sans font-medium text-lg text-text-primary text-balance leading-snug">
              {t(`cards.${key}.title`)}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed flex-1 whitespace-pre-line">
              {t(`cards.${key}.body`)}
            </p>
            {hasNote && (
              <p
                className={`font-mono text-xs leading-relaxed ${
                  key === "degree" ? "text-accent" : "text-text-muted"
                }`}
              >
                {t(`cards.${key}.note`)}
              </p>
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
