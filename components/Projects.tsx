'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProjectLink {
  label: string;
  href: string;
}

interface ProjectMetric {
  value: string;
  label: string;
}

interface Project {
  id: number;
  badge: string;
  badgeColor: 'blue' | 'green' | 'amber' | 'pink';
  title: string;
  description: string;
  metrics: ProjectMetric[];
  stack: string[];
  image: string;
  links: ProjectLink[];
  featured: boolean;
  footer?: string;
}

const projects: Project[] = [
  {
    id: 1,
    badge: 'AI & ML',
    badgeColor: 'blue',
    title: 'Clasificación de alertas con Random Forest',
    description:
      'Pipeline completo de ML sobre 9.5M incidentes reales (Microsoft GUIDE Dataset). Clasificación automática en tres categorías, priorización por risk score y explicabilidad SHAP con lenguaje natural via Claude API. Desplegado en Azure.',
    metrics: [
      { value: '73%', label: 'F1 Macro' },
      { value: '86.7%', label: 'Validación externa' },
    ],
    stack: ['Python', 'scikit-learn', 'SHAP', 'Django', 'Azure', 'Claude API'],
    image: '/tesis.png',
    links: [{ label: 'GitHub', href: 'https://github.com/Carlou134/soc-alert-prioritization-ml' }],
    featured: true,
    footer: 'Tesis de grado · UPC · Dataset: Microsoft GUIDE (9.5M incidentes reales)',
  },
  {
    id: 2,
    badge: 'Backend',
    badgeColor: 'green',
    title: 'API REST con Clean Architecture',
    description:
      'API robusta bajo Clean Architecture, SOLID y CQRS con MediatR. Seguridad con JWT + BCrypt, validaciones con FluentValidation y persistencia con EF Core. Diseñada para escalar sin deuda técnica.',
    metrics: [],
    stack: ['.NET Core', 'C#', 'SQL Server', 'MediatR', 'AutoMapper'],
    image: '/api-rest.png',
    links: [{ label: 'GitHub', href: 'https://github.com/Carlou134/webapi' }],
    featured: false,
  },
  {
    id: 3,
    badge: 'Fullstack',
    badgeColor: 'amber',
    title: 'Sistema de gestión de órdenes',
    description:
      'SPA en React consumiendo API .NET Core con arquitectura desacoplada. Base de datos en AWS RDS (MySQL). Despliegue automatizado en Azure App Service.',
    metrics: [],
    stack: ['React', '.NET Core', 'MySQL', 'Azure', 'AWS RDS'],
    image: '/gestion-ordenes.png',
    links: [
      { label: 'Frontend', href: 'https://github.com/Carlou134/OrderManagementFrontEnd' },
      { label: 'Backend', href: 'https://github.com/Carlou134/OrderManagementBackend' },
    ],
    featured: false,
  },
  {
    id: 4,
    badge: 'Fullstack',
    badgeColor: 'pink',
    title: 'Ecosistema de gestión empresarial',
    description:
      'Sistema de citas y facturación con Spring Security (JWT), JPA/PostgreSQL y Angular. Arquitectura multicapa desplegada en Heroku + Netlify.',
    metrics: [],
    stack: ['Java 17', 'Spring Boot', 'Angular', 'PostgreSQL', 'JWT'],
    image: '/angular-spring.png',
    links: [
      { label: 'Frontend', href: 'https://github.com/Carlou134/TF_FINANZAS_FRONTEND' },
      { label: 'Backend', href: 'https://github.com/Carlou134/TF_FINANZAS' },
    ],
    featured: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function Badge({ color, label }: { color: Project['badgeColor']; label: string }) {
  if (color === 'pink') {
    return (
      <span className="badge bg-pink-900/20 border border-pink-500/40 text-pink-400 text-xs font-mono px-3 py-1 rounded-full tracking-wide">
        {label}
      </span>
    );
  }
  return <span className={`badge-${color}`}>{label}</span>;
}

function ProjectImage({
  src,
  alt,
  priority = false,
  aspect = 'aspect-video',
  sizes,
  fit = 'cover',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: string;
  sizes: string;
  fit?: 'cover' | 'contain';
}) {
  const [hasError, setHasError] = useState(false);
  const fileName = src.split('/').pop() ?? src;

  if (hasError) {
    return (
      <div className={`relative w-full ${aspect} rounded-lg bg-bg-secondary overflow-hidden flex items-center justify-center`}>
        <span className="font-mono text-xs text-text-muted">{fileName}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspect} rounded-lg overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function Projects() {
  return (
    <section id="proyectos" className="section">
      <p className="section-label">Lo que he construido</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project, index) => {
          const isFeatured = project.featured;
          const isLast = project.id === 4;

          return (
            <motion.div
              key={project.id}
              className={[
                isFeatured ? 'card-featured' : 'card',
                isFeatured ? 'md:col-span-2 md:row-span-2' : '',
                isLast ? 'md:col-span-3' : '',
                'hover:border-accent-green/50 hover:glow-green transition-all duration-300',
                'flex flex-col gap-4',
              ]
                .filter(Boolean)
                .join(' ')}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{
                scale: isFeatured ? 1.01 : 1.02,
                transition: { duration: 0.2 },
              }}
            >
              {/* Badge + Links */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge color={project.badgeColor} label={project.badge} />
                {project.links.length > 0 && (
                  <div className="flex gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-mono text-text-secondary hover:text-accent-green transition-colors"
                      >
                        {link.label}
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <ProjectImage
                src={project.image}
                alt={project.title}
                priority={isFeatured}
                aspect={isFeatured ? 'aspect-[4/3]' : 'aspect-video'}
                sizes={
                  isFeatured
                    ? '(max-width: 768px) 100vw, 66vw'
                    : isLast
                      ? '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px'
                      : '(max-width: 768px) 100vw, 33vw'
                }
                fit={isFeatured || isLast ? 'contain' : 'cover'}
              />

              {/* Title */}
              <h3
                className={[
                  'font-mono text-text-primary',
                  isFeatured ? 'text-xl font-bold' : 'text-base font-medium',
                ].join(' ')}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                className={[
                  'text-sm text-text-secondary leading-relaxed',
                  '',
                ].join(' ')}
              >
                {project.description}
              </p>

              {/* Metrics (featured only) */}
              {isFeatured && project.metrics.length > 0 && (
                <div className="bg-bg-secondary border border-border p-3 rounded-lg flex gap-6">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-mono text-2xl text-accent-green">{m.value}</span>
                      <p className="text-xs text-text-muted mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Stack */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.stack.map((tech) => (
                  <span key={tech} className="stack-tag">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer */}
              {project.footer && (
                <p className="text-xs font-mono text-text-muted border-t border-border pt-3">
                  {project.footer}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
