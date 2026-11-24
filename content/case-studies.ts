// Case study content. Every fact comes from the thesis repo docs (README,
// docs/architecture.md, docs/model.md, docs/technical.md) and the experiment
// summary; nothing here is a placeholder.
//
// One full object per locale with the same type, so a field missing from the
// English version fails the build instead of silently falling back.
import { defaultLocale, type Locale } from "@/i18n/locale";

export interface CaseStudy {
  slug: string;
  projectId: number;
  kicker: string;
  title: string;
  // Short summary for <meta name="description"> and link previews.
  description: string;
  tags: string[];
  meta: { label: string; value: string }[];
  context: string[];
  rolePara: string;
  decisions: { title: string; body: string }[];
  archIntro: string;
  flow: { stage: string; boxes: { title: string; sub: string }[] }[];
  flowCaption: string;
  archWhy: string[];
  screenshots: { src: string; caption: string }[];
  snippet: { file: string; lang: string; code: string; note: string };
  // YouTube video id. Without one the video section isn't rendered.
  video?: { youtubeId: string; caption: string };
  results: { value: string; label: string }[];
  tradeoff: string;
  validation: string;
  learnings: string[];
}

const socEs: CaseStudy = {
  slug: "soc-ml",
  projectId: 1,
  kicker: "Case study · 01",
  title: "Priorización de alertas SOC con Machine Learning",
  description:
    "Cómo construí un sistema que prioriza y explica alertas de seguridad para analistas SOC: clasificación en dos etapas con Random Forest y LightGBM, explicaciones SHAP, conector con Splunk y un experimento con 12 analistas.",
  tags: [
    "Python",
    "Django",
    "LightGBM",
    "scikit-learn",
    "SHAP",
    "PostgreSQL",
    "Azure",
    "Tesis",
  ],
  meta: [
    { label: "Rol", value: "Desarrollo completo del sistema" },
    { label: "Duración", value: "9 meses (mar–nov 2026)" },
    { label: "Equipo", value: "2 personas" },
    { label: "Estado", value: "Completado" },
  ],
  context: [
    "En un SOC real, los analistas reciben un volumen de alertas muy por encima de su capacidad de revisión manual. Las alertas se atienden en orden de llegada, así que un ataque real puede quedar enterrado bajo ruido de baja severidad, y eso impacta directamente el MTTD y el MTTR del equipo.",
    "El problema no era solo clasificar: era que el analista pudiera confiar en la clasificación. Un score opaco no se adopta, se ignora.",
  ],
  rolePara:
    "Desarrollé el sistema completo: el modelo, el backend en Django, la ingesta asíncrona, el conector con Splunk y el despliegue en Azure. Giancarlo Moreno llevó el dataset, los diagramas de flujo y la gestión Scrum.",
  decisions: [
    {
      title: "Clasificador jerárquico sesgado hacia el recall",
      body: "Un error no cuesta lo mismo en las tres clases: dejar pasar un ataque real es mucho más caro que hacer que un analista descarte una falsa alarma. La etapa 1 (Random Forest) separa malicioso del resto con la clase maliciosa pesada x2; la etapa 2 (LightGBM) distingue 'a investigar' de 'benigno' solo en lo que la etapa 1 no marcó.",
    },
    {
      title: "Ingesta asíncrona con django-q2, no Celery",
      body: "El presupuesto del plan de estudiante en Azure no alcanzaba para un Redis administrado, que Celery necesita como broker. django-q2 guarda la cola en una tabla de PostgreSQL: la tarea se persiste antes de responder, así que el lote se procesa aunque el analista cierre la pestaña.",
    },
    {
      title: "SHAP lazy, calculado al abrir la alerta",
      body: "Calcular SHAP para todo el lote ingerido sumaba latencia y era trabajo desperdiciado: en la práctica, un analista revisa la explicación de 2 o 3 alertas, no de todas. Se calcula la primera vez que se abre el detalle y queda cacheado en el PredictionLog.",
    },
    {
      title: "Normalizar la tabla de 45 columnas",
      body: "El modelo Alert mezclaba datos de entrada del ML, predicción, investigación y cierre de incidente. Lo separé en seis tablas (Alert, AlertWorkflow, Incident, ModelVersion, PredictionLog, Dataset) con una migración de datos en tres pasos, para que un backfill fallido se pueda reintentar sin haber borrado las columnas viejas.",
    },
  ],
  archIntro:
    "Una alerta entra por la subida manual o por el conector de Splunk, pasa por el mismo pipeline de limpieza y termina en una cola filtrada por el rol del analista.",
  flow: [
    {
      stage: "Ingesta",
      boxes: [
        { title: "Subida CSV / JSON", sub: "pipeline de limpieza" },
        { title: "Conector Splunk", sub: "REST · polling por conector" },
      ],
    },
    {
      stage: "Procesamiento",
      boxes: [
        { title: "django-q2", sub: "cola en PostgreSQL, sin Redis" },
        { title: "Random Forest → LightGBM", sub: "clasificación en 2 etapas" },
        { title: "SHAP", sub: "al abrir la alerta, cacheado" },
      ],
    },
    {
      stage: "Salida",
      boxes: [
        { title: "Cola por rol", sub: "N1 / N2 / N3 · filtro en el servidor" },
        { title: "Incidentes", sub: "escalamiento + causa raíz" },
      ],
    },
  ],
  flowCaption:
    "Flujo de una alerta, desde la ingesta hasta la cola del analista.",
  archWhy: [
    "La visibilidad por rol se aplica en el queryset, no ocultando elementos en la interfaz: un analista N1 nunca recibe del servidor una alerta clasificada como maliciosa.",
    "La interfaz web usa sesiones de Django y la API REST usa JWT, a propósito por separado: la API está pensada para integraciones externas como SIEM o SOAR, con un ciclo de vida de credenciales distinto al del analista.",
    "El costo: el worker de django-q2 corre en el mismo contenedor que gunicorn, así que no escala por separado. Con el volumen de la tesis es aceptable; con el de un SOC grande, sería lo primero a separar.",
  ],
  screenshots: [
    {
      src: "/cola-alertas.png",
      caption:
        "Cola de alertas ordenada por prioridad, con la clasificación del modelo y el risk score.",
    },
    {
      src: "/detalle-alerta.png",
      caption:
        "Detalle de una alerta maliciosa: probabilidades por clase, risk score y acción del sistema.",
    },
    {
      src: "/graficos-shap.png",
      caption:
        "Explicación SHAP de las dos etapas: qué features empujan la alerta hacia malicioso y cuáles la alejan.",
    },
    {
      src: "/conexion-splunk.png",
      caption:
        "Conector real con Splunk: polling con intervalo configurable por conector (5 minutos por defecto) y sincronización incremental.",
    },
  ],
  snippet: {
    file: "predictor/views.py",
    lang: "python",
    code: `# Subir miles de alertas no puede depender de que el analista deje la
# pestaña abierta: el lote se persiste como tarea ANTES de responder.
@login_required
@analyst_required
def pipeline_normalize_view(request):
    ...
    if request.method == 'POST':
        # Idempotente: un doble envío no encola el lote dos veces.
        if request.session.get('pipeline_already_saved'):
            return redirect('pipeline_preview')

        clean, stats = clean_records(records)   # mismo pipeline que usa Splunk
        ...
        dataset = Dataset.objects.create(
            filename=filename,
            row_count=len(clean),
            uploaded_by=request.user,
        )
        async_task('predictor.tasks.process_alert_batch',
                   dataset.pk, clean, request.user.pk)

        # El navegador consulta el estado del dataset cada 2 s.
        request.session['pipeline_dataset_id'] = dataset.pk
        request.session['pipeline_already_saved'] = True
        log_action(request.user, ACTION_PIPELINE_NORMALIZATION, ...)
        return redirect('pipeline_preview')`,
    note: "Extracto simplificado. Los comentarios son anotaciones para este case study.",
  },
  video: {
    youtubeId: "XbaL3qdgyqY",
    caption:
      "Demo sin narración con datos de prueba anonimizados: conexión con Splunk, cola de alertas, detalle de una alerta y el paso de alerta a incidente hasta su resolución.",
  },
  results: [
    {
      value: "98.9%",
      label: "recall en alertas maliciosas (19 de 1,800 se escapan)",
    },
    { value: "0.83", label: "F1-macro sobre 6,600 alertas de prueba" },
    {
      value: "−40.5%",
      label: "tiempo de revisión por alerta (11.65 → 6.93 min, 12 analistas)",
    },
  ],
  tradeoff:
    "El sesgo hacia el recall tiene un costo explícito: 527 alertas benignas se escalan como maliciosas en el set de prueba. Es una decisión, no un accidente: en triaje, un falso positivo cuesta un minuto del analista; un falso negativo, un ataque sin detectar.",
  validation:
    "Lo validamos con un experimento intrasujeto: 12 analistas N1, N2 y N3 de un SOC de Lima trabajaron con alertas históricas reales de 2025, primero sin el sistema y después con él. El tiempo de revisión bajó 40.5%, la exactitud de clasificación pasó de 95% a 97.5% y el cumplimiento de SLA de 92.5% a 97.5%. En la encuesta ISO/IEC 25010 obtuvo 4.30 sobre 5, con la explicabilidad SHAP entre lo mejor valorado y la fiabilidad como punto más débil. Con 12 participantes, los resultados son descriptivos, no estadísticamente concluyentes.",
  learnings: [
    "SHAP: aprendí a hacer explicable un modelo de árboles, y que en seguridad la explicación es lo que hace que el analista use el modelo.",
    "Desplegaría el modelo como un servicio aparte (por ejemplo, con FastAPI) en lugar de dentro del monolito Django: el modelo se reentrena y versiona a otro ritmo que la app, y separarlo permite escalarlo y cambiarlo sin redeployar todo.",
    "Pasaría a la tarea solo el id del dataset, con los registros en una tabla de staging: hoy la lista completa viaja en la sesión y en la cola, y con 100,000 alertas eso no escala.",
  ],
};

const socEn: CaseStudy = {
  slug: "soc-ml",
  projectId: 1,
  kicker: "Case study · 01",
  title: "SOC alert prioritization with Machine Learning",
  description:
    "How I built a system that prioritizes and explains security alerts for SOC analysts: two-stage classification with Random Forest and LightGBM, SHAP explanations, a Splunk connector and an experiment with 12 analysts.",
  tags: [
    "Python",
    "Django",
    "LightGBM",
    "scikit-learn",
    "SHAP",
    "PostgreSQL",
    "Azure",
    "Thesis",
  ],
  meta: [
    { label: "Role", value: "Built the whole system" },
    { label: "Duration", value: "9 months (Mar–Nov 2026)" },
    { label: "Team", value: "2 people" },
    { label: "Status", value: "Completed" },
  ],
  context: [
    "In a real SOC, analysts get far more alerts than they can review by hand. Alerts are handled in arrival order, so a real attack can sit buried under low-severity noise, which directly hurts the team's MTTD and MTTR.",
    "The problem wasn't just classifying: it was getting the analyst to trust the classification. An opaque score doesn't get adopted, it gets ignored.",
  ],
  rolePara:
    "I built the whole system: the model, the Django backend, the asynchronous ingestion, the Splunk connector and the Azure deployment. Giancarlo Moreno owned the dataset, the flow diagrams and Scrum management.",
  decisions: [
    {
      title: "A hierarchical classifier biased toward recall",
      body: "An error doesn't cost the same across the three classes: missing a real attack is far more expensive than making an analyst dismiss a false alarm. Stage 1 (Random Forest) separates malicious from the rest, with the malicious class weighted x2; stage 2 (LightGBM) tells 'investigate' from 'benign' only among what stage 1 didn't flag.",
    },
    {
      title: "Asynchronous ingestion with django-q2, not Celery",
      body: "The Azure student plan budget couldn't cover a managed Redis, which Celery needs as its broker. django-q2 keeps the queue in a PostgreSQL table: the task is persisted before responding, so the batch gets processed even if the analyst closes the tab.",
    },
    {
      title: "Lazy SHAP, computed when the alert is opened",
      body: "Computing SHAP for the whole ingested batch added latency and was wasted work: in practice an analyst reads the explanation for 2 or 3 alerts, not all of them. It's computed the first time the detail view opens and cached in the PredictionLog.",
    },
    {
      title: "Normalizing the 45-column table",
      body: "The Alert model mixed ML input data, prediction, investigation and incident closure. I split it into six tables (Alert, AlertWorkflow, Incident, ModelVersion, PredictionLog, Dataset) with a three-step data migration, so a failed backfill can be retried before the old columns are dropped.",
    },
  ],
  archIntro:
    "An alert comes in through a manual upload or the Splunk connector, goes through the same cleaning pipeline and lands in a queue filtered by the analyst's role.",
  flow: [
    {
      stage: "Ingestion",
      boxes: [
        { title: "CSV / JSON upload", sub: "cleaning pipeline" },
        { title: "Splunk connector", sub: "REST · per-connector polling" },
      ],
    },
    {
      stage: "Processing",
      boxes: [
        { title: "django-q2", sub: "queue in PostgreSQL, no Redis" },
        { title: "Random Forest → LightGBM", sub: "2-stage classification" },
        { title: "SHAP", sub: "on opening the alert, cached" },
      ],
    },
    {
      stage: "Output",
      boxes: [
        { title: "Role-based queue", sub: "N1 / N2 / N3 · server-side filter" },
        { title: "Incidents", sub: "escalation + root cause" },
      ],
    },
  ],
  flowCaption: "One alert's path, from ingestion to the analyst's queue.",
  archWhy: [
    "Role visibility is enforced in the queryset, not by hiding elements in the UI: an N1 analyst never receives an alert classified as malicious from the server.",
    "The web UI uses Django sessions and the REST API uses JWT, deliberately kept apart: the API is meant for external integrations such as a SIEM or SOAR, with a credential lifecycle different from the analyst's.",
    "The cost: the django-q2 worker runs in the same container as gunicorn, so it can't scale on its own. At the thesis's volume that's acceptable; at a large SOC's, it would be the first thing to split out.",
  ],
  screenshots: [
    {
      src: "/cola-alertas.png",
      caption:
        "Alert queue sorted by priority, with the model's classification and the risk score.",
    },
    {
      src: "/detalle-alerta.png",
      caption:
        "Detail of a malicious alert: per-class probabilities, risk score and the system's action.",
    },
    {
      src: "/graficos-shap.png",
      caption:
        "SHAP explanation for both stages: which features push the alert toward malicious and which pull it away.",
    },
    {
      src: "/conexion-splunk.png",
      caption:
        "Real Splunk connector: polling on a per-connector interval (5 minutes by default) with incremental sync.",
    },
  ],
  snippet: {
    file: "predictor/views.py",
    lang: "python",
    code: `# Uploading thousands of alerts can't depend on the analyst keeping
# the tab open: the batch is persisted as a task BEFORE responding.
@login_required
@analyst_required
def pipeline_normalize_view(request):
    ...
    if request.method == 'POST':
        # Idempotent: a double submit doesn't enqueue the batch twice.
        if request.session.get('pipeline_already_saved'):
            return redirect('pipeline_preview')

        clean, stats = clean_records(records)   # same pipeline Splunk uses
        ...
        dataset = Dataset.objects.create(
            filename=filename,
            row_count=len(clean),
            uploaded_by=request.user,
        )
        async_task('predictor.tasks.process_alert_batch',
                   dataset.pk, clean, request.user.pk)

        # The browser polls the dataset status every 2 s.
        request.session['pipeline_dataset_id'] = dataset.pk
        request.session['pipeline_already_saved'] = True
        log_action(request.user, ACTION_PIPELINE_NORMALIZATION, ...)
        return redirect('pipeline_preview')`,
    note: "Simplified extract. The comments are annotations for this case study.",
  },
  video: {
    youtubeId: "XbaL3qdgyqY",
    caption:
      "Silent demo with anonymized test data: Splunk connection, alert queue, an alert's detail, and turning an alert into an incident through to its resolution.",
  },
  results: [
    {
      value: "98.9%",
      label: "recall on malicious alerts (19 of 1,800 slip through)",
    },
    { value: "0.83", label: "F1-macro over 6,600 test alerts" },
    {
      value: "−40.5%",
      label: "review time per alert (11.65 → 6.93 min, 12 analysts)",
    },
  ],
  tradeoff:
    "Biasing toward recall has an explicit cost: 527 benign alerts get escalated as malicious in the test set. It's a decision, not an accident: in triage, a false positive costs an analyst a minute; a false negative, an undetected attack.",
  validation:
    "We validated it with a within-subjects experiment: 12 N1, N2 and N3 analysts from a SOC in Lima worked through real historical alerts from 2025, first without the system and then with it. Review time dropped 40.5%, classification accuracy went from 95% to 97.5% and SLA compliance from 92.5% to 97.5%. In the ISO/IEC 25010 survey it scored 4.30 out of 5, with SHAP explainability among the best-rated aspects and reliability as the weakest. With 12 participants, the results are descriptive, not statistically conclusive.",
  learnings: [
    "SHAP: I learned to make a tree model explainable, and that in security the explanation is what gets the analyst to actually use the model.",
    "I'd deploy the model as a separate service (for example, with FastAPI) instead of inside the Django monolith: the model is retrained and versioned at a different pace than the app, and splitting it lets it scale and change without redeploying everything.",
    "I'd pass only the dataset id to the task, with the records in a staging table: today the full list travels through the session and the queue, and at 100,000 alerts that doesn't scale.",
  ],
};

const byLocale: Record<Locale, CaseStudy[]> = {
  es: [socEs],
  en: [socEn],
};

export const getCaseStudy = (slug: string, locale: Locale = defaultLocale) =>
  byLocale[locale].find((c) => c.slug === slug);

// Locale-independent lookups (slug, projectId) read from the default list.
export const caseStudies = byLocale[defaultLocale];
