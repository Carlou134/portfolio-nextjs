// Case study content (preview). Real facts come from the thesis repo docs
// (README, docs/architecture.md, docs/model.md, docs/technical.md); anything
// still missing is flagged `mock: true` and rendered as a yellow MOCK block so
// it can't be mistaken for real data. Spanish only until commit 42.
//
// The page that renders this is dev-only (app/case-study/[slug]/page.tsx
// returns 404 in production) until commits 37-42 finish it.

export interface CaseStudy {
  slug: string;
  projectId: number;
  kicker: string;
  title: string;
  tags: string[];
  meta: { label: string; value: string; mock?: boolean }[];
  context: string[];
  rolePara: string;
  decisions: { title: string; body: string }[];
  archIntro: string;
  flow: { stage: string; boxes: { title: string; sub: string }[] }[];
  archWhy: string[];
  screenshots: { src?: string; caption: string; mock?: boolean }[];
  snippet: { file: string; lang: string; code: string; note: string };
  // YouTube video id. Without one the video section isn't rendered.
  video?: { youtubeId: string; caption: string };
  results: { value: string; label: string; mock?: boolean }[];
  tradeoff: string;
  validation: string;
  learnings: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "soc-ml",
    projectId: 1,
    kicker: "Case study · 01",
    title: "Priorización de alertas SOC con Machine Learning",
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
          {
            title: "Random Forest → LightGBM",
            sub: "clasificación en 2 etapas",
          },
          { title: "SHAP", sub: "al abrir la alerta, cacheado" },
        ],
      },
      {
        stage: "Salida",
        boxes: [
          {
            title: "Cola por rol",
            sub: "N1 / N2 / N3 · filtro en el servidor",
          },
          { title: "Incidentes", sub: "escalamiento + causa raíz" },
        ],
      },
    ],
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
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);
