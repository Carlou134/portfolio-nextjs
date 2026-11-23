import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { CaseStudy as CaseStudyData } from "@/content/case-studies";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="flex flex-col gap-4"
    >
      <h2 id={`${id}-h`} className="font-sans font-medium text-[27px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

const prose = "text-text-secondary leading-[1.65] max-w-[62ch]";

// Content (data) arrives already in the request's locale; the fixed UI
// strings come from the CaseStudy messages namespace.
export default function CaseStudy({ data }: { data: CaseStudyData }) {
  const t = useTranslations("CaseStudy");

  return (
    <article className="max-w-[900px] mx-auto px-6 pt-9 pb-24">
      <Link
        href="/#proyectos"
        className="inline-flex items-center gap-2 min-h-11 font-mono text-[13px] text-text-secondary hover:text-accent"
      >
        <span aria-hidden="true">←</span> {t("back")}
      </Link>

      <header className="pt-4 pb-11">
        <p className="kicker">{data.kicker}</p>
        <h1 className="font-sans font-medium text-[clamp(32px,4.4vw,46px)] leading-tight max-w-[24ch] mb-5">
          {data.title}
        </h1>
        <ul className="flex flex-wrap gap-1.5 mb-6">
          {data.tags.map((tag) => (
            <li key={tag} className="tag tag-accent">
              {tag}
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border font-mono text-[13px]">
          {data.meta.map((m) => (
            <div key={m.label}>
              <dt className="text-text-muted mb-1">{m.label}</dt>
              <dd className="text-text-primary">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="flex flex-col gap-14">
        <Section id="cs-contexto" title={t("sections.context")}>
          {data.context.map((p) => (
            <p key={p} className={prose}>
              {p}
            </p>
          ))}
        </Section>

        <Section id="cs-rol" title={t("sections.role")}>
          <p className={prose}>{data.rolePara}</p>
          <ol className="flex flex-col gap-4">
            {data.decisions.map((d, i) => (
              <li key={d.title} className="card flex flex-col gap-1.5">
                <h3 className="font-sans font-medium text-base">
                  <span className="font-mono text-[13px] text-accent">
                    {String(i + 1).padStart(2, "0")} ·{" "}
                  </span>
                  {d.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed">
                  {d.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="cs-arquitectura" title={t("sections.architecture")}>
          <p className={prose}>{data.archIntro}</p>
          <figure className="card overflow-x-auto">
            <div className="flex items-stretch gap-3 min-w-[640px]">
              {data.flow.map((col, i) => (
                <div key={col.stage} className="contents">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="self-center font-mono text-xl text-accent"
                    >
                      →
                    </span>
                  )}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {col.stage}
                    </p>
                    {col.boxes.map((b) => (
                      <div
                        key={b.title}
                        className="rounded-lg border border-border p-3"
                      >
                        <p className="font-mono text-[13.5px]">{b.title}</p>
                        <p className="font-mono text-[11.5px] text-text-muted mt-1">
                          {b.sub}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <figcaption className="text-xs text-text-muted mt-4">
              {data.flowCaption}
            </figcaption>
          </figure>
          <h3 className="font-sans font-medium text-[19px] mt-2">{t("why")}</h3>
          {data.archWhy.map((p) => (
            <p key={p} className={prose}>
              {p}
            </p>
          ))}
        </Section>

        <Section id="cs-capturas" title={t("sections.screenshots")}>
          {/* One column at full article width: these are dense UI screenshots,
              and at half width their text is unreadable. Each one links to the
              original PNG, because next/image serves a resized copy. */}
          <div className="flex flex-col gap-8">
            {data.screenshots.map((s) => (
              <figure key={s.src}>
                <a
                  href={s.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("openFull", { caption: s.caption })}
                  className="block rounded-lg overflow-hidden border border-border transition-colors hover:border-brand/45"
                >
                  <Image
                    src={s.src}
                    alt={s.caption}
                    width={1920}
                    height={1032}
                    sizes="(max-width: 900px) 100vw, 852px"
                    className="w-full h-auto"
                  />
                </a>
                <figcaption className="text-xs text-text-muted mt-2">
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="cs-codigo" title={t("sections.snippet")}>
          <div className="card p-0 overflow-hidden">
            <div className="code-header">
              <span>{data.snippet.file}</span>
              <span>{data.snippet.lang}</span>
            </div>
            <pre className="code-body font-mono text-[13.5px]">
              <code>{data.snippet.code}</code>
            </pre>
          </div>
          <p className="font-mono text-xs text-text-muted">
            {data.snippet.note}
          </p>
        </Section>

        {data.video && (
          <Section id="cs-video" title={t("sections.video")}>
            {/* youtube-nocookie: no tracking cookies until play. loading="lazy":
                the player is heavy and sits far below the fold. */}
            <figure>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-bg-secondary">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${data.video.youtubeId}`}
                  title={t("videoTitle", { title: data.title })}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <figcaption className="text-xs text-text-muted mt-2">
                {data.video.caption}
              </figcaption>
            </figure>
          </Section>
        )}

        <Section id="cs-resultados" title={t("sections.results")}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {data.results.map((r) => (
              <div key={r.value} className="pl-4 border-l-2 border-brand/60">
                <p className="font-mono text-3xl text-accent">{r.value}</p>
                <p className="text-base text-text-secondary mt-1">{r.label}</p>
              </div>
            ))}
          </div>
          <p className={prose}>{data.tradeoff}</p>
          <p className={prose}>{data.validation}</p>
          <h3 className="font-sans font-medium text-[19px] mt-2">
            {t("learnings")}
          </h3>
          <ul className="list-disc pl-5 flex flex-col gap-2.5 text-text-secondary max-w-[72ch]">
            {data.learnings.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </Section>
      </div>
    </article>
  );
}
