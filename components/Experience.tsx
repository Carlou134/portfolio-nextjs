'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Bilingual {
  es: string
  en: string
}

interface Experience {
  id: number
  company: string
  role: Bilingual
  period: Bilingual
  current: boolean
  bullets: Bilingual[]
}

const experiences: Experience[] = [
  {
    id: 1,
    company: 'Zoluxiones Latam',
    role: { es: 'Practicante Pre Profesional de desarrollo', en: 'Pre-Professional Developer Intern' },
    period: { es: 'Mar 2026 – Actualidad', en: 'Mar 2026 – Present' },
    current: true,
    bullets: [
      {
        es: 'Desarrollo de aplicaciones con Next.js, Node.js y Redis — mejora de eficiencia del 15%.',
        en: 'Built applications with Next.js, Node.js, and Redis — 15% efficiency improvement.',
      },
      {
        es: 'Backend en C# con ADO.NET nativo, endpoints REST y control de roles por tabla vía stored procedures.',
        en: 'C# backend with native ADO.NET, REST endpoints, and table-level role control via stored procedures.',
      },
      {
        es: 'Herramienta interna estilo Jira que redujo reuniones de coordinación en 40%.',
        en: 'Internal Jira-style task tool that cut coordination meetings by 40%.',
      },
      {
        es: 'Migración de microservicio legacy a Kotlin; API Kotlin con interfaz visual para robots.',
        en: 'Migrated a legacy microservice to Kotlin; built a Kotlin API with a visual interface for robot control.',
      },
      {
        es: 'App Android con WebSockets. Contenerización con Docker y pipelines CI/CD en GitLab.',
        en: 'Android app with WebSockets. Containerization with Docker and CI/CD pipelines in GitLab.',
      },
    ],
  },
  {
    id: 2,
    company: 'MSC Perú',
    role: { es: 'Practicante de IT', en: 'IT Intern' },
    period: { es: 'Dic 2023 – Feb 2026', en: 'Dec 2023 – Feb 2026' },
    current: false,
    bullets: [
      {
        es: 'Construcción de +10 módulos empresariales en producción bajo Clean Architecture y CQRS.',
        en: 'Built +10 enterprise modules in production under Clean Architecture and CQRS.',
      },
      {
        es: 'Migración de sistemas legacy (jQuery) a Angular — mejora estimada del 20% en velocidad de respuesta.',
        en: 'Migrated legacy systems (jQuery) to Angular — an estimated 20% improvement in response speed.',
      },
      {
        es: 'Automatización con Python/Pandas y Power Automate.',
        en: 'Automation with Python/Pandas and Power Automate.',
      },
      {
        es: 'Gestión en Azure DevOps bajo Scrum.',
        en: 'Project management in Azure DevOps under Scrum.',
      },
    ],
  },
]

const copy = {
  sectionLabel: { es: 'Experiencia', en: 'Experience' },
  current: { es: 'Actual', en: 'Current' },
}

function highlightBullet(text: string): string {
  return text
    .replace(/\+10 (módulos|modules)/g, '<strong class="text-text-primary">+10 $1</strong>')
    .replace(/20%/g, '<strong class="text-text-primary">20%</strong>')
    .replace(/15%/g, '<strong class="text-text-primary">15%</strong>')
    .replace(/40%/g, '<strong class="text-text-primary">40%</strong>')
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
  const { lang } = useLanguage()

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
    >
      {/* Dot sobre la línea */}
      <div className="absolute -left-8 md:-left-12 top-1.5 flex items-center justify-center">
        {exp.current ? (
          <div className="relative">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: '#00E5A0' }}
            />
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: '#00E5A0' }}
            />
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
            <p className="font-mono text-sm mt-0.5" style={{ color: '#00E5A0' }}>
              {exp.role[lang]}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-xs text-text-muted">{exp.period[lang]}</span>
            {exp.current && (
              <span className="badge-green text-[10px] px-2 py-0.5">{copy.current[lang]}</span>
            )}
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {exp.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed"
            >
              <span
                className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#00E5A0' }}
              />
              <span dangerouslySetInnerHTML={{ __html: highlightBullet(bullet[lang]) }} />
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section id="experiencia" className="section">
      <p className="section-label">{copy.sectionLabel[lang]}</p>

      <div ref={containerRef} className="relative" style={{ position: 'relative' }}>
        {/* Línea de fondo (gris) */}
        <div className="absolute left-0 top-0 w-px h-full bg-border" />

        {/* Línea animada (verde) */}
        <motion.div
          className="absolute left-0 top-0 w-px origin-top"
          style={{ scaleY, height: '100%', backgroundColor: '#00E5A0' }}
        />

        {/* Items */}
        <div className="flex flex-col gap-12 pl-8 md:pl-12">
          {experiences.map((exp, index) => (
            <ExperienceItem key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
