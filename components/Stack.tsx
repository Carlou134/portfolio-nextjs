"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

// Same entrance as the other sections: fade + 6px, 300ms on the standard curve.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

// Grouped by layer, mockup order. Within each layer, what's used daily goes
// first. Text-only tags: brand-colored icons clashed with the indigo palette
// and left gaps where a technology had no icon.
// The daily core gets the accent tag so a reader spots the strongest skills
// at a glance; everything else stays neutral.
const core = new Set(["C# / .NET", "Next.js", "React 19", "Kotlin / Ktor"]);
const layers = [
  {
    key: "frontend",
    items: [
      "React 19",
      "Next.js",
      "Angular",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "TanStack Query",
    ],
  },
  {
    key: "backend",
    items: [
      "C# / .NET",
      "ASP.NET MVC",
      "Kotlin / Ktor",
      "Node.js",
      "Python / Django",
      "Java / Spring Boot",
      "REST + Swagger",
      "Clean Architecture",
      "Hexagonal",
      "CQRS",
      "xUnit",
    ],
  },
  {
    key: "data",
    items: [
      "SQL Server",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Entity Framework",
      "ADO.NET",
      "Pandas",
      "Power BI",
    ],
  },
  {
    key: "devops",
    items: [
      "Azure",
      "Azure DevOps",
      "GitLab CI/CD",
      "Docker",
      "Git",
      "AWS",
      "MinIO",
      "Blob Storage",
      "IIS",
      "Power Automate",
    ],
  },
  {
    key: "ai",
    items: [
      "scikit-learn",
      "Random Forest",
      "LightGBM",
      "SHAP",
      "NIST CSF",
      "Claude API",
    ],
  },
] as const;

export default function Stack() {
  const t = useTranslations("Stack");

  return (
    <section id="stack" className="section">
      <p className="section-label">{t("sectionLabel")}</p>
      <p className="text-text-secondary text-[15.5px] leading-[1.6] max-w-[62ch] -mt-4 mb-8">
        {t("subtitle")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {layers.map(({ key, items }, i) => (
          <motion.div
            key={key}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={i}
            className="card flex flex-col gap-3 hover:border-brand/45"
          >
            <h3 className="flex items-center gap-2 font-sans font-medium text-[17px] text-text-primary">
              <span className="font-mono text-[13px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t(`categories.${key}`)}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <li
                  key={item}
                  className={core.has(item) ? "tag tag-accent" : "tag"}
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
