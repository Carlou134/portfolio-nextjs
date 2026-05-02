'use client'

import { motion } from 'framer-motion'
import { GraduationCap, BookOpen } from 'lucide-react'
import Image from 'next/image'

const thesisTags = ['Python', 'Random Forest', 'SHAP', 'Django', 'Azure']

function Photo() {
  return (
    <motion.div
      className="relative w-32 h-32 md:w-44 md:h-44 shrink-0 group"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Contenedor con clip para que la imagen respete el border-radius */}
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Image
          src="/Foto-Linkedin.jpeg"
          alt="Carlos Vásquez — Fullstack Developer"
          fill
          className="object-cover object-top"
          priority={false}
        />
      </div>

      {/* Borde decorativo — encima de la imagen, fuera del clip */}
      <div className="absolute inset-0 rounded-xl border-2 border-accent-green/30 group-hover:border-accent-green/60 transition-colors duration-300 pointer-events-none" />

      {/* Dot de disponibilidad */}
      <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-bg-primary border-2 border-bg-primary flex items-center justify-center">
        <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#00E5A0' }} />
      </div>
    </motion.div>
  )
}

function PhotoAndText() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Photo />

      <div className="flex flex-col gap-4">
        <p className="font-sans text-sm text-text-secondary leading-relaxed">
          Desarrollo software desde hace +2 años en entornos reales — no en tutoriales. Trabajo
          principalmente con .NET y React, aunque me adapto al stack que el proyecto necesite.
        </p>
        <p className="font-sans text-sm text-text-secondary leading-relaxed">
          Estudiante de Ingeniería de Sistemas en UPC (9no ciclo, Quinto Superior). Inglés
          avanzado. Autodidacta por convicción.
        </p>
        <div className="flex flex-col gap-2">
          <p className="font-sans text-sm text-text-secondary leading-relaxed">
            Disponible para proyectos freelance y posiciones de desarrollo.
          </p>
          <span className="badge-green inline-flex items-center gap-1.5 w-fit">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: '#00E5A0' }}
            />
            Disponible
          </span>
        </div>
      </div>
    </div>
  )
}

function EducationCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card hover:border-accent-green/30 hover:glow-green cursor-default transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={18} color="#00E5A0" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Formación académica
        </span>
      </div>

      <div className="h-px bg-border mb-4" />

      {/* Universidad */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center p-1">
          <Image
            src="/upc.png"
            alt="UPC"
            width={40}
            height={40}
            className="object-contain w-full h-full"
          />
        </div>
        <div>
          <p className="font-mono text-sm font-medium text-text-primary leading-snug">
            Universidad Peruana de Ciencias Aplicadas
          </p>
          <p className="text-xs text-text-secondary mt-0.5">Ingeniería de Sistemas</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-amber">9no ciclo</span>
        <span className="badge-amber">Quinto Superior</span>
        <span className="badge-green">2020 – 2026</span>
      </div>

      <div className="h-px bg-border my-4" />

      {/* Tesis */}
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} color="#9CA3AF" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Investigación de tesis
        </span>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        Sistema web con Random Forest y SHAP para clasificación automática de alertas de seguridad.
        Desplegado en Azure.
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {thesisTags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono px-2 py-0.5 bg-bg-secondary border border-border rounded text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="sobre-mi" className="section">
      <p className="section-label">Sobre mí</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <motion.div
          className="lg:col-span-7 flex flex-col gap-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <PhotoAndText />
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <EducationCard />
        </motion.div>
      </div>
    </section>
  )
}
