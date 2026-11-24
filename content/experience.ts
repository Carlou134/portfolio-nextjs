// Content-as-code: same rationale as content/projects.ts. Bilingual fields stay
// inline as {es, en}, resolved with next-intl's useLocale() in Experience.tsx.
// The shape is validated by content/schema.ts at import time.
//
// Every bullet must survive an interview question: no percentages without a
// measurement behind them, and no client names (the robotics platform is
// client work under NDA, so providers and the client stay generic).
import { experiencesSchema, type Experience } from "./schema";

export type { Experience } from "./schema";

export const experiences: Experience[] = experiencesSchema.parse([
  {
    id: 1,
    company: "Zoluxiones LATAM",
    role: {
      es: "Solutions Center of Excellence Associate",
      en: "Solutions Center of Excellence Associate",
    },
    period: { es: "Set 2026 – Actualidad", en: "Sep 2026 – Present" },
    current: true,
    bullets: [
      {
        es: "Integro endpoints de proveedores de robots autónomos de limpieza con Kotlin y Ktor, dentro de la migración de la plataforma a servicios distribuidos con arquitectura hexagonal.",
        en: "I integrate autonomous cleaning-robot provider endpoints with Kotlin and Ktor, as part of migrating the platform to distributed services with hexagonal architecture.",
      },
      {
        es: "Construí un webhook que recibe telemetría en tiempo real: un script Python ejecuta comandos Linux en el robot y envía los datos a la API en Kotlin.",
        en: "Built a webhook that receives real-time telemetry: a Python script runs Linux commands on the robot and sends the data to the Kotlin API.",
      },
      {
        es: "Funcionalidades de gestión de robots: sesiones, mapas, programación de tareas y monitoreo, sobre PostgreSQL, Redis, MinIO y Docker.",
        en: "Robot management features: sessions, maps, task scheduling and monitoring, on PostgreSQL, Redis, MinIO and Docker.",
      },
      {
        es: "Levanto requerimientos directamente con los responsables de robótica, propongo diseños técnicos al líder técnico y presento los avances a gerencia. Hago code reviews puntuales.",
        en: "I gather requirements directly with the robotics leads, propose technical designs to the tech lead and present progress to management. I also do occasional code reviews.",
      },
      {
        es: "Actualmente desarrollo web scraping con Kotlin.",
        en: "Currently building web scraping with Kotlin.",
      },
    ],
  },
  {
    id: 2,
    company: "Zoluxiones LATAM",
    role: {
      es: "Practicante de desarrollo",
      en: "Developer Intern",
    },
    period: { es: "Abr 2026 – Ago 2026", en: "Apr 2026 – Aug 2026" },
    current: false,
    bullets: [
      {
        es: "Frontend con React, Next.js, TypeScript, Zustand y TanStack Query, y APIs con C#/.NET y Kotlin bajo Clean Architecture y SOLID.",
        en: "Front end with React, Next.js, TypeScript, Zustand and TanStack Query, and APIs with C#/.NET and Kotlin under Clean Architecture and SOLID.",
      },
      {
        es: "Desarrollé un módulo de asignación y seguimiento de tareas que ordenó la distribución del trabajo y el seguimiento de avances en las reuniones Scrum.",
        en: "Built a task assignment and tracking module that organized how work was split and how progress was followed in Scrum meetings.",
      },
      {
        es: "Integré Azure Communication Services, WebSockets y APIs de proveedores robóticos, e hice migraciones de datos entre SQL Server, MySQL y PostgreSQL.",
        en: "Integrated Azure Communication Services, WebSockets and robotics provider APIs, and ran data migrations across SQL Server, MySQL and PostgreSQL.",
      },
      {
        es: "Calidad en cada cambio: Git hooks con Prettier, ESLint, Commitlint y ktlint, y GitHub Actions con tests, cobertura y builds Docker.",
        en: "Quality on every change: Git hooks with Prettier, ESLint, Commitlint and ktlint, and GitHub Actions running tests, coverage and Docker builds.",
      },
    ],
  },
  {
    id: 3,
    company: "MSC Perú",
    role: {
      es: "Practicante de desarrollo IT",
      en: "IT Developer Intern",
    },
    period: { es: "Dic 2023 – Mar 2026", en: "Dec 2023 – Mar 2026" },
    current: false,
    bullets: [
      {
        es: "+10 módulos en producción para Comercial, Administración, Tráfico, Operaciones y RR. HH., con C#, ASP.NET MVC/Core, Entity Framework y SQL Server.",
        en: "+10 modules in production for Sales, Administration, Traffic, Operations and HR, with C#, ASP.NET MVC/Core, Entity Framework and SQL Server.",
      },
      {
        es: "APIs REST, procesamiento de archivos CSV, reportes en Excel y PDF, y automatización de procesos operativos.",
        en: "REST APIs, CSV file processing, Excel and PDF reports, and automation of operational processes.",
      },
      {
        es: "Del requerimiento a producción: levantamiento, documentación técnica, pruebas UAT y despliegues en IIS, bajo Scrum con Azure DevOps.",
        en: "From requirement to production: gathering, technical documentation, UAT and IIS deployments, under Scrum with Azure DevOps.",
      },
      {
        es: "Mantenimiento de aplicaciones legacy en VB.NET y Windows Forms, y modernización de frontends de jQuery a Angular.",
        en: "Maintained legacy VB.NET and Windows Forms applications, and modernized front ends from jQuery to Angular.",
      },
    ],
  },
]);
