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
      es: "Sistema de gestión de órdenes",
      en: "Order management system",
    },
    description: {
      es: "SPA en React que consume una API en C#/.NET con arquitectura desacoplada. Base de datos MySQL en AWS RDS y despliegue automatizado en Azure App Service.",
      en: "React SPA consuming a C#/.NET API with a decoupled architecture. MySQL database on AWS RDS and automated deployment on Azure App Service.",
    },
    metrics: [],
    stack: ["React", "C#", ".NET", "MySQL", "AWS RDS", "Azure"],
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
    pending: [
      "Captura nueva con el diseño actual (sin barra del navegador, 1600×900+).",
      "Narrativa: qué pedía la prueba técnica y 2–3 decisiones técnicas que tomaste.",
      "Confirmar año y estado.",
      "Demo: ¿sigue vivo el deploy de Netlify? Si sí, URL + liveUntil.",
    ],
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
      es: "API REST con Clean Architecture",
      en: "REST API with Clean Architecture",
    },
    description: {
      es: "API bajo Clean Architecture, SOLID y CQRS con MediatR. Seguridad con JWT + BCrypt, validaciones con FluentValidation y persistencia con EF Core.",
      en: "API under Clean Architecture, SOLID and CQRS with MediatR. JWT + BCrypt security, FluentValidation checks and EF Core persistence.",
    },
    metrics: [],
    stack: [".NET", "C#", "SQL Server", "MediatR", "AutoMapper"],
    repos: [{ label: "GitHub", href: "https://github.com/Carlou134/webapi" }],
    pending: ["Confirmar tipo (¿personal?) y año."],
  },
  {
    id: 4,
    placement: "table",
    status: "done",
    kind: "academic",
    year: 2025,
    categories: ["front", "back", "data"],
    title: {
      es: "Ecosistema de gestión empresarial",
      en: "Enterprise management ecosystem",
    },
    description: {
      es: "Sistema de citas y facturación con Spring Security (JWT), JPA/PostgreSQL y Angular. Arquitectura multicapa desplegada en Heroku + Netlify.",
      en: "Appointment and billing system with Spring Security (JWT), JPA/PostgreSQL and Angular. Multi-layer architecture deployed on Heroku + Netlify.",
    },
    metrics: [],
    stack: ["Java 17", "Spring Boot", "Angular", "PostgreSQL", "JWT"],
    repos: [
      {
        label: "Frontend",
        href: "https://github.com/Carlou134/TF_FINANZAS_FRONTEND",
      },
      { label: "Backend", href: "https://github.com/Carlou134/TF_FINANZAS" },
    ],
    pending: ["¿Es el de gestión de facturas? Confirmar título y año."],
  },
  {
    id: 5,
    placement: "table",
    status: "done",
    kind: "personal",
    year: 2026,
    categories: ["front", "back", "ai"],
    title: {
      es: "Interfaz con estado moderno e integración de IA",
      en: "Modern state management UI with AI integration",
    },
    description: {
      es: "Interfaz con React 19, shadcn/UI, Zustand y TanStack Query, consumiendo APIs .NET bajo Clean Architecture con integración de servicios OpenAI.",
      en: "UI built with React 19, shadcn/UI, Zustand and TanStack Query, consuming .NET APIs under Clean Architecture with OpenAI service integration.",
    },
    metrics: [],
    stack: ["React 19", "Zustand", "TanStack Query", ".NET", "OpenAI", "AWS"],
    repos: [],
    pending: ["Confirmar tipo (¿laboral o personal?), año y si hay repo."],
  },
  {
    id: 6,
    placement: "table",
    status: "done",
    kind: "work",
    year: 2025,
    categories: ["back"],
    title: {
      es: "Análisis y modernización de sistema legacy",
      en: "Legacy system analysis and modernization",
    },
    description: {
      es: "Análisis técnico de un sistema legacy en C# y Visual Basic para planificar su migración a una arquitectura moderna. Mantenimiento en producción sobre IIS y SQL Server.",
      en: "Technical analysis of a legacy C# and Visual Basic system to plan its migration to a modern architecture. Production maintenance on IIS and SQL Server.",
    },
    metrics: [],
    stack: ["C#", "Visual Basic", "IIS", "SQL Server"],
    repos: [],
    pending: ["Confirmar año."],
  },
]);

// Grid slots still waiting for content. Dev-only, like `pending`.
export const gridTodo: string[] = [];
