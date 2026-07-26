'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Bilingual {
  es: string;
  en: string;
}

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
  badge: Bilingual;
  badgeColor: 'blue' | 'green' | 'amber' | 'pink';
  title: Bilingual;
  description: Bilingual;
  metrics: ProjectMetric[];
  stack: string[];
  image?: string;
  links: ProjectLink[];
  featured: boolean;
  footer?: Bilingual;
}

const projects: Project[] = [
  {
    id: 1,
    badge: { es: 'AI & ML', en: 'AI & ML' },
    badgeColor: 'blue',
    title: {
      es: 'Clasificación de alertas con Random Forest',
      en: 'Alert classification with Random Forest',
    },
    description: {
      es: 'Sistema jerárquico de dos etapas (Random Forest + LightGBM) frente a baselines XGBoost/SVM, evaluado sobre ~33,000 alertas reales anonimizadas de un SOC de Lima Metropolitana. Priorización por risk score y explicabilidad SHAP con lenguaje natural vía Claude API. Desplegado en Azure.',
      en: 'Two-stage hierarchical system (Random Forest + LightGBM) benchmarked against XGBoost/SVM baselines, evaluated on ~33,000 real anonymized alerts from a Metropolitan Lima SOC. Risk-score prioritization and SHAP explainability translated into natural language via the Claude API. Deployed on Azure.',
    },
    metrics: [
      { value: '82.91%', label: 'Accuracy' },
      { value: '83.16%', label: 'F1-Macro' },
    ],
    stack: ['Python', 'scikit-learn', 'LightGBM', 'SHAP', 'Django', 'Azure', 'Claude API'],
    image: '/tesis.png',
    links: [{ label: 'GitHub', href: 'https://github.com/Carlou134/soc-alert-prioritization-ml' }],
    featured: true,
    footer: {
      es: 'Tesis de grado · UPC · ~33,000 alertas reales de SOC (Lima Metropolitana)',
      en: 'Degree thesis · UPC · ~33,000 real SOC alerts (Metropolitan Lima)',
    },
  },
  {
    id: 2,
    badge: { es: 'Backend', en: 'Backend' },
    badgeColor: 'green',
    title: {
      es: 'API REST con Clean Architecture',
      en: 'REST API with Clean Architecture',
    },
    description: {
      es: 'API robusta bajo Clean Architecture, SOLID y CQRS con MediatR. Seguridad con JWT + BCrypt, validaciones con FluentValidation y persistencia con EF Core. Diseñada para escalar sin deuda técnica.',
      en: 'Robust API under Clean Architecture, SOLID, and CQRS with MediatR. JWT + BCrypt security, FluentValidation checks, and EF Core persistence. Designed to scale without technical debt.',
    },
    metrics: [],
    stack: ['.NET Core', 'C#', 'SQL Server', 'MediatR', 'AutoMapper'],
    image: '/api-rest.png',
    links: [{ label: 'GitHub', href: 'https://github.com/Carlou134/webapi' }],
    featured: false,
  },
  {
    id: 3,
    badge: { es: 'Fullstack', en: 'Fullstack' },
    badgeColor: 'amber',
    title: {
      es: 'Sistema de gestión de órdenes',
      en: 'Order management system',
    },
    description: {
      es: 'SPA en React consumiendo API .NET Core con arquitectura desacoplada. Base de datos en AWS RDS (MySQL). Despliegue automatizado en Azure App Service.',
      en: 'React SPA consuming a .NET Core API with decoupled architecture. Database on AWS RDS (MySQL). Automated deployment on Azure App Service.',
    },
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
    badge: { es: 'Fullstack', en: 'Fullstack' },
    badgeColor: 'pink',
    title: {
      es: 'Ecosistema de gestión empresarial',
      en: 'Enterprise management ecosystem',
    },
    description: {
      es: 'Sistema de citas y facturación con Spring Security (JWT), JPA/PostgreSQL y Angular. Arquitectura multicapa desplegada en Heroku + Netlify.',
      en: 'Appointment and billing system with Spring Security (JWT), JPA/PostgreSQL, and Angular. Multi-layer architecture deployed on Heroku + Netlify.',
    },
    metrics: [],
    stack: ['Java 17', 'Spring Boot', 'Angular', 'PostgreSQL', 'JWT'],
    image: '/angular-spring.png',
    links: [
      { label: 'Frontend', href: 'https://github.com/Carlou134/TF_FINANZAS_FRONTEND' },
      { label: 'Backend', href: 'https://github.com/Carlou134/TF_FINANZAS' },
    ],
    featured: false,
  },
  {
    id: 5,
    badge: { es: 'Fullstack · IA', en: 'Fullstack · AI' },
    badgeColor: 'blue',
    title: {
      es: 'Interfaz con estado moderno e integración de IA',
      en: 'Modern state management UI with AI integration',
    },
    description: {
      es: 'Interfaz construida con React 19, shadcn/UI, Zustand y TanStack Query, consumiendo APIs .NET bajo Clean Architecture con integración de servicios OpenAI. Optimización de la carga de archivos sobre almacenamiento en AWS.',
      en: 'UI built with React 19, shadcn/UI, Zustand, and TanStack Query, consuming .NET APIs under Clean Architecture with OpenAI service integration. Optimized file upload/retrieval on AWS storage.',
    },
    metrics: [],
    stack: ['React 19', 'shadcn/UI', 'Zustand', 'TanStack Query', '.NET', 'Clean Architecture', 'OpenAI', 'AWS'],
    links: [],
    featured: false,
  },
  {
    id: 6,
    badge: { es: 'Backend · Legacy', en: 'Backend · Legacy' },
    badgeColor: 'amber',
    title: {
      es: 'Análisis y modernización de sistema legacy',
      en: 'Legacy system analysis and modernization',
    },
    description: {
      es: 'Análisis técnico de un sistema legacy en C# y Visual Basic para planificar su migración a una arquitectura moderna. Mantenimiento y soporte en producción sobre IIS y SQL Server.',
      en: 'Technical analysis of a legacy system in C# and Visual Basic to plan its migration to a modern architecture. Production maintenance and support on IIS and SQL Server.',
    },
    metrics: [],
    stack: ['C#', 'Visual Basic', 'IIS', 'SQL Server', 'Legacy Migration'],
    links: [],
    featured: false,
  },
];

const sectionLabel: Bilingual = { es: 'Lo que he construido', en: "What I've built" };

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
  eager = false,
  aspect = 'aspect-video',
  grow = false,
  sizes,
  fit = 'cover',
}: {
  src: string;
  alt: string;
  eager?: boolean;
  aspect?: string;
  grow?: boolean;
  sizes: string;
  fit?: 'cover' | 'contain';
}) {
  const [hasError, setHasError] = useState(false);
  const fileName = src.split('/').pop() ?? src;
  const containerClass = grow
    ? 'relative w-full flex-1 min-h-0'
    : `relative w-full ${aspect}`;

  if (hasError) {
    return (
      <div className={`${containerClass} rounded-lg bg-bg-secondary overflow-hidden flex items-center justify-center`}>
        <span className="font-mono text-xs text-text-muted">{fileName}</span>
      </div>
    );
  }

  return (
    <div className={`${containerClass} rounded-lg overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function Projects() {
  const { lang } = useLanguage();

  return (
    <section id="proyectos" className="section">
      <p className="section-label">{sectionLabel[lang]}</p>

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
                <Badge color={project.badgeColor} label={project.badge[lang]} />
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
              {project.image && (
                <ProjectImage
                  src={project.image}
                  alt={project.title[lang]}
                  eager={isFeatured || isLast}
                  grow={isFeatured}
                  sizes={
                    isFeatured
                      ? '(max-width: 768px) 100vw, 66vw'
                      : isLast
                        ? '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px'
                        : '(max-width: 768px) 100vw, 33vw'
                  }
                  fit={isLast ? 'contain' : 'cover'}
                />
              )}

              {/* Title */}
              <h3
                className={[
                  'font-mono text-text-primary',
                  isFeatured ? 'text-xl font-bold' : 'text-base font-medium',
                ].join(' ')}
              >
                {project.title[lang]}
              </h3>

              {/* Description */}
              <p
                className={[
                  'text-sm text-text-secondary leading-relaxed',
                  '',
                ].join(' ')}
              >
                {project.description[lang]}
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
                  {project.footer[lang]}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
