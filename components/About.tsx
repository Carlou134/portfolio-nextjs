"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

// Same entrance as the Hero: fade + 6px, 300ms on the standard curve.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

// Every figure here is sourced from content/experience.ts — no invented
// numbers. Years and English level live in the Hero, so they're left out.
const metrics = ["modules", "speed", "meetings"] as const;

export default function About() {
  const t = useTranslations("About");

  return (
    <section id="sobre-mi" className="section">
      <p className="section-label">{t("sectionLabel")}</p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        custom={0}
        className="flex flex-col gap-5"
      >
        <h2 className="font-sans font-medium leading-tight text-balance text-[clamp(1.75rem,4vw,2rem)] max-w-[26ch]">
          {t("heading")}
        </h2>
        <p className="text-text-secondary text-[17px] leading-[1.6] max-w-[62ch] text-pretty">
          {t("bio")}
        </p>
      </motion.div>

      <motion.ul
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        custom={1}
        className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {metrics.map((key, i) => (
          <li
            key={key}
            className={`pl-4 border-l-2 ${i === 0 ? "border-accent" : "border-brand/50"}`}
          >
            <p className="font-mono text-[26px] text-accent leading-tight mb-1">
              {t(`metrics.${key}.value`)}
            </p>
            <p className="text-sm text-text-secondary leading-snug">
              {t(`metrics.${key}.label`)}
            </p>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
