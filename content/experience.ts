// Content-as-code: same rationale as content/projects.ts — bullets arrays of
// differing length per role, locale-neutral fields (company, current) mixed
// with bilingual ones, doesn't fit a flat message catalog. Bilingual fields
// stay inline as {es, en}, resolved with next-intl's useLocale() in
// Experience.tsx. Zod validation is deferred to the same later commit (#18)
// that will cover content/projects.ts.
export interface Bilingual {
  es: string;
  en: string;
}

export interface Experience {
  id: number;
  company: string;
  role: Bilingual;
  period: Bilingual;
  current: boolean;
  bullets: Bilingual[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Zoluxiones IT Services",
    role: {
      es: "Solutions Center of Excellence Associate",
      en: "Solutions Center of Excellence Associate",
    },
    period: { es: "Set 2026 – Actualidad", en: "Sep 2026 – Present" },
    current: true,
    bullets: [
      {
        es: "Desarrollo fullstack para soluciones robóticas, integrando APIs de terceros (IA, cloud, robótica).",
        en: "Fullstack development for robotics solutions, integrating third-party APIs (AI, cloud, robotics).",
      },
      {
        es: "Aplicación de Clean Code, testing y buenas prácticas de ciberseguridad en el ciclo de desarrollo.",
        en: "Applying Clean Code, testing, and cybersecurity best practices across the development cycle.",
      },
    ],
  },
  {
    id: 2,
    company: "Zoluxiones Latam",
    role: {
      es: "Practicante Pre Profesional de desarrollo",
      en: "Pre-Professional Developer Intern",
    },
    period: { es: "Abr 2026 – Ago 2026", en: "Apr 2026 – Aug 2026" },
    current: false,
    bullets: [
      {
        es: "Fullstack con React 19 en el frontend y C#/.NET (Clean Architecture, SOLID) en el backend — con SQL Server y MySQL corriendo en paralelo vía ADO.NET nativo.",
        en: "Fullstack with React 19 on the front end and C#/.NET (Clean Architecture, SOLID) on the back — running SQL Server and MySQL side by side via native ADO.NET.",
      },
      {
        es: "Endpoints REST documentados con Swagger y control de acceso por roles a nivel de tabla. Sumé envío de correos con Azure Communication Services e IA con la API de OpenAI.",
        en: "REST endpoints documented with Swagger and table-level role-based access control. Added email via Azure Communication Services and AI features through the OpenAI API.",
      },
      {
        es: "Migré la base de datos completa de SQL Server a MySQL sin cortar el servicio — reescribiendo la capa de acceso a datos del backend.",
        en: "Migrated the entire database from SQL Server to MySQL with zero downtime — rewriting the backend's data access layer.",
      },
      {
        es: "Encontré y eliminé un cuello de botella en la descarga de archivos desde AWS. De paso, dockericé PostgreSQL para tener entornos reproducibles.",
        en: "Found and killed a bottleneck in file retrieval from AWS. Also dockerized PostgreSQL for reproducible environments.",
      },
      {
        es: "Metí caché con Redis en el frontend Next.js/Node.js — 15% más rápido.",
        en: "Added Redis caching to the Next.js/Node.js frontend — 15% faster.",
      },
      {
        es: "Diseñamos en equipo una herramienta interna estilo Jira que le sacó 40% de reuniones de coordinación al equipo.",
        en: "Built an internal Jira-style tool with the team that cut coordination meetings by 40%.",
      },
      {
        es: "Modernicé un microservicio legacy a Kotlin con arquitectura hexagonal — puertos y adaptadores, Clean Code, tests obligatorios antes de cada deploy vía CI/CD con GitLab.",
        en: "Modernized a legacy microservice to Kotlin with hexagonal architecture — ports and adapters, Clean Code, mandatory test coverage before every deploy via GitLab CI/CD.",
      },
      {
        es: "App Android con WebSockets + API Kotlin con interfaz visual para controlar robots en tiempo real, con jobs que sincronizan cada 5 minutos con las APIs de los proveedores. Presenté el MVP directo a gerencia y clientes.",
        en: "Android app with WebSockets + a Kotlin API with a visual interface for real-time robot control, with jobs syncing every 5 minutes against provider APIs. Presented the MVP straight to management and clients.",
      },
    ],
  },
  {
    id: 3,
    company: "MSC Perú",
    role: { es: "Practicante de IT", en: "IT Intern" },
    period: { es: "Dic 2023 – Feb 2026", en: "Dec 2023 – Feb 2026" },
    current: false,
    bullets: [
      {
        es: "Construcción de +10 módulos empresariales en producción bajo Clean Architecture y CQRS.",
        en: "Built +10 enterprise modules in production under Clean Architecture and CQRS.",
      },
      {
        es: "Migración de sistemas legacy (jQuery) a Angular — mejora estimada del 20% en velocidad de respuesta.",
        en: "Migrated legacy systems (jQuery) to Angular — an estimated 20% improvement in response speed.",
      },
      {
        es: "Automatización con Python/Pandas y Power Automate.",
        en: "Automation with Python/Pandas and Power Automate.",
      },
      {
        es: "Gestión en Azure DevOps bajo Scrum.",
        en: "Project management in Azure DevOps under Scrum.",
      },
    ],
  },
];
