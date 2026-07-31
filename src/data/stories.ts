import type { Localized, Project } from '@/data/content';

const l = (es: string, en: string): Localized => ({ es, en });

export type ModuleStory = Readonly<{
  steps: readonly [Localized, Localized, Localized];
  implementation: Localized;
}>;

export const projectNarratives: Readonly<Record<Project['slug'], readonly Localized[]>> = {
  portal: [
    l(
      'FER&REN no necesitaba una colección de formularios aislados, sino una forma coherente de seguir el trabajo desde que una persona inicia su jornada hasta que un vehículo termina un servicio. El Portal conecta esas decisiones en un mismo sistema de identidad, permisos, datos y evidencia.',
      'FER&REN did not need a collection of isolated forms, but a coherent way to follow work from the moment a person starts a shift until a vehicle completes a service. The Portal connects those decisions through one identity, permission, data, and evidence system.',
    ),
    l(
      'La primera etapa resolvió cinco procesos con Flutter y Supabase. Cuando la operación creció, migré esos flujos a Astro SSR, Preact y Directus para centralizar acceso, reducir aplicaciones separadas y permitir que cada área compartiera información sin perder sus reglas particulares.',
      'The first stage solved five processes with Flutter and Supabase. As operations grew, I migrated those flows to Astro SSR, Preact, and Directus to centralize access, reduce separate applications, and let each area share information without losing its specific rules.',
    ),
    l(
      'La continuidad operativa también pasó a formar parte del producto. Servicios en Go supervisan recordatorios y salud de la infraestructura, mientras PostgreSQL, Patroni, etcd, contenedores y túneles protegidos permiten recuperar servicios y registrar cada intervención.',
      'Operational continuity also became part of the product. Go services supervise reminders and infrastructure health, while PostgreSQL, Patroni, etcd, containers, and protected tunnels support service recovery and record every intervention.',
    ),
  ],
  '2free': [
    l(
      '2 Free parte de una decisión de producto: una herramienta financiera debe seguir siendo útil aunque no exista una cuenta, una suscripción o una conexión disponible. Por eso el dominio monetario y los casos de uso no dependen del runtime web ni del nativo.',
      '2 Free starts with a product decision: a financial tool should remain useful without an account, subscription, or available connection. The monetary domain and use cases therefore do not depend on either the web or native runtime.',
    ),
    l(
      'La misma experiencia puede operar en modo invitado, conectarse a una API administrada, usar una instancia autohospedada o mantener su información cifrada completamente en el dispositivo. Los contratos de datos permiten cambiar de modalidad sin reescribir las reglas financieras.',
      'The same experience can run in guest mode, connect to a managed API, use a self-hosted instance, or keep encrypted information entirely on the device. Data contracts allow modes to change without rewriting financial rules.',
    ),
    l(
      'El proyecto se entrega como aplicación web, AppImage para Linux y APK ARM64 para Android. Las publicaciones incluyen artefactos verificables, mientras la arquitectura separa autenticación, persistencia, sincronización y presentación para que cada plataforma asuma solo las capacidades que necesita.',
      'The project ships as a web application, a Linux AppImage, and an ARM64 Android APK. Releases include verifiable artifacts, while the architecture separates authentication, persistence, synchronization, and presentation so each platform assumes only the capabilities it needs.',
    ),
  ],
};

export const moduleStories: Readonly<Record<Project['slug'], Readonly<Record<string, ModuleStory>>>> = {
  portal: {
    asistencia: {
      steps: [
        l('La persona selecciona el evento de jornada y el sistema obtiene horario, ubicación y contexto.', 'The person selects a shift event and the system obtains schedule, location, and context.'),
        l('Las reglas validan entrada, comida o salida y marcan diferencias que requieren revisión.', 'Rules validate check-in, meal, or check-out and flag differences that require review.'),
        l('Administración consulta la bitácora por fecha, persona e incidencia sin alterar el registro original.', 'Administration reviews the log by date, person, and incident without altering the original record.'),
      ],
      implementation: l('La interfaz combina validación inmediata con persistencia trazable. El horario del empleado determina qué acción corresponde, la ubicación aporta contexto operativo y las incidencias permanecen disponibles para revisión en lugar de desaparecer detrás de un resultado binario.', 'The interface combines immediate validation with traceable persistence. The employee schedule determines the expected action, location adds operational context, and incidents remain available for review instead of disappearing behind a binary result.'),
    },
    estudio: {
      steps: [
        l('Recepción registra vehículo, servicios, pagos, inventario encontrado y responsables.', 'Intake records the vehicle, services, payments, found inventory, and responsible staff.'),
        l('El trabajo avanza por etapas con responsables, fotografías, videos, notas y firmas.', 'Work advances through stages with owners, photographs, videos, notes, and signatures.'),
        l('El cliente consulta un resumen público mediante un código sin acceder al sistema interno.', 'The customer views a public summary through a code without accessing the internal system.'),
      ],
      implementation: l('El flujo une operación interna y comunicación con el cliente sin exponer permisos administrativos. La evidencia se asocia a etapas concretas, los pagos conservan su momento dentro del proceso y el acceso público presenta solo el estado necesario para el seguimiento.', 'The flow connects internal operations and customer communication without exposing administrative permissions. Evidence is attached to specific stages, payments retain their place in the process, and public access presents only the state required for tracking.'),
    },
    'control-servicios': {
      steps: [
        l('Un servicio PPF, Wrap o Clear se divide en tareas y responsables verificables.', 'A PPF, Wrap, or Clear service is divided into verifiable tasks and owners.'),
        l('Cada etapa reúne checklist, evidencia y observaciones antes de solicitar aprobación.', 'Each stage gathers a checklist, evidence, and notes before requesting approval.'),
        l('La revisión y el cierre administrativo consolidan el historial y generan el documento final.', 'Review and administrative closure consolidate the timeline and generate the final document.'),
      ],
      implementation: l('Las etapas evitan que una instalación se considere completa solo por cambiar un estado. Cada transición exige el contexto correspondiente, conserva quién realizó la acción y permite reconstruir el servicio desde la asignación hasta el PDF de cierre.', 'Stages prevent an installation from being considered complete merely by changing a status. Every transition requires its corresponding context, preserves who performed the action, and allows the service to be reconstructed from assignment through the closing PDF.'),
    },
    'revision-vehiculos': {
      steps: [
        l('Recepción documenta zonas interiores y exteriores mediante checklist y comentarios.', 'Intake documents interior and exterior zones through checklists and notes.'),
        l('Se registran productos PPF, condiciones especiales y firmas según el servicio.', 'PPF products, special conditions, and signatures are recorded according to the service.'),
        l('Tres etapas de validación aseguran que la revisión quede completa antes de continuar.', 'Three validation stages ensure the inspection is complete before work continues.'),
      ],
      implementation: l('La revisión se modela como información estructurada, no como una nota libre. Zonas, opciones y requisitos de firma pueden evolucionar sin perder los registros anteriores, y el cierre impide avanzar cuando falta una confirmación necesaria.', 'The inspection is modeled as structured information rather than a free-form note. Zones, options, and signature requirements can evolve without losing earlier records, and closure prevents progress while a required confirmation is missing.'),
    },
    'inventario-ppf': {
      steps: [
        l('Cada entrada identifica material, rollo, metros disponibles y ubicación física.', 'Each receipt identifies material, roll, available meters, and physical location.'),
        l('Traslados, conversiones, consumos y ventas generan movimientos explícitos.', 'Transfers, conversions, consumption, and sales generate explicit movements.'),
        l('La administración consulta existencias e historial para conciliar diferencias.', 'Administration reviews stock and history to reconcile differences.'),
      ],
      implementation: l('El inventario distingue rollos completos de metros sueltos para representar cómo se utiliza realmente el material. En lugar de sobrescribir una cantidad, cada operación produce una entrada de historial que explica el origen del saldo actual.', 'Inventory distinguishes complete rolls from loose meters to represent how material is actually used. Instead of overwriting a quantity, each operation creates a history entry that explains the origin of the current balance.'),
    },
    ventas: {
      steps: [
        l('La venta reúne vendedor, cliente, productos, importes, pago y contexto comercial.', 'A sale gathers seller, customer, products, amounts, payment, and commercial context.'),
        l('Los permisos limitan lectura y edición según el rol, mientras el catálogo mantiene precios y unidades.', 'Permissions limit reading and editing by role, while the catalog maintains prices and units.'),
        l('Análisis y exportaciones agrupan resultados por producto, cliente, periodo y comisión.', 'Analysis and exports group results by product, customer, period, and commission.'),
      ],
      implementation: l('Registro y análisis comparten el mismo modelo para evitar reportes desconectados de la operación. La paginación mantiene utilizable el historial, los parches optimistas mejoran la respuesta de la interfaz y la exportación permite continuar análisis fuera del portal.', 'Entry and analysis share the same model so reports do not drift away from operations. Pagination keeps history usable, optimistic patches improve interface response, and exports allow analysis to continue outside the portal.'),
    },
    finanzas: {
      steps: [
        l('Ingresos y egresos se registran con fecha, categoría, importe y referencia.', 'Income and expenses are recorded with date, category, amount, and reference.'),
        l('El sistema calcula saldos y agrupaciones semanales, quincenales o mensuales.', 'The system calculates balances and weekly, biweekly, or monthly groupings.'),
        l('Los reportes exportables conservan el detalle que explica cada resultado.', 'Exportable reports retain the detail that explains every result.'),
      ],
      implementation: l('La vista financiera prioriza trazabilidad antes que indicadores aislados. Cada resumen puede volver a sus movimientos de origen, los catálogos normalizan conceptos y los periodos permiten comparar la operación con una base consistente.', 'The finance view prioritizes traceability over isolated indicators. Every summary can return to its source movements, catalogs normalize concepts, and periods make operational comparisons consistent.'),
    },
    'cotizador-ppf': {
      steps: [
        l('La persona selecciona vehículo, marca, producto y tipo de cobertura.', 'The user selects a vehicle, brand, product, and coverage type.'),
        l('Factores de material, medidas y mano de obra componen el cálculo de precio.', 'Material, measurement, and labor factors compose the price calculation.'),
        l('La propuesta presenta opciones visuales y un resultado preparado para compartir.', 'The proposal presents visual options and a result prepared for sharing.'),
      ],
      implementation: l('El cálculo separa datos administrables de la presentación comercial. Marcas, productos y factores se actualizan sin modificar el flujo de cotización, mientras la salida conserva suficiente contexto para explicar de dónde proviene el precio.', 'The calculation separates administrable data from commercial presentation. Brands, products, and factors can change without modifying the quoting flow, while the output preserves enough context to explain where the price comes from.'),
    },
    notificaciones: {
      steps: [
        l('Eventos del portal y horarios operativos generan señales pendientes.', 'Portal events and operational schedules generate pending signals.'),
        l('Un servicio Go consulta reglas, destinatarios y ventanas de envío.', 'A Go service evaluates rules, recipients, and delivery windows.'),
        l('Web Push entrega recordatorios y cambios de estado sin mantener abierta la aplicación.', 'Web Push delivers reminders and status changes without keeping the application open.'),
      ],
      implementation: l('La entrega se mantiene fuera del ciclo de renderizado del portal. El servicio puede ejecutarse de forma programada, registrar resultados y reintentar de manera controlada, mientras los eventos inmediatos notifican asignaciones, etapas y nueva evidencia.', 'Delivery remains outside the portal rendering cycle. The service can run on schedule, record results, and retry in a controlled way, while immediate events notify assignments, stages, and new evidence.'),
    },
    'infraestructura-ha': {
      steps: [
        l('El agente comprueba Directus, PostgreSQL/Patroni, etcd y contenedores.', 'The agent checks Directus, PostgreSQL/Patroni, etcd, and containers.'),
        l('Las reglas distinguen degradación, pérdida de líder y fallos que permiten recuperación.', 'Rules distinguish degradation, leader loss, and failures that allow recovery.'),
        l('Reconciliación, failover, failback y reinicios quedan registrados en una bitácora.', 'Reconciliation, failover, failback, and restarts are recorded in an operations log.'),
      ],
      implementation: l('La herramienta no presenta un botón de failover sin contexto. Antes de actuar reúne salud del clúster y liderazgo, limita operaciones por permisos y registra el resultado para que una recuperación pueda revisarse después.', 'The tool does not present a context-free failover button. Before acting, it gathers cluster health and leadership, restricts operations by permission, and records the outcome so a recovery can be reviewed later.'),
    },
  },
  '2free': {
    web: {
      steps: [l('El modo invitado inicia con un conjunto financiero ficticio y descartable.', 'Guest mode starts with a fictional, disposable financial dataset.'), l('Cuentas, movimientos, presupuestos y metas comparten reglas monetarias exactas.', 'Accounts, transactions, budgets, and goals share exact monetary rules.'), l('La información puede exportarse o migrar a una modalidad persistente.', 'Information can be exported or moved to a persistent mode.')],
      implementation: l('Next.js compone rutas y entrega, mientras React utiliza casos de uso compartidos en lugar de duplicar reglas en cada pantalla. El modo invitado permite evaluar la experiencia completa sin registro y sin mezclar datos de demostración con cuentas reales.', 'Next.js composes routes and delivery, while React uses shared use cases instead of duplicating rules on every screen. Guest mode makes the complete experience evaluable without registration and without mixing demo data with real accounts.'),
    },
    landing: {
      steps: [l('La portada explica modalidades y plataformas sin exigir JavaScript.', 'The landing page explains modes and platforms without requiring JavaScript.'), l('Cada descarga comunica formato, arquitectura y estado de disponibilidad.', 'Each download communicates format, architecture, and availability.'), l('La guía de autohospedaje separa evaluación del producto y operación del stack.', 'The self-hosting guide separates product evaluation from stack operation.')],
      implementation: l('Astro genera una superficie rápida e indexable con metadatos y contenido estructurado. Las mejoras animadas son progresivas y los enlaces de descarga dependen de artefactos publicados, no de promesas visuales.', 'Astro generates a fast, indexable surface with metadata and structured content. Motion enhancements are progressive, and download links depend on published artifacts rather than visual promises.'),
    },
    desktop: {
      steps: [l('La aplicación obtiene o crea una llave mediante el almacén seguro del sistema.', 'The app retrieves or creates a key through the system secure store.'), l('SQLCipher conserva el dominio financiero de forma local y transaccional.', 'SQLCipher keeps the financial domain local and transactional.'), l('La sincronización es opcional y se activa sin reemplazar el origen local.', 'Synchronization is optional and activates without replacing the local source.')],
      implementation: l('Tauri limita la frontera nativa a comandos explícitos y Rust controla base de datos, llaves y migraciones. La interfaz sigue utilizando los mismos casos de uso que la web, pero puede iniciar y operar sin cuenta ni conectividad.', 'Tauri limits the native boundary to explicit commands, while Rust controls storage, keys, and migrations. The interface continues using the same use cases as the web but can start and operate without an account or connectivity.'),
    },
    mobile: {
      steps: [l('Android obtiene la llave local desde Keystore.', 'Android obtains the local key from Keystore.'), l('El mismo dominio y base cifrada ejecutan la experiencia local-first.', 'The same domain and encrypted database run the local-first experience.'), l('El APK ARM64 se firma y publica como artefacto verificable.', 'The ARM64 APK is signed and published as a verifiable artifact.')],
      implementation: l('La aplicación móvil reutiliza el núcleo Tauri sin fingir paridad donde la plataforma requiere otro tratamiento. El manejo de llaves se adapta a Android y la publicación se limita a la plataforma realmente entregada.', 'The mobile app reuses the Tauri core without pretending parity where the platform requires different treatment. Key management adapts to Android, and publication is limited to the platform that is actually shipped.'),
    },
    api: {
      steps: [l('La sesión establece identidad y alcance del propietario.', 'The session establishes identity and owner scope.'), l('Casos de uso validan contratos, idempotencia y reglas financieras.', 'Use cases validate contracts, idempotency, and financial rules.'), l('Prisma persiste en PostgreSQL con aislamiento y campos protegidos.', 'Prisma persists to PostgreSQL with isolation and protected fields.')],
      implementation: l('NestJS organiza adaptadores HTTP alrededor de una capa de aplicación que no depende del controlador. Better Auth resuelve sesión compartida, mientras las consultas mantienen el propietario como parte obligatoria del acceso a datos.', 'NestJS organizes HTTP adapters around an application layer that does not depend on controllers. Better Auth resolves shared sessions, while queries keep ownership as a mandatory part of data access.'),
    },
    arquitectura: {
      steps: [l('Core define dinero, entidades y reglas sin depender de frameworks.', 'Core defines money, entities, and rules without framework dependencies.'), l('Application coordina casos de uso mediante puertos de datos e identidad.', 'Application coordinates use cases through data and identity ports.'), l('Web y runtimes nativos conectan adaptadores sin cambiar el dominio.', 'Web and native runtimes connect adapters without changing the domain.')],
      implementation: l('La separación permite probar reglas monetarias y contratos sin levantar una aplicación completa. Los paquetes compartidos establecen dependencias en una sola dirección y dejan que PostgreSQL, SQLCipher o el modo invitado implementen el mismo puerto.', 'The separation makes monetary rules and contracts testable without booting a complete application. Shared packages establish one-way dependencies and let PostgreSQL, SQLCipher, or guest mode implement the same port.'),
    },
  },
};

export const technologyInsights: Readonly<Record<string, Localized>> = {
  html: l('HTML define la estructura y el significado antes de que existan estilos o scripts. Lo utilizo para que navegación, contenido y formularios sigan siendo comprensibles para buscadores, tecnologías de asistencia y navegadores con capacidades limitadas.', 'HTML defines structure and meaning before styles or scripts exist. I use it so navigation, content, and forms remain understandable to search engines, assistive technologies, and browsers with limited capabilities.'),
  css: l('CSS resuelve presentación y adaptación directamente en el navegador. Prefiero apoyarme en flujo, grid, flexbox y consultas responsivas antes de trasladar al JavaScript decisiones que pertenecen al sistema visual.', 'CSS handles presentation and adaptation directly in the browser. I prefer relying on flow, grid, flexbox, and responsive queries before moving decisions that belong to the visual system into JavaScript.'),
  astro: l('Astro permite elegir dónde existe interactividad en lugar de convertir toda la página en una aplicación cliente. Lo utilizo cuando el contenido, el SEO y la entrega inicial importan, y reservo islas o scripts para los estados que realmente los necesitan.', 'Astro lets me choose where interactivity exists instead of turning the whole page into a client application. I use it when content, SEO, and initial delivery matter, reserving islands or scripts for states that truly need them.'),
  preact: l('Preact mantiene una API de componentes familiar con un runtime menor. En el Portal funciona como una capa localizada para filtros, formularios y estados complejos dentro de páginas que siguen resolviendo datos y permisos en el servidor.', 'Preact keeps a familiar component API with a smaller runtime. In the Portal it acts as a localized layer for filters, forms, and complex state inside pages that still resolve data and permissions on the server.'),
  flutter: l('Flutter permitió entregar rápidamente las primeras herramientas internas con una experiencia consistente. También mostró el costo de mantener aplicaciones separadas cuando los procesos comenzaron a compartir identidad y datos, motivo de la posterior consolidación web.', 'Flutter enabled the first internal tools to ship quickly with a consistent experience. It also exposed the cost of maintaining separate applications once processes began sharing identity and data, which motivated the later web consolidation.'),
  supabase: l('Supabase redujo el tiempo necesario para validar los primeros flujos conectados sobre PostgreSQL. Cuando la continuidad y el control operativo se volvieron prioritarios, esos servicios dieron paso a una topología propia con Directus y PostgreSQL administrado por el equipo.', 'Supabase reduced the time needed to validate the first connected workflows on PostgreSQL. When continuity and operational control became priorities, those services gave way to a self-managed topology with Directus and PostgreSQL.'),
  react: l('React aporta composición y un modelo declarativo adecuado para el estado financiero de 2 Free. Su valor principal en el proyecto no es la biblioteca aislada, sino poder compartir la misma interfaz y casos de uso entre Next.js y Tauri.', 'React provides composition and a declarative model suited to 2 Free financial state. Its main value in the project is not the library in isolation, but sharing the same interface and use cases across Next.js and Tauri.'),
  nextjs: l('Next.js entrega la aplicación web de 2 Free y conecta renderizado, rutas y límites de servidor. La lógica financiera permanece fuera del framework para que una decisión de entrega web no determine cómo funciona el dominio.', 'Next.js delivers the 2 Free web application and connects rendering, routes, and server boundaries. Financial logic remains outside the framework so a web delivery decision does not determine how the domain works.'),
  typescript: l('TypeScript convierte contratos entre capas en información verificable por herramientas. Lo utilizo para que cambios en datos, autenticación o casos de uso fallen durante desarrollo en lugar de aparecer como estados inconsistentes en producción.', 'TypeScript turns layer contracts into tool-verifiable information. I use it so changes in data, authentication, or use cases fail during development instead of surfacing as inconsistent production states.'),
  javascript: l('JavaScript sigue siendo la capa de ejecución universal del navegador. Lo utilizo de forma progresiva: el contenido y las rutas permanecen disponibles primero, y el comportamiento cliente se añade cuando mejora una tarea concreta.', 'JavaScript remains the browser universal execution layer. I use it progressively: content and routes remain available first, and client behavior is added when it improves a specific task.'),
  go: l('Go resulta adecuado para agentes y servicios operativos porque produce binarios pequeños, concurrencia explícita y despliegues predecibles. En el Portal separa monitoreo y notificaciones del ciclo de vida de la aplicación web.', 'Go suits operational agents and services because it produces small binaries, explicit concurrency, and predictable deployments. In the Portal it separates monitoring and notifications from the web application lifecycle.'),
  nodejs: l('Node.js permite compartir lenguaje, tipos y herramientas entre aplicaciones web y servicios. Lo utilizo como runtime de APIs y automatización, manteniendo las reglas del dominio separadas para que no dependan de detalles del proceso o del framework.', 'Node.js allows web applications and services to share a language, types, and tooling. I use it as the runtime for APIs and automation while keeping domain rules separate so they do not depend on process or framework details.'),
  nestjs: l('NestJS aporta estructura cuando una API necesita módulos, validación, autenticación y adaptadores claros. En 2 Free lo mantengo en el borde: los controladores coordinan transporte, mientras los casos de uso conservan las reglas del producto.', 'NestJS adds structure when an API needs modules, validation, authentication, and clear adapters. In 2 Free I keep it at the edge: controllers coordinate transport while use cases retain product rules.'),
  'better-auth': l('Better Auth centraliza sesiones y cookies sin convertir la identidad en una regla financiera. La integración comparte contratos entre web y API y mantiene explícitos los orígenes y límites de confianza.', 'Better Auth centralizes sessions and cookies without turning identity into a financial rule. The integration shares contracts between web and API and keeps origins and trust boundaries explicit.'),
  prisma: l('Prisma aporta un esquema legible, migraciones y consultas tipadas para la modalidad cloud. No sustituye las reglas de acceso: el aislamiento por propietario se mantiene en los casos de uso y consultas que rodean al ORM.', 'Prisma provides a readable schema, migrations, and typed queries for cloud mode. It does not replace access rules: owner isolation remains in the use cases and queries surrounding the ORM.'),
  postgresql: l('PostgreSQL es el origen transaccional cuando varias personas o servicios comparten estado. En ambos sistemas se elige por integridad y capacidad operativa, no solo por almacenar filas.', 'PostgreSQL is the transactional source when multiple people or services share state. In both systems it is chosen for integrity and operational capability, not merely for storing rows.'),
  sqlite: l('SQLite reduce la persistencia local a un archivo transaccional; SQLCipher añade cifrado sin cambiar el modelo de consulta. Esa combinación permite que 2 Free funcione sin servidor y mantenga un origen local protegido.', 'SQLite reduces local persistence to a transactional file; SQLCipher adds encryption without changing the query model. That combination lets 2 Free run without a server while keeping a protected local source of truth.'),
  tauri: l('Tauri permite reutilizar una interfaz web manteniendo una frontera nativa pequeña y explícita. En 2 Free esa frontera se limita a almacenamiento, llaves, archivos, notificaciones y capacidades que el navegador no debe controlar directamente.', 'Tauri reuses a web interface while keeping the native boundary small and explicit. In 2 Free that boundary is limited to storage, keys, files, notifications, and capabilities the browser should not control directly.'),
  rust: l('Rust controla el núcleo nativo donde los errores de memoria y los límites de recursos importan. Sus tipos hacen explícita la gestión de base cifrada, migraciones y comandos expuestos a la interfaz.', 'Rust controls the native core where memory errors and resource boundaries matter. Its types make encrypted storage, migrations, and commands exposed to the interface explicit.'),
  directus: l('Directus proporciona API, identidad, permisos y administración sobre datos SQL existentes. En el Portal evita construir un back office genérico, mientras la aplicación conserva los flujos especializados que la operación necesita.', 'Directus provides APIs, identity, permissions, and administration over existing SQL data. In the Portal it avoids building a generic back office while the application retains the specialized workflows operations require.'),
  docker: l('Docker convierte servicios y dependencias en unidades reproducibles de despliegue. Su utilidad aparece cuando el mismo stack debe levantarse, revisarse y recuperarse sin depender de configuraciones manuales invisibles.', 'Docker turns services and dependencies into reproducible deployment units. Its value appears when the same stack must be started, reviewed, and recovered without relying on invisible manual configuration.'),
  dokploy: l('Dokploy reúne despliegues y operación de contenedores en una superficie autohospedada. Lo utilizo para mantener explícitas la configuración, las versiones y el estado de los servicios sin renunciar al control de la infraestructura donde se ejecutan.', 'Dokploy brings container deployment and operations into a self-hosted surface. I use it to keep configuration, versions, and service state explicit without giving up control of the infrastructure where they run.'),
  cloudflare: l('Cloudflare separa la exposición pública de la ubicación física de los servicios. Los túneles y controles perimetrales permiten conectar nodos distribuidos sin abrir directamente cada origen.', 'Cloudflare separates public exposure from the physical location of services. Tunnels and edge controls connect distributed nodes without directly opening every origin.'),
  linux: l('Linux ofrece una base observable y automatizable para servidores y aplicaciones distribuidas. La elección implica asumir operación, actualizaciones y diagnóstico; por eso se acompaña de scripts, monitoreo y procedimientos de recuperación.', 'Linux provides an observable, automatable base for servers and distributed applications. The choice means owning operations, updates, and diagnostics, so it is paired with scripts, monitoring, and recovery procedures.'),
  bash: l('Bash conecta herramientas del sistema con scripts pequeños y auditables. Lo reservo para instalación, diagnóstico y orquestación directa; cuando el estado o la concurrencia crecen, traslado esa responsabilidad a una herramienta tipada.', 'Bash connects system tools through small, auditable scripts. I reserve it for installation, diagnostics, and direct orchestration; when state or concurrency grows, I move that responsibility to a typed tool.'),
  tailwindcss: l('Tailwind CSS mantiene decisiones visuales cerca del componente y facilita revisar variantes responsive. Su disciplina depende de tokens y patrones compartidos; sin ellos, las utilidades solo trasladan la inconsistencia al marcado.', 'Tailwind CSS keeps visual decisions near the component and makes responsive variants easy to review. Its discipline depends on shared tokens and patterns; without them, utilities merely move inconsistency into markup.'),
  vite: l('Vite reduce la fricción entre una edición y su resultado y produce bundles optimizados para entrega. En 2 Free también sirve como frontera de compilación para la interfaz que Tauri empaqueta.', 'Vite reduces friction between an edit and its result while producing optimized delivery bundles. In 2 Free it also serves as the compilation boundary for the interface packaged by Tauri.'),
  vitest: l('Vitest permite probar TypeScript cerca del entorno de compilación real. Lo utilizo para reglas y contratos donde una prueba rápida y determinista ofrece más valor que repetir el flujo completo en un navegador.', 'Vitest tests TypeScript close to the real build environment. I use it for rules and contracts where a fast, deterministic test provides more value than repeating the complete flow in a browser.'),
  playwright: l('Playwright verifica la experiencia desde el límite que observa una persona: rutas, interacción, accesibilidad y estados del navegador. Complementa las pruebas unitarias al detectar fallos de integración que los componentes aislados no muestran.', 'Playwright verifies the experience at the boundary a person observes: routes, interaction, accessibility, and browser state. It complements unit tests by finding integration failures isolated components do not expose.'),
  gsap: l('GSAP se utiliza cuando una secuencia necesita coordinación y limpieza explícitas, no para animar cada elemento. El contenido conserva un estado funcional sin movimiento y la línea temporal comunica activación o continuidad espacial.', 'GSAP is used when a sequence needs explicit coordination and cleanup, not to animate every element. Content retains a functional state without motion, and the timeline communicates activation or spatial continuity.'),
  pnpm: l('pnpm mantiene instalaciones reproducibles y reduce duplicación dentro de workspaces. En un monorepo permite que paquetes compartidos tengan límites claros sin convertir cada dependencia interna en una copia física.', 'pnpm keeps installs reproducible and reduces duplication across workspaces. In a monorepo it lets shared packages have clear boundaries without turning every internal dependency into a physical copy.'),
  git: l('Git registra decisiones como una secuencia revisable y permite aislar trabajo antes de integrarlo. Lo utilizo como parte del proceso de calidad: cambios, pruebas y documentación deben formar unidades que puedan entenderse y revertirse.', 'Git records decisions as a reviewable sequence and isolates work before integration. I use it as part of the quality process: changes, tests, and documentation should form units that can be understood and reverted.'),
};
