// Content-as-code: this is real portfolio data, not UI copy, so it lives here
// instead of messages/*.json. Bilingual fields stay inline as {es, en}, resolved
// with next-intl's useLocale() in Projects.tsx. The shape is validated by
// content/schema.ts at import time, so a malformed entry fails the build.
//
// Grid order is display order. `pending` lists missing content; it only shows
// up as a dev-mode notice and is stripped from production renders.
import { projectsSchema, type Project } from "./schema";

export type { Project, ProjectCategory } from "./schema";

export const projects: Project[] = projectsSchema.parse([
  {
    id: 1,
    placement: "grid",
    status: "done",
    kind: "thesis",
    year: 2026,
    categories: ["back", "data", "ai", "ops"],
    title: {
      es: "Priorización de alertas SOC con Machine Learning",
      en: "SOC alert prioritization with Machine Learning",
    },
    description: {
      es: "Sistema web que clasifica alertas de seguridad (benigno, a investigar, malicioso) con un clasificador jerárquico Random Forest → LightGBM, les asigna un risk score y explica cada decisión con SHAP. Ingesta asíncrona sin Redis, conector real con Splunk y visibilidad por rol de analista. Desplegado en Azure.",
      en: "Web system that classifies security alerts (benign, to investigate, malicious) with a hierarchical Random Forest → LightGBM classifier, assigns each a risk score and explains every decision with SHAP. Redis-free async ingestion, a real Splunk connector and role-based analyst visibility. Deployed on Azure.",
    },
    metrics: [
      {
        value: "98.9%",
        label: { es: "Recall en maliciosos", en: "Recall on malicious" },
      },
      {
        value: "−40.5%",
        label: {
          es: "Tiempo de revisión (12 analistas)",
          en: "Review time (12 analysts)",
        },
      },
      { value: "0.83", label: { es: "F1-macro", en: "F1-macro" } },
    ],
    stack: [
      "Python",
      "Django",
      "LightGBM",
      "scikit-learn",
      "SHAP",
      "PostgreSQL",
      "Azure",
      "Claude API",
    ],
    image: "/login_tesis.png",
    repos: [
      {
        label: "GitHub",
        href: "https://github.com/Carlou134/soc-alert-prioritization-ml",
      },
    ],
    footer: {
      es: "Tesis de grado · UPC · Desarrollo completo del sistema; dataset, diagramas y gestión Scrum en equipo con Giancarlo Moreno.",
      en: "Degree thesis · UPC · Built the whole system; dataset, diagrams and Scrum management in a team with Giancarlo Moreno.",
    },
    pending: [
      "Video walkthrough con voz (opcional; la demo sin voz va en `demo`, no acá).",
      "Case study (commits 37–42): al publicarlo, agregar caseSlug.",
      "Capturas para el case study: detalle de alerta con SHAP y conector Splunk.",
      "Conteo de tests: README dice 119, docs/technical.md dice 153. Confirmar con pytest.",
    ],
  },
  {
    id: 8,
    placement: "grid",
    status: "done",
    kind: "technicalTest",
    year: 2026,
    categories: ["back"],
    title: {
      es: "Integración TMS-OMS en tiempo real",
      en: "Real-time TMS-OMS integration",
    },
    description: {
      es: "Sincroniza el estado de los pedidos entre un TMS externo y el OMS de una empresa de logística. Recibe los eventos por webhook descartando duplicados, aplica las reglas de negocio en un aggregate y, de forma asíncrona, registra el historial, descarga las evidencias y notifica a cada cliente en su propio formato, con reintentos, Outbox y cola de mensajes fallidos.",
      en: "Syncs order status between an external TMS and a logistics company's OMS. It receives events by webhook while discarding duplicates, enforces the business rules in an aggregate and, asynchronously, records the history, downloads the evidence and notifies each client in its own format, with retries, an Outbox and a dead letter queue.",
    },
    metrics: [
      {
        value: "8/8",
        label: { es: "Requisitos del enunciado", en: "Brief requirements" },
      },
      {
        value: "12",
        label: { es: "Patrones justificados", en: "Justified patterns" },
      },
    ],
    stack: [
      "C#",
      ".NET 10",
      "ASP.NET Core",
      "Clean Architecture",
      "Polly",
      "Channels",
      "xUnit",
    ],
    image: "/tms-retries-card.png",
    repos: [
      {
        label: "GitHub",
        href: "https://github.com/Carlou134/tms-oms-integration",
      },
    ],
    footer: {
      es: "Prueba técnica · Diagramas, decisiones técnicas y limitaciones conocidas documentadas en el repo.",
      en: "Technical test · Diagrams, technical decisions and known limitations documented in the repo.",
    },
    pending: [],
  },
  {
    id: 3,
    placement: "grid",
    status: "done",
    kind: "technicalTest",
    year: 2026,
    categories: ["front", "back", "data", "ops"],
    title: {
      es: "Gestión de órdenes de compra",
      en: "Purchase order management",
    },
    description: {
      es: "La prueba pedía un frontend en React y una API en Node/Express. Entregué además todos los puntos extra (catálogo de productos, cambio de estado y bloqueo de órdenes completadas) y los dos bonus: backend en .NET 8 con Clean Architecture y despliegue en la nube (Azure, Netlify y MySQL en AWS RDS). Frontend en React 19 + TypeScript con React Query y formularios con Zod; API con FluentValidation, ProblemDetails y auditoría automática.",
      en: "The brief asked for a React frontend and a Node/Express API. I also delivered every extra point (product catalog, status changes and locking completed orders) and both bonus tracks: a .NET 8 backend with Clean Architecture and a cloud deployment (Azure, Netlify and MySQL on AWS RDS). React 19 + TypeScript frontend with React Query and Zod forms; API with FluentValidation, ProblemDetails and automatic auditing.",
    },
    metrics: [
      {
        value: "3/3",
        label: { es: "Puntos extra del enunciado", en: "Brief extra points" },
      },
      {
        value: "2/2",
        label: {
          es: "Bonus tracks (.NET y nube)",
          en: "Bonus tracks (.NET and cloud)",
        },
      },
    ],
    stack: [
      "React 19",
      "TypeScript",
      "React Query",
      "shadcn/ui",
      ".NET 8",
      "EF Core",
      "MySQL",
      "AWS RDS",
      "Azure",
    ],
    image: "/order-management-home.png",
    repos: [
      {
        label: "Frontend",
        href: "https://github.com/Carlou134/OrderManagementFrontEnd",
      },
      {
        label: "Backend",
        href: "https://github.com/Carlou134/OrderManagementBackend",
      },
    ],
    footer: {
      es: "Prueba técnica · Frontend y backend en repos separados, con decisiones técnicas documentadas.",
      en: "Technical test · Frontend and backend in separate repos, with documented technical decisions.",
    },
    pending: [],
  },
  {
    id: 7,
    placement: "grid",
    status: "done",
    kind: "academic",
    year: 2026,
    categories: ["back", "ops"],
    title: {
      es: "Simulador de alertas SOC",
      en: "SOC alert simulator",
    },
    description: {
      es: "Worker Service en .NET 8 que cumple el rol de fuente SIEM para la tesis: recibe un dataset de alertas por una Minimal API y lo envía a Splunk por HEC en lotes NDJSON, como lo haría un firewall o un EDR. Cada alerta se envía una sola vez y un upload nuevo despierta al worker sin esperar el siguiente ciclo.",
      en: ".NET 8 Worker Service that plays the SIEM data source for the thesis: it takes an alert dataset through a Minimal API and streams it into Splunk via HEC in NDJSON batches, the way a firewall or an EDR would. Each alert is sent exactly once, and a new upload wakes the worker instead of waiting for the next tick.",
    },
    metrics: [],
    stack: [
      "C#",
      ".NET 8",
      "Minimal API",
      "Splunk HEC",
      "Serilog",
      "CsvHelper",
      "xUnit",
    ],
    image: "/worker-card.png",
    repos: [
      {
        label: "GitHub",
        href: "https://github.com/Carlou134/soc-alert-simulator-worker",
      },
    ],
    pending: [
      "Docs del worker desactualizadas: el README dice 'local dev today' y architecture.md que Django no consume de Splunk; hoy el worker corre en Azure y la tesis tiene el conector real.",
    ],
  },
  // ── "More projects" table (rendered in commit 33) ────────────────────────
  {
    id: 2,
    placement: "table",
    status: "done",
    kind: "personal",
    year: 2025,
    categories: ["back"],
    title: {
      es: "API de tareas y usuarios",
      en: "Tasks and users API",
    },
    description: {
      es: "API REST en .NET 10 con JWT, BCrypt y roles: un USER solo puede editar o borrar su propia cuenta y solo un ADMIN cambia roles. Los commands de usuarios pasan por MediatR con un pipeline de validación (FluentValidation) que responde 400, y publican eventos de dominio.",
      en: "REST API in .NET 10 with JWT, BCrypt and roles: a USER can only edit or delete their own account, and only an ADMIN changes roles. User commands go through MediatR with a validation pipeline (FluentValidation) that returns 400, and publish domain events.",
    },
    metrics: [],
    stack: [
      "C#",
      ".NET 10",
      "ASP.NET Core",
      "EF Core",
      "SQL Server",
      "MediatR",
      "FluentValidation",
      "JWT",
    ],
    repos: [{ label: "GitHub", href: "https://github.com/Carlou134/webapi" }],
    pending: [],
  },
  {
    id: 4,
    placement: "table",
    status: "done",
    kind: "academic",
    year: 2024,
    categories: ["front", "back"],
    title: {
      es: "FacturaPro: carteras de descuento",
      en: "FacturaPro: discounted invoice portfolios",
    },
    description: {
      es: "App para que una pyme descuente facturas y letras con un banco: calcula cuánto recibe de verdad después de intereses, comisiones e IGV, y la TCEA de la cartera en soles o dólares. Trabajo grupal en el que hice el desarrollo full-stack: login con JWT, roles y reportes en PDF.",
      en: "App for an SME discounting invoices and bills of exchange with a bank: it calculates how much the company really receives after interest, fees and IGV tax, and the portfolio's TCEA in soles or dollars. Group project where I did the full-stack development: JWT login, roles and PDF reports.",
    },
    metrics: [],
    stack: [
      "Java 17",
      "Spring Boot",
      "Spring Security",
      "JWT",
      "PostgreSQL",
      "Angular 18",
      "Angular Material",
    ],
    repos: [
      {
        label: "Frontend",
        href: "https://github.com/Carlou134/TF_FINANZAS_FRONTEND",
      },
      { label: "Backend", href: "https://github.com/Carlou134/TF_FINANZAS" },
    ],
    // Known flaw, ready for interviews: the TCEA comes from portfolio totals
    // with a 360/360 exponent (just S/C − 1), so it isn't annualized by term.
    // Both READMEs list it as a limitation.
    pending: [],
  },
  {
    id: 9,
    placement: "table",
    status: "done",
    kind: "academic",
    year: 2023,
    categories: ["front", "back"],
    title: {
      es: "DentiBrook: pacientes y odontólogos",
      en: "DentiBrook: patients and dentists",
    },
    description: {
      es: "Plataforma que conecta pacientes con odontólogos: reserva de citas, historial clínico, tratamientos y reseñas. En un equipo de 4, llevé el desarrollo y el despliegue: API REST con JWT y roles por tipo de usuario (paciente u odontólogo), cliente en Angular y deploy en Heroku.",
      en: "Platform connecting patients with dentists: appointment booking, medical history, treatments and reviews. In a team of 4, I led development and deployment: a REST API with JWT and per-user-type roles (patient or dentist), an Angular client and Heroku deployment.",
    },
    metrics: [],
    stack: [
      "Java 17",
      "Spring Boot",
      "Spring Security",
      "JWT",
      "PostgreSQL",
      "Angular 16",
      "Angular Material",
    ],
    repos: [
      {
        label: "Frontend",
        href: "https://github.com/Carlou134/DentiBrook_Frontend",
      },
      {
        label: "Backend",
        href: "https://github.com/Carlou134/DentiBrook_Backend",
      },
    ],
    pending: [],
  },
  {
    id: 10,
    placement: "table",
    status: "prod",
    kind: "personal",
    year: 2026,
    categories: ["front", "ops"],
    title: { es: "Este portafolio", en: "This portfolio" },
    description: {
      es: "El sitio que estás viendo, en español e inglés. El contenido vive en código validado con Zod, así que un proyecto mal cargado rompe los tests y no llega a producción. Tests con Vitest y Playwright, y GitHub Actions corre build, e2e y Lighthouse en cada pull request.",
      en: "The site you're looking at, in Spanish and English. Content lives in code validated with Zod, so a malformed project breaks the tests instead of reaching production. Vitest and Playwright tests, and GitHub Actions runs build, e2e and Lighthouse on every pull request.",
    },
    metrics: [],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "next-intl",
      "Zod",
      "Vitest",
      "Playwright",
    ],
    repos: [
      {
        label: "GitHub",
        href: "https://github.com/Carlou134/portfolio-nextjs",
      },
    ],
    pending: [],
  },
  {
    id: 11,
    placement: "table",
    status: "done",
    kind: "technicalTest",
    year: 2026,
    categories: ["front", "back"],
    title: { es: "Task Manager", en: "Task Manager" },
    description: {
      es: "App de tareas personales. La API usa Clean Architecture en cuatro proyectos (Domain, Application, Infrastructure y Api) y CQRS con MediatR. El id del usuario sale del token, así que nadie puede tocar tareas ajenas mandando otro userId. El cliente en Angular protege las rutas con un guard que revisa la expiración del JWT y cierra la sesión ante un 401.",
      en: "Personal task app. The API uses Clean Architecture across four projects (Domain, Application, Infrastructure and Api) and CQRS with MediatR. The user id comes from the token, so nobody can touch someone else's tasks by sending another userId. The Angular client guards routes by checking the JWT's expiry and signs out on a 401.",
    },
    metrics: [],
    stack: [
      "C#",
      ".NET 8",
      "ASP.NET Core",
      "EF Core",
      "PostgreSQL",
      "MediatR",
      "JWT",
      "Angular 18",
      "Angular Material",
    ],
    repos: [
      {
        label: "Frontend",
        href: "https://github.com/Carlou134/TaskManagerFrontend",
      },
      {
        label: "Backend",
        href: "https://github.com/Carlou134/TaskManagerBackend",
      },
    ],
    pending: [],
  },
]);

// Grid slots still waiting for content. Dev-only, like `pending`.
export const gridTodo: string[] = [];
