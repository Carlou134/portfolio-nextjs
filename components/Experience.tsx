'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'

interface Experience {
  id: number
  company: string
  role: string
  period: string
  current: boolean
  bullets: string[]
}

const experiences: Experience[] = [
  {
    id: 1,
    company: 'Zoluxiones Latam',
    role: 'Practicante Pre Profesional',
    period: 'Mar 2026 – Actualidad',
    current: true,
    bullets: [
      'Desarrollo de aplicaciones con Next.js y Node.js.',
      'Contenerización con Docker y pipelines CI/CD en GitLab.',
      'Proyecto estratégico presentado ante gerencia para optimización de eficiencia operativa.',
    ],
  },
  {
    id: 2,
    company: 'Fractal Soluciones TI',
    role: 'Software Developer Trainee',
    period: 'Mar 2026 – Actualidad',
    current: true,
    bullets: [
      'Interfaces con React 19 y shadcn/UI, estado con Zustand y TanStack Query.',
      'APIs en .NET bajo Clean Architecture con integración de servicios OpenAI.',
      'Despliegue en AWS.',
    ],
  },
  {
    id: 3,
    company: 'MSC Perú',
    role: 'Practicante IT',
    period: 'Dic 2023 – Feb 2026',
    current: false,
    bullets: [
      'Construcción de +10 módulos empresariales en producción bajo Clean Architecture y CQRS.',
      'Migración de sistemas legacy (jQuery) a Angular — mejora estimada del 20% en velocidad de respuesta.',
      'Automatización con Python/Pandas y Power Automate.',
      'Gestión en Azure DevOps bajo Scrum.',
    ],
  },
]

function highlightBullet(text: string): string {
  return text
    .replace(/\+10 módulos/g, '<strong class="text-text-primary">+10 módulos</strong>')
    .replace(/20%/g, '<strong class="text-text-primary">20%</strong>')
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
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
      <div className="card hover:border-border-hover transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="font-mono font-medium text-base text-text-primary">
              {exp.company}
            </h3>
            <p className="font-mono text-sm mt-0.5" style={{ color: '#00E5A0' }}>
              {exp.role}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-xs text-text-muted">{exp.period}</span>
            {exp.current && (
              <span className="badge-green text-[10px] px-2 py-0.5">Actual</span>
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
              <span dangerouslySetInnerHTML={{ __html: highlightBullet(bullet) }} />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Experience() {
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
      <p className="section-label">Experiencia</p>

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
