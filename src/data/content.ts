export type Locale = 'es' | 'en';

export type Localized = Readonly<Record<Locale, string>>;

export type ProjectModule = Readonly<{
  slug: string;
  title: Localized;
  summary: Localized;
  detail: Localized;
  technologies: readonly string[];
}>;

export type Project = Readonly<{
  slug: 'infraestructura' | 'portal' | '2free' | 'pokedex' | 'ferren-landing';
  title: string;
  kicker: Localized;
  summary: Localized;
  description: Localized;
  role: Localized;
  period: string;
  technologies: readonly string[];
  highlights: readonly Localized[];
  modules: readonly ProjectModule[];
  repository?: string;
  liveUrl?: string;
  featured?: boolean;
  logo: string;
  image: string;
  imageAlt: Localized;
  private: boolean;
}>;

export type Technology = Readonly<{
  slug: string;
  name: string;
  logo?: string;
  logoOnDark?: string;
  category: Localized;
  summary: Localized;
  purpose: Localized;
  usage: Localized;
  projects: readonly Project['slug'][];
}>;

const l = (es: string, en: string): Localized => ({ es, en });

export const site = {
  name: 'Carlos Miranda',
  domain: 'https://camir.tech',
  email: 'carlosmir.code@gmail.com',
  github: 'https://github.com/camircode',
  linkedin: 'https://www.linkedin.com/in/camircode/',
  description: l(
    'Portfolio de Carlos Miranda, desarrollador de software y consultor DevOps: productos web, aplicaciones local-first e infraestructura declarativa sobre un servidor bare metal.',
    'Carlos Miranda’s portfolio: a software developer and DevOps consultant working on web products, local-first applications, and declarative infrastructure on a bare-metal server.',
  ),
} as const;

const infrastructureModules: readonly ProjectModule[] = [
  {
    slug: 'aprovisionamiento',
    title: l('Aprovisionamiento', 'Provisioning'),
    summary: l('Cinco stacks de Terraform con el estado fuera del servidor.', 'Five Terraform stacks with state kept off the server.'),
    detail: l(
      'El primer stack crea el bucket R2 donde vive el estado de todos los demás. Los siguientes describen el almacenamiento y las imágenes base del nodo, los contenedores y máquinas virtuales, el DNS y el bucket de respaldo, y el repositorio GitOps con sus claves de despliegue.',
      'The first stack creates the R2 bucket that holds every other stack’s state. The rest describe the node’s storage and base images, the containers and virtual machines, DNS and the backup bucket, and the GitOps repository with its deploy keys.',
    ),
    technologies: ['terraform', 'proxmox', 'cloudflare'],
  },
  {
    slug: 'configuracion',
    title: l('Configuración', 'Configuration'),
    summary: l('Ansible se ocupa de todo lo que ocurre dentro de un invitado.', 'Ansible owns everything that happens inside a guest.'),
    detail: l(
      'Terraform crea, Ansible configura, y el inventario se regenera desde la salida de Terraform en lugar de mantenerse a mano. Los scripts largos de remote-exec quedaron fuera a propósito: un script que termina con código 0 hace que el recurso reporte éxito mientras el estado deja de describir la realidad.',
      'Terraform creates, Ansible configures, and the inventory is regenerated from Terraform output instead of maintained by hand. Long remote-exec scripts were left out on purpose: a script that exits 0 makes the resource report success while state stops describing reality.',
    ),
    technologies: ['ansible', 'linux', 'bash'],
  },
  {
    slug: 'cluster',
    title: l('Clúster Kubernetes', 'Kubernetes cluster'),
    summary: l('Plano de control de tres miembros y un Gateway que termina TLS.', 'A three-member control plane and a Gateway that terminates TLS.'),
    detail: l(
      'Tres nodos de control comparten etcd y una dirección virtual; los nodos de trabajo quedan detrás de un Gateway que termina TLS con un certificado comodín que cert-manager renueva por DNS-01. Un miembro de etcd sin voto guarda snapshots fuera del servidor.',
      'Three control nodes share etcd and a virtual address; worker nodes sit behind a Gateway that terminates TLS with a wildcard certificate cert-manager renews over DNS-01. A non-voting etcd member keeps snapshots off the server.',
    ),
    technologies: ['kubernetes', 'linux', 'cloudflare'],
  },
  {
    slug: 'entrega',
    title: l('Cadena de entrega', 'Delivery chain'),
    summary: l('De un push a una respuesta HTTPS sin paso manual.', 'From a push to an HTTPS response with no manual step.'),
    detail: l(
      'Jenkins está definido por completo con JCasC y construye en una máquina virtual aparte, porque ejecuta código que llega en pull requests. La imagen se publica por digest sha256, el digest entra como commit al repositorio gitops y Argo CD lo sincroniza; ese repositorio es lo único que describe el estado del clúster.',
      'Jenkins is defined entirely through JCasC and builds on a separate virtual machine, because it runs code that arrives in pull requests. The image is published by sha256 digest, the digest lands as a commit in the gitops repository, and Argo CD syncs it; that repository is the only description of cluster state.',
    ),
    technologies: ['jenkins', 'argocd', 'github-actions', 'docker', 'kubernetes'],
  },
  {
    slug: 'secretos-y-acceso',
    title: l('Secretos y acceso', 'Secrets and access'),
    summary: l('Un almacén de secretos y una sola puerta de entrada.', 'One secrets store and one door in.'),
    detail: l(
      'Cada secreto vive en Bitwarden Secrets Manager y un único script los lee; nada viaja por la línea de comandos, donde quedaría en el historial del shell y en la lista de procesos. WireGuard es la única entrada a la red interna. Las dos excepciones están documentadas donde ocurren: el token de GitHub se toma del llavero del CLI gh y el secreto de descarga del registro lo escribe Ansible en el clúster, porque no puede vivir en un repositorio GitOps público.',
      'Every secret lives in Bitwarden Secrets Manager and a single script reads them; nothing travels on a command line, where it would stay in shell history and in the process list. WireGuard is the only way into the internal network. The two exceptions are documented where they occur: the GitHub token comes from the gh CLI keyring, and Ansible writes the registry pull secret into the cluster because it cannot live in a public GitOps repository.',
    ),
    technologies: ['bitwarden', 'wireguard', 'ansible', 'linux'],
  },
  {
    slug: 'datos',
    title: l('Datos y recuperación', 'Data and recovery'),
    summary: l('Un primario, una réplica en streaming y runbooks que registran qué se ejecutó.', 'A primary, a streaming replica, and runbooks that record what was actually run.'),
    detail: l(
      'Un invitado lleva el primario de PostgreSQL y Redis, y otro mantiene una réplica en streaming. Cada procedimiento de recuperación anota si llegó a ejecutarse contra este clúster: la promoción de la réplica se probó hasta la línea temporal 2 y se volvió a sembrar, y la restauración de etcd se promovió, se verificó y se revirtió. Un procedimiento que nadie ha ejecutado es una hipótesis.',
      'One guest holds the PostgreSQL primary and Redis, another keeps a streaming standby. Each recovery procedure records whether it was ever run against this cluster: the replica promotion was tested through timeline 2 and re-seeded, and the etcd restore was promoted, verified, and reverted. A procedure nobody has run is a hypothesis.',
    ),
    technologies: ['postgresql', 'kubernetes', 'linux'],
  },
  {
    slug: 'observabilidad',
    title: l('Observabilidad', 'Observability'),
    summary: l('Prometheus, Loki y Grafana fuera del clúster que observan.', 'Prometheus, Loki, and Grafana outside the cluster they watch.'),
    detail: l(
      'La pila de métricas y registros corre en su propio invitado y su interfaz no se sirve a través del clúster: un tablero que depende del clúster deja de estar disponible justo cuando hace falta. La memoria se presupuesta en lugar de sobrecomprometerse; la CPU sí se sobrecompromete, porque las cargas intermitentes lo toleran y la memoria no.',
      'The metrics and logs stack runs on its own guest and its interface is not served through the cluster: a dashboard that depends on the cluster is unavailable exactly when it is needed. Memory is budgeted rather than overcommitted; CPU is overcommitted on purpose, because intermittent workloads tolerate that and memory does not.',
    ),
    technologies: ['prometheus', 'grafana', 'linux'],
  },
];

const portalModules: readonly ProjectModule[] = [
  {
    slug: 'asistencia',
    title: l('Asistencia', 'Attendance'),
    summary: l('Registro con GPS, horarios y alertas operativas.', 'GPS check-ins, schedules, and operational alerts.'),
    detail: l(
      'Valida entradas, comida y salida según el horario del empleado, conserva banderas de incidencias y permite revisión administrativa por fecha.',
      'Validates check-in, meal, and check-out events against employee schedules, records incident flags, and supports date-based administrative review.',
    ),
    technologies: ['astro', 'preact', 'directus', 'go'],
  },
  {
    slug: 'estudio',
    title: l('Operación de estudio', 'Studio operations'),
    summary: l('Recepción, etapas, evidencia y seguimiento para clientes.', 'Intake, stages, evidence, and customer tracking.'),
    detail: l(
      'Organiza la recepción del vehículo, pagos, inventario encontrado, etapas asignadas, fotos, videos, firmas y un acceso público por código para el cliente.',
      'Organizes vehicle intake, payments, in-car inventory, assigned stages, photos, videos, signatures, and code-based public tracking for customers.',
    ),
    technologies: ['astro', 'preact', 'directus', 'typescript'],
  },
  {
    slug: 'control-servicios',
    title: l('Control de servicios', 'Service control'),
    summary: l('Checklists, evidencia y aprobaciones por etapas.', 'Checklists, evidence, and staged approvals.'),
    detail: l(
      'Coordina servicios PPF, Wrap y Clear desde la ejecución hasta la revisión y el cierre administrativo, con historial auditable y PDF final.',
      'Coordinates PPF, Wrap, and Clear services from execution through review and administrative closure, with an auditable timeline and final PDF.',
    ),
    technologies: ['astro', 'preact', 'directus', 'typescript'],
  },
  {
    slug: 'revision-vehiculos',
    title: l('Revisión vehicular', 'Vehicle inspection'),
    summary: l('Estado visual, checklist y firmas antes del servicio.', 'Visual condition, checklists, and signatures before service.'),
    detail: l(
      'Registra el estado interior y exterior, comentarios, productos PPF y firmas requeridas antes de cerrar la recepción en tres etapas.',
      'Records interior and exterior condition, notes, PPF products, and required signatures before completing the three-stage intake workflow.',
    ),
    technologies: ['astro', 'preact', 'directus'],
  },
  {
    slug: 'inventario-ppf',
    title: l('Inventario PPF', 'PPF inventory'),
    summary: l('Rollos, metros sueltos, movimientos y auditoría.', 'Rolls, loose meters, movements, and auditing.'),
    detail: l(
      'Modela existencias por rollos y metros disponibles, traslados entre ubicaciones, recepción, conversión, venta e historial administrativo.',
      'Models stock as rolls and available meters, with location transfers, receiving, conversion, sales, and an administrative audit log.',
    ),
    technologies: ['astro', 'preact', 'directus', 'postgresql'],
  },
  {
    slug: 'ventas',
    title: l('Ventas', 'Sales'),
    summary: l('Registro, catálogo, comisiones y análisis.', 'Records, catalog, commissions, and analysis.'),
    detail: l(
      'Combina registro paginado, permisos por vendedor, catálogo administrable y análisis por producto, cliente, pago y comisión con exportación Excel.',
      'Combines paginated records, seller-level permissions, an administrable catalog, and analysis by product, customer, payment, and commission with Excel export.',
    ),
    technologies: ['astro', 'preact', 'directus'],
  },
  {
    slug: 'finanzas',
    title: l('Finanzas', 'Finance'),
    summary: l('Flujo de caja y análisis por periodo.', 'Cash flow and period-based analysis.'),
    detail: l(
      'Centraliza ingresos, egresos, saldos y catálogos financieros con análisis mensual, semanal o quincenal y exportación de reportes.',
      'Centralizes income, expenses, balances, and financial catalogs with monthly, weekly, or biweekly analysis and report exports.',
    ),
    technologies: ['astro', 'preact', 'directus', 'postgresql'],
  },
  {
    slug: 'cotizador-ppf',
    title: l('Cotizador PPF', 'PPF quoting'),
    summary: l('Cotizaciones por vehículo, cobertura y producto.', 'Quotes by vehicle, coverage, and product.'),
    detail: l(
      'Calcula propuestas visuales a partir de vehículo, marca, producto, cobertura y factores de precio, con una salida preparada para compartir.',
      'Builds visual proposals from vehicle, brand, product, coverage, and pricing factors, with a shareable output.',
    ),
    technologies: ['astro', 'preact', 'typescript'],
  },
  {
    slug: 'notificaciones',
    title: l('Notificaciones', 'Notifications'),
    summary: l('Web Push programado y eventos en tiempo real.', 'Scheduled Web Push and real-time events.'),
    detail: l(
      'Un servicio en Go consulta la operación y envía recordatorios de asistencia; el portal también notifica asignaciones, cambios de etapa y nueva evidencia.',
      'A Go service polls operations and sends attendance reminders; the portal also notifies assignments, stage changes, and new evidence.',
    ),
    technologies: ['go', 'directus', 'astro'],
  },
  {
    slug: 'infraestructura-ha',
    title: l('Infraestructura HA', 'HA infrastructure'),
    summary: l('Supervisión, failover y bitácora del clúster.', 'Cluster monitoring, failover, and operations log.'),
    detail: l(
      'Supervisa Directus, Patroni/PostgreSQL, etcd y servicios de contenedores. Permite operaciones controladas de conciliación, reinicio, failover y failback.',
      'Monitors Directus, Patroni/PostgreSQL, etcd, and container services, with controlled reconciliation, restart, failover, and failback operations.',
    ),
    technologies: ['go', 'postgresql', 'docker', 'cloudflare', 'linux'],
  },
];

const twoFreeModules: readonly ProjectModule[] = [
  {
    slug: 'web',
    title: l('Aplicación web', 'Web application'),
    summary: l('Panel financiero responsive con modo invitado.', 'Responsive financial workspace with guest mode.'),
    detail: l(
      'Next.js y React entregan cuentas, transacciones, presupuestos, metas, gastos compartidos, alertas y portabilidad. El modo invitado demuestra el producto sin registro ni datos reales. Se publica desde el repositorio twofree-web y se sirve bajo /app en 2free.camir.tech.',
      'Next.js and React deliver accounts, transactions, budgets, goals, shared expenses, alerts, and portability. Guest mode demonstrates the product without registration or real data. It ships from the twofree-web repository and is served under /app on 2free.camir.tech.',
    ),
    technologies: ['nextjs', 'react', 'typescript', 'tailwindcss'],
  },
  {
    slug: 'landing',
    title: l('Landing', 'Landing'),
    summary: l('Presentación pública, descargas y autohospedaje.', 'Public presentation, downloads, and self-hosting.'),
    detail: l(
      'Astro entrega una superficie estática con SEO, datos estructurados, descargas por plataforma y una guía separada de Docker Compose. Vive en el repositorio twofree-landing y ocupa la raíz de 2free.camir.tech, con la aplicación bajo /app.',
      'Astro delivers a static surface with SEO, structured data, platform downloads, and a dedicated Docker Compose self-hosting guide. It lives in the twofree-landing repository and occupies the root of 2free.camir.tech, with the application under /app.',
    ),
    technologies: ['astro', 'gsap', 'typescript'],
  },
  {
    slug: 'desktop',
    title: l('Desktop', 'Desktop'),
    summary: l('Aplicación local-first para Linux con SQLCipher.', 'Local-first Linux application backed by SQLCipher.'),
    detail: l(
      'Tauri y Rust controlan almacenamiento cifrado, llaves del sistema, migraciones, notificaciones y sincronización opcional. La aplicación puede operar sin cuenta ni red.',
      'Tauri and Rust control encrypted storage, system key management, migrations, notifications, and optional synchronization. The app can run without an account or network.',
    ),
    technologies: ['tauri', 'rust', 'sqlite', 'react', 'vite'],
  },
  {
    slug: 'mobile',
    title: l('Android', 'Android'),
    summary: l('El mismo núcleo local-first empaquetado con Tauri.', 'The same local-first core packaged with Tauri.'),
    detail: l(
      'Android comparte la aplicación desktop, usa Keystore para la clave local y se publica como APK ARM64 firmado. iOS está preparado en el código, pero no se presenta como lanzamiento.',
      'Android shares the desktop application, uses Keystore for the local key, and ships as a signed ARM64 APK. iOS is prepared in code but is not presented as a released platform.',
    ),
    technologies: ['tauri', 'rust', 'sqlite', 'react'],
  },
  {
    slug: 'api',
    title: l('API', 'API'),
    summary: l('Identidad, dominio financiero y persistencia cloud.', 'Identity, financial domain, and cloud persistence.'),
    detail: l(
      'NestJS compone autenticación, aislamiento por propietario, idempotencia, portabilidad y cifrado de campos sobre Prisma y PostgreSQL. Vive en el repositorio twofree-api; la aplicación web la alcanza dentro del clúster por su proxy del mismo origen.',
      'NestJS composes authentication, owner-scoped access, idempotency, portability, and field encryption on top of Prisma and PostgreSQL. It lives in the twofree-api repository; the web application reaches it in-cluster through its same-origin proxy.',
    ),
    technologies: ['nestjs', 'better-auth', 'prisma', 'postgresql', 'typescript'],
  },
  {
    slug: 'arquitectura',
    title: l('Núcleo compartido', 'Shared core'),
    summary: l('Dominio independiente de frameworks y contratos portables.', 'Framework-independent domain and portable contracts.'),
    detail: l(
      'Los paquetes de core, application, auth, data-provider, database y UI separan reglas monetarias exactas, puertos de datos y composición de los runtimes web y nativo. Viven en el repositorio twofree-packages y se publican en GitHub Packages como @camircode/twofree-*, así que la API y la web consumen la misma versión declarada.',
      'Core, application, auth, data-provider, database, and UI packages keep exact money rules, data ports, and composition separate from web and native runtimes. They live in the twofree-packages repository and publish to GitHub Packages as @camircode/twofree-*, so the API and the web app consume the same declared version.',
    ),
    technologies: ['typescript', 'vitest', 'playwright', 'pnpm'],
  },
];

const pokedexModules: readonly ProjectModule[] = [
  {
    slug: 'catalogo',
    title: l('Catálogo', 'Catalog'),
    summary: l('PokéAPI con filtros, orden global y una caché que sobrevive a la caída del origen.', 'PokéAPI with filters, global sorting, and a cache that survives an origin outage.'),
    detail: l(
      'La búsqueda filtra por tipo, generación, habilidad y categoría Pokédex, y ordena el catálogo completo por generación o por cada estadística base. Una caché de 24 horas en MongoDB conserva el último dato conocido, así que una ficha vencida se sigue leyendo cuando PokéAPI no responde.',
      'Search filters by type, generation, ability, and Pokédex category, and sorts the whole catalog by generation or by each base stat. A 24-hour cache in MongoDB keeps the last known snapshot, so an expired entry still reads when PokéAPI does not answer.',
    ),
    technologies: ['typescript', 'react', 'mongodb'],
  },
  {
    slug: 'coleccion',
    title: l('Colección', 'Collection'),
    summary: l('Una colección por cuenta, con el aislamiento en la consulta y en el índice.', 'One collection per account, isolated in the query and in the index.'),
    detail: l(
      'Cada consulta lleva el identificador de la cuenta y un índice único impide repetir una especie por usuario. La entrada guarda cantidad, apodo, notas, etiquetas y favorito junto a una instantánea mínima del Pokémon, para que una caída de PokéAPI no inutilice lo ya registrado. Las estadísticas se derivan de la colección y se calculan en el servidor.',
      'Every query carries the account identifier, and a unique index prevents repeating a species per user. The entry stores quantity, nickname, notes, tags, and favorite alongside a minimal Pokémon snapshot, so a PokéAPI outage does not break what was already recorded. Statistics are derived from the collection and computed on the server.',
    ),
    technologies: ['mongodb', 'better-auth', 'typescript'],
  },
  {
    slug: 'mcp',
    title: l('Servidor MCP', 'MCP server'),
    summary: l('Seis herramientas de solo lectura y una sola frontera de contexto.', 'Six read-only tools and a single context boundary.'),
    detail: l(
      'El servidor expone search_pokemon, get_pokemon, list_my_collection, get_collection_stats, compare_pokemon y get_research_progress, todas anotadas como de solo lectura y resueltas por el mismo puerto de producto que usa la aplicación. El asistente lo consume por un transporte en memoria y los clientes externos por Streamable HTTP con bearer y sujeto explícitos, de modo que no existe una ruta paralela que evite las reglas de la cuenta. Ninguna operación MCP escribe datos de negocio.',
      'The server exposes search_pokemon, get_pokemon, list_my_collection, get_collection_stats, compare_pokemon, and get_research_progress, all annotated read-only and resolved through the same product port the application uses. The assistant consumes it over an in-memory transport and external clients over Streamable HTTP with an explicit bearer and subject, so there is no parallel route around the account rules. No MCP operation writes business data.',
    ),
    technologies: ['mcp', 'typescript', 'nodejs'],
  },
  {
    slug: 'asistente',
    title: l('Asistente', 'Assistant'),
    summary: l('Kimi cuando está habilitado; un enrutador determinista cuando no.', 'Kimi when it is enabled; a deterministic router when it is not.'),
    detail: l(
      'Cada envío negocia una sesión MCP, ejecuta tools/list y tools/call y la cierra al terminar. Con Kimi habilitado el modelo descubre y elige las herramientas; sin proveedor de IA, un enrutador determinista atraviesa esa misma frontera. En los dos casos el historial queda aislado por cuenta y la respuesta cita las herramientas que se ejecutaron, así que el asistente no puede afirmar un dato que ninguna herramienta devolvió.',
      'Each message negotiates an MCP session, runs tools/list and tools/call, and closes it when done. With Kimi enabled the model discovers and picks the tools; without an AI provider, a deterministic router crosses that same boundary. In both cases history stays isolated per account and the answer cites the tools that ran, so the assistant cannot state a fact no tool returned.',
    ),
    technologies: ['mcp', 'typescript', 'react'],
  },
  {
    slug: 'reconocimiento',
    title: l('Reconocimiento de cartas', 'Card recognition'),
    summary: l('El modelo propone, PokéAPI resuelve y la persona confirma.', 'The model proposes, PokéAPI resolves, the person confirms.'),
    detail: l(
      'El navegador prepara y optimiza la imagen, la aplicación pide consentimiento explícito y Kimi propone una identificación que se contrasta contra PokéAPI por identificador y por nombre. La imagen no se guarda y nada entra a la colección sin confirmación; si la propuesta no coincide, la misma imagen se puede reintentar con una indicación.',
      'The browser prepares and optimizes the image, the app asks for explicit consent, and Kimi proposes an identification that is checked against PokéAPI by identifier and by name. The image is never stored and nothing enters the collection without confirmation; if the proposal is wrong, the same image can be retried with a hint.',
    ),
    technologies: ['typescript', 'react', 'nodejs'],
  },
  {
    slug: 'operacion',
    title: l('Operación', 'Operations'),
    summary: l('Compose para levantarlo y una cadena de calidad que no omite la persistencia.', 'Compose to bring it up and a quality chain that does not skip persistence.'),
    detail: l(
      'Docker Compose levanta MongoDB y la aplicación; el contenedor inicializa los índices antes del servidor y un contrato de índice incompatible bloquea el arranque en lugar de operar sobre una base ambigua. GitHub Actions ejecuta auditoría de dependencias, lint, formato, tipos, pruebas de integración contra un MongoDB real y build.',
      'Docker Compose brings up MongoDB and the application; the container initializes indexes before the server, and an incompatible index contract blocks startup instead of running against an ambiguous database. GitHub Actions runs a dependency audit, lint, formatting, types, integration tests against a real MongoDB, and the build.',
    ),
    technologies: ['docker', 'github-actions', 'mongodb', 'vitest'],
  },
];

const ferrenLandingModules: readonly ProjectModule[] = [
  {
    slug: 'catalogo',
    title: l('Catálogo de servicios', 'Service catalog'),
    summary: l('Diecinueve rutas estáticas generadas desde un módulo de datos.', 'Nineteen static routes generated from one data module.'),
    detail: l(
      'Cerámicos por superficie, PPF por cobertura, películas de seguridad, pulido, interiores, wrap, varillaje y servicios adicionales tienen cada uno su página. La ruta y el nombre de cada servicio coinciden con la documentación operativa del estudio, para que el sitio y el mostrador hablen del mismo servicio.',
      'Ceramic coatings by surface, PPF by coverage, security films, polishing, interiors, wrap, dent work, and additional services each get their own page. Every route and service name matches the studio’s operational documentation, so the site and the counter describe the same service.',
    ),
    technologies: ['astro', 'typescript'],
  },
  {
    slug: 'precios',
    title: l('Precios y alcance', 'Pricing and scope'),
    summary: l('Precio cuando la documentación lo respalda; cotización cuando no.', 'A price when the documentation supports one; a quote when it does not.'),
    detail: l(
      'Los paquetes cerámicos se comparan por protección, corrección, superficies y precio según el tamaño del vehículo. PPF, wrap, rotulación, hojalatería, pintura y varillaje aparecen bajo cotización porque dependen del vehículo, la cobertura, el material y el estado de la superficie, y se confirman con ventas.',
      'Ceramic packages are compared by protection, correction, surfaces, and price by vehicle size. PPF, wrap, lettering, bodywork, paint, and dent work are shown as quote-only because they depend on the vehicle, the coverage, the material, and the condition of the surface, and are confirmed with sales.',
    ),
    technologies: ['astro', 'typescript'],
  },
  {
    slug: 'conversion',
    title: l('Conversión por WhatsApp', 'WhatsApp conversion'),
    summary: l('El mensaje llega con el servicio ya nombrado.', 'The message arrives with the service already named.'),
    detail: l(
      'Cada llamada a la acción abre WhatsApp con un texto que identifica el servicio o el material consultado. Ventas contesta sobre algo concreto en lugar de empezar preguntando qué necesita quien escribe, y el sitio no promete un precio que después haya que corregir.',
      'Every call to action opens WhatsApp with text that names the service or material in question. Sales answers something specific instead of opening with what do you need, and the site never promises a price that has to be corrected later.',
    ),
    technologies: ['astro', 'typescript'],
  },
  {
    slug: 'navegacion',
    title: l('Navegación y video', 'Navigation and video'),
    summary: l('Cambiar de página sin reiniciar el video de la portada.', 'Changing pages without restarting the hero video.'),
    detail: l(
      'El ClientRouter de Astro intercepta el click y reemplaza el HTML ya generado, así el video del hero no vuelve a empezar en cada navegación; la regla nativa de transiciones de vista queda declarada como respaldo. Los componentes con estado se reinicializan en astro:page-load y GSAP se carga solo en la portada, de modo que el resto del catálogo se lee sin JavaScript.',
      'Astro’s ClientRouter intercepts the click and swaps in the already-generated HTML, so the hero video does not restart on every navigation; the native view-transition rule stays declared as a fallback. Stateful components reinitialize on astro:page-load and GSAP loads only on the home page, so the rest of the catalog reads without JavaScript.',
    ),
    technologies: ['astro', 'gsap', 'javascript'],
  },
];

export const projects: readonly Project[] = [
  {
    slug: 'infraestructura',
    title: 'Homelab',
    kicker: l('Infraestructura declarativa sobre bare metal', 'Declarative infrastructure on bare metal'),
    summary: l(
      'Un servidor de OVHcloud que va de Proxmox a Kubernetes y de ahí a GitOps.',
      'One OVHcloud server that runs from Proxmox to Kubernetes to GitOps.',
    ),
    description: l(
      'Un push a un repositorio de aplicación termina como respuesta HTTPS pública sin ningún paso manual entre medio: Jenkins prueba y construye, la imagen queda fijada por digest sha256 en GitHub Container Registry, un commit al repositorio gitops describe el estado deseado y Argo CD lo sincroniza contra el clúster. Terraform aprovisiona, Ansible configura y WireGuard es la única entrada a la red interna.',
      'A push to an application repository ends as a public HTTPS response with no manual step in between: Jenkins tests and builds, the image is pinned by sha256 digest in GitHub Container Registry, a commit to the gitops repository describes the desired state, and Argo CD syncs it into the cluster. Terraform provisions, Ansible configures, and WireGuard is the only way into the internal network.',
    ),
    role: l('Diseño, aprovisionamiento y operación', 'Design, provisioning, and operation'),
    period: '2026',
    technologies: ['proxmox', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'argocd', 'github-actions', 'wireguard', 'bitwarden', 'postgresql', 'prometheus', 'grafana', 'linux'],
    highlights: [
      l('Terraform aprovisiona y Ansible configura, sin scripts remote-exec que reporten éxito por haber terminado con código 0.', 'Terraform provisions and Ansible configures, with no remote-exec scripts that report success just for exiting 0.'),
      l('Plano de control de tres miembros con etcd, primario de PostgreSQL con réplica en streaming y snapshots fuera del servidor.', 'A three-member control plane with etcd, a PostgreSQL primary with a streaming standby, and snapshots stored off the server.'),
      l('Los secretos viven en Bitwarden Secrets Manager y nunca pasan por la línea de comandos.', 'Secrets live in Bitwarden Secrets Manager and never pass through a command line.'),
    ],
    modules: infrastructureModules,
    featured: true,
    logo: '/assets/logos/ovhcloud.svg',
    image: '/assets/projects/infraestructura/delivery-chain.svg',
    imageAlt: l(
      'Diagrama de la cadena de entrega: push al repositorio, Jenkins, imagen por digest, repositorio GitOps, Argo CD y respuesta HTTPS.',
      'Diagram of the delivery chain: repository push, Jenkins, image by digest, GitOps repository, Argo CD, and HTTPS response.',
    ),
    private: true,
  },
  {
    slug: 'portal',
    title: 'FER&REN Portal',
    kicker: l('Sistema operativo interno', 'Internal operating system'),
    summary: l(
      'Diez aplicaciones conectadas para personas, taller, ventas, finanzas e infraestructura.',
      'Ten connected applications for people, workshop operations, sales, finance, and infrastructure.',
    ),
    description: l(
      'Un portal SSR y PWA que digitaliza procesos automotrices completos: desde asistencia y recepción de vehículos hasta evidencia, aprobaciones, inventario, ventas y operación de alta disponibilidad.',
      'An SSR and PWA portal that digitizes complete automotive workflows, from attendance and vehicle intake to evidence, approvals, inventory, sales, and high-availability operations.',
    ),
    role: l('Desarrollador de sistemas y consultor DevOps', 'Systems developer and DevOps consultant'),
    period: '2025–2026',
    technologies: ['flutter', 'supabase', 'astro', 'preact', 'typescript', 'directus', 'postgresql', 'go', 'docker', 'cloudflare'],
    highlights: [
      l('Cinco aplicaciones Flutter/Supabase migradas a flujos web sobre Astro SSR y Preact.', 'Five Flutter/Supabase applications migrated to web workflows on Astro SSR and Preact.'),
      l('Notificaciones programadas y monitoreo con dos servicios en Go.', 'Scheduled notifications and monitoring through two Go services.'),
      l('Infraestructura propia con failover de Directus y PostgreSQL.', 'Self-hosted infrastructure with Directus and PostgreSQL failover.'),
    ],
    modules: portalModules,
    logo: '/assets/logos/ferren.png',
    image: '/assets/projects/portal/login.png',
    imageAlt: l('Pantalla pública actual de acceso al Portal FER&REN.', 'Current public sign-in screen for FER&REN Portal.'),
    private: true,
  },
  {
    slug: '2free',
    title: '2 Free',
    kicker: l('Finanzas personales abiertas', 'Open personal finance'),
    summary: l(
      'Una plataforma local-first, cifrada y autohospedable para web, Linux y Android.',
      'A local-first, encrypted, self-hostable platform for web, Linux, and Android.',
    ),
    description: l(
      '2 Free reúne cuentas, transacciones, presupuestos, metas, gastos compartidos y alertas. Puede trabajar completamente en el dispositivo con SQLCipher o sincronizarse con una instancia administrada o propia. El ecosistema se publica en cuatro repositorios abiertos: twofree-api, twofree-web, twofree-packages y twofree-landing.',
      '2 Free brings accounts, transactions, budgets, goals, shared expenses, and alerts together. It can run entirely on-device with SQLCipher or synchronize with a managed or self-hosted instance. The ecosystem ships as four open repositories: twofree-api, twofree-web, twofree-packages, and twofree-landing.',
    ),
    role: l('Diseño de producto, arquitectura e implementación', 'Product design, architecture, and implementation'),
    period: '2026',
    technologies: ['nextjs', 'react', 'typescript', 'nestjs', 'prisma', 'postgresql', 'tauri', 'rust', 'sqlite', 'astro'],
    highlights: [
      l('Montos exactos sin punto flotante binario.', 'Exact monetary values without binary floating point.'),
      l('Modo local cifrado que no requiere cuenta ni red.', 'Encrypted local mode that requires no account or network.'),
      l('AppImage y APK firmado publicados con checksums.', 'AppImage and signed APK releases published with checksums.'),
    ],
    modules: twoFreeModules,
    repository: 'https://github.com/camircode/2free',
    liveUrl: 'https://2free.camir.tech',
    logo: '/assets/logos/2free.svg',
    image: '/assets/projects/2free/dashboard-desktop.webp',
    imageAlt: l('Dashboard de demostración de 2 Free con datos ficticios.', '2 Free guest dashboard with fictional demo data.'),
    private: false,
  },
  {
    slug: 'pokedex',
    title: 'Pokédex Manager',
    kicker: l('Colección verificable con IA opcional', 'Verifiable collection with optional AI'),
    summary: l(
      'Catálogo de PokéAPI, colección aislada por cuenta y un asistente que responde con herramientas MCP.',
      'A PokéAPI catalog, an account-scoped collection, and an assistant that answers through MCP tools.',
    ),
    description: l(
      'Pokédex Manager explora PokéAPI, mantiene una colección aislada por cuenta y reconoce cartas a partir de una foto con confirmación humana antes de guardar nada. El asistente obtiene su contexto por una sesión MCP de solo lectura, así que cita datos de la colección en lugar de deducirlos. Kimi es opcional: sin proveedor de IA quedan catálogo, colección, estadísticas y un asistente local acotado.',
      'Pokédex Manager explores PokéAPI, keeps a collection isolated per account, and identifies cards from a photo with human confirmation before anything is saved. The assistant gets its context through a read-only MCP session, so it cites collection data instead of inferring it. Kimi is optional: without an AI provider the catalog, collection, statistics, and a bounded local assistant remain.',
    ),
    role: l('Diseño de producto, arquitectura e implementación', 'Product design, architecture, and implementation'),
    period: '2026',
    technologies: ['typescript', 'react', 'tanstack', 'vite', 'nodejs', 'mongodb', 'better-auth', 'mcp', 'docker', 'github-actions', 'vitest', 'pnpm'],
    highlights: [
      l('Un servidor MCP propio con seis herramientas de solo lectura; el asistente y los clientes externos entran por la misma frontera.', 'A purpose-built MCP server with six read-only tools; the assistant and external clients enter through the same boundary.'),
      l('El reconocimiento contrasta la propuesta del modelo con PokéAPI y no agrega nada sin confirmación.', 'Recognition checks the model’s proposal against PokéAPI and adds nothing without confirmation.'),
      l('Sin proveedor de IA la aplicación conserva catálogo, colección, estadísticas y asistente local.', 'Without an AI provider the application keeps the catalog, collection, statistics, and local assistant.'),
    ],
    modules: pokedexModules,
    repository: 'https://github.com/camircode/pokedex-manager',
    liveUrl: 'https://pokedex.camir.tech',
    logo: '/assets/logos/pokedex.svg',
    image: '/assets/projects/pokedex/dashboard.png',
    imageAlt: l('Portada publicada de Pokédex Manager, donde el producto explica su asistente conectado por MCP.', 'Published home page of Pokédex Manager, where the product explains its MCP-connected assistant.'),
    private: false,
  },
  {
    slug: 'ferren-landing',
    title: 'FER&REN Detailing',
    kicker: l('Catálogo público y cotización', 'Public catalog and quoting'),
    summary: l(
      'Diecinueve páginas de servicio que llevan un interés concreto a una conversación por WhatsApp.',
      'Nineteen service pages that turn a specific interest into a WhatsApp conversation.',
    ),
    description: l(
      'La landing de FER&REN DETAILING - CUSTOM, un estudio de Toluca, presenta el catálogo de protección cerámica, PPF, wrap, películas, pintura y varillaje. Cada servicio explica su alcance, muestra precio cuando la documentación del estudio lo respalda y abre WhatsApp con un mensaje que ya identifica lo que la persona vino a preguntar.',
      'The landing page for FER&REN DETAILING - CUSTOM, a studio in Toluca, presents its catalog of ceramic protection, PPF, wrap, films, paint, and dent work. Each service explains its scope, shows a price when the studio’s documentation supports one, and opens WhatsApp with a message that already states what the visitor came to ask.',
    ),
    role: l('Diseño de producto e implementación', 'Product design and implementation'),
    period: '2026',
    technologies: ['astro', 'typescript', 'javascript', 'gsap', 'html', 'css'],
    highlights: [
      l('Diecinueve rutas estáticas de servicio, más marcas, quiénes somos y ubicación.', 'Nineteen static service routes, plus brands, about, and location.'),
      l('Los servicios de precio variable se muestran bajo cotización; el sitio no publica una cifra que la documentación no respalde.', 'Variable-price services are shown as quote-only; the site publishes no figure the documentation does not support.'),
      l('GSAP se carga solo en la portada y el resto del catálogo se lee sin JavaScript.', 'GSAP loads only on the home page and the rest of the catalog reads without JavaScript.'),
    ],
    modules: ferrenLandingModules,
    liveUrl: 'https://ferrendetailing.com.mx',
    logo: '/assets/logos/ferren-detailing.svg',
    image: '/assets/projects/ferren-landing/portada.png',
    imageAlt: l('Portada publicada de FER&REN DETAILING - CUSTOM.', 'Published home page of FER&REN DETAILING - CUSTOM.'),
    private: true,
  },
] as const;

const tech = (
  slug: string,
  name: string,
  logo: string | undefined,
  category: Localized,
  summary: Localized,
  purpose: Localized,
  usage: Localized,
  projectSlugs: readonly Project['slug'][],
  logoOnDark?: string,
): Technology => ({ slug, name, logo: logo ? `/assets/logos/${logo}` : undefined, logoOnDark: logoOnDark ? `/assets/logos/${logoOnDark}` : undefined, category, summary, purpose, usage, projects: projectSlugs });

export const technologies: readonly Technology[] = [
  tech('html', 'HTML', 'html5.svg', l('Fundamentos web', 'Web foundations'), l('Lenguaje de marcado semántico que estructura documentos y aplicaciones web.', 'The semantic markup language that structures web documents and applications.'), l('Construir contenido accesible, indexable y resistente antes de añadir comportamiento.', 'Build accessible, indexable, resilient content before adding behavior.'), l('Es la base de las interfaces del Portal, 2 Free, Pokédex Manager, la landing de FER&REN y este portfolio.', 'It is the foundation of the interfaces in the Portal, 2 Free, Pokédex Manager, the FER&REN landing, and this portfolio.'), ['portal', '2free', 'pokedex', 'ferren-landing']),
  tech('css', 'CSS', 'css.svg', l('Fundamentos web', 'Web foundations'), l('Lenguaje de estilos para composición, tipografía, adaptación y estados visuales.', 'The styling language for layout, typography, adaptation, and visual states.'), l('Crear interfaces responsive y sistemas visuales sin depender de JavaScript.', 'Create responsive interfaces and visual systems without depending on JavaScript.'), l('Define la presentación base de mis productos web, incluso en los que usan Tailwind CSS. La landing de FER&REN y Pokédex Manager se escriben en CSS propio.', 'It defines the presentation foundation of my web products, including the ones that use Tailwind CSS. The FER&REN landing and Pokédex Manager are written in plain CSS.'), ['portal', '2free', 'pokedex', 'ferren-landing']),
  tech('astro', 'Astro', 'Astro_light.svg', l('Web', 'Web'), l('Framework web orientado a contenido con renderizado en servidor y mínimo JavaScript.', 'A content-focused web framework with server rendering and minimal client JavaScript.'), l('Construir sitios rápidos, páginas SSR e islas interactivas sin enviar un runtime completo por defecto.', 'Build fast sites, SSR pages, and interactive islands without shipping a full runtime by default.'), l('Lo usé en el Portal SSR, la landing de 2 Free, la landing de FER&REN Detailing y este portfolio bilingüe.', 'I used it for the Portal SSR app, the 2 Free landing, the FER&REN Detailing landing, and this bilingual portfolio.'), ['portal', '2free', 'ferren-landing']),
  tech('preact', 'Preact', 'preact.svg', l('Interfaz', 'Interface'), l('Alternativa compacta a React para interfaces reactivas.', 'A compact React alternative for reactive interfaces.'), l('Añadir componentes con estado dentro de aplicaciones que no necesitan un runtime pesado.', 'Add stateful components to applications that do not need a heavy runtime.'), l('Construye los módulos interactivos del Portal dentro de páginas Astro SSR.', 'It powers interactive Portal modules inside Astro SSR pages.'), ['portal']),
  tech('flutter', 'Flutter', 'flutter.svg', l('Aplicaciones', 'Applications'), l('Toolkit multiplataforma para crear aplicaciones móviles y de escritorio desde una base de código.', 'A cross-platform toolkit for building mobile and desktop applications from one codebase.'), l('Construir interfaces nativas multiplataforma con un sistema de widgets consistente.', 'Build cross-platform native interfaces with a consistent widget system.'), l('Lo usé para implementar las primeras cinco aplicaciones internas de FER&REN: asistencia, cotización e inventario PPF, ventas e ingresos del estudio.', 'I used it to implement FER&REN’s first five internal applications: attendance, PPF quoting and inventory, sales, and studio income.'), ['portal']),
  tech('supabase', 'Supabase', 'supabase.svg', l('Backend administrado', 'Managed backend'), l('Plataforma backend sobre PostgreSQL para datos y servicios de aplicaciones.', 'A PostgreSQL-based backend platform for application data and services.'), l('Levantar rápidamente persistencia y servicios backend para productos conectados.', 'Quickly provide persistence and backend services for connected products.'), l('Fue el backend de las cinco aplicaciones Flutter iniciales de FER&REN antes de la migración a la infraestructura propia.', 'It backed FER&REN’s first five Flutter applications before the migration to self-hosted infrastructure.'), ['portal']),
  tech('react', 'React', 'React_light.svg', l('Interfaz', 'Interface'), l('Biblioteca declarativa para construir interfaces por componentes.', 'A declarative library for component-based interfaces.'), l('Modelar estados complejos y compartir sistemas visuales entre runtimes.', 'Model complex state and share visual systems between runtimes.'), l('Comparte la UI de 2 Free entre Next.js y Tauri, y construye la interfaz de Pokédex Manager sobre TanStack Router.', 'It shares the 2 Free UI across Next.js and Tauri, and builds the Pokédex Manager interface on TanStack Router.'), ['2free', 'pokedex']),
  tech('nextjs', 'Next.js', 'next-js-dark.svg', l('Web', 'Web'), l('Framework React para aplicaciones web con renderizado híbrido.', 'A React framework for hybrid-rendered web applications.'), l('Combinar rutas de servidor, componentes React y entrega optimizada.', 'Combine server routes, React components, and optimized delivery.'), l('Entrega la aplicación web autenticada y el modo invitado de 2 Free.', 'It delivers the authenticated 2 Free web app and guest mode.'), ['2free']),
  tech('typescript', 'TypeScript', 'typescript.svg', l('Lenguaje', 'Language'), l('JavaScript con tipos estáticos para contratos más seguros.', 'JavaScript with static types for safer contracts.'), l('Detectar inconsistencias temprano y hacer explícitos los límites entre capas.', 'Catch inconsistencies early and make layer boundaries explicit.'), l('Es el lenguaje principal de las aplicaciones web, los paquetes y las APIs del Portal, 2 Free, Pokédex Manager y la landing de FER&REN.', 'It is the primary language for the web apps, packages, and APIs across the Portal, 2 Free, Pokédex Manager, and the FER&REN landing.'), ['portal', '2free', 'pokedex', 'ferren-landing']),
  tech('javascript', 'JavaScript', 'javascript.svg', l('Lenguaje', 'Language'), l('Lenguaje nativo de la web y base del ecosistema frontend.', 'The web’s native language and the foundation of the frontend ecosystem.'), l('Crear comportamiento progresivo que se ejecuta directamente en el navegador.', 'Create progressive behavior that runs directly in the browser.'), l('Lo uso para interacción, automatización y movimiento en productos web, y para el scripting progresivo de las landings.', 'I use it for interaction, automation, and motion in web products, and for the progressive scripting on the landing pages.'), ['portal', '2free', 'pokedex', 'ferren-landing']),
  tech('go', 'Go', 'Go-Logo_LightBlue.svg', l('Backend', 'Backend'), l('Lenguaje compilado simple, concurrente y eficiente.', 'A simple, concurrent, and efficient compiled language.'), l('Construir servicios operativos pequeños, predecibles y fáciles de desplegar.', 'Build small, predictable operational services that are easy to deploy.'), l('Implementa notificaciones, monitoreo y control de alta disponibilidad del Portal.', 'It implements notifications, monitoring, and high-availability control for the Portal.'), ['portal']),
  tech('nodejs', 'Node.js', 'nodejsHex.svg', l('Runtime', 'Runtime'), l('Entorno de ejecución de JavaScript para servicios, herramientas y aplicaciones de servidor.', 'A JavaScript runtime for services, tooling, and server applications.'), l('Ejecutar APIs y herramientas TypeScript dentro del mismo ecosistema que las aplicaciones web.', 'Run APIs and TypeScript tooling in the same ecosystem as web applications.'), l('Sostiene la API NestJS de 2 Free y el servidor de Pokédex Manager, junto con las herramientas de desarrollo de ambos.', 'It powers the 2 Free NestJS API and the Pokédex Manager server, along with the development tooling for both.'), ['2free', 'pokedex']),
  tech('nestjs', 'NestJS', 'nestjs.svg', l('Backend', 'Backend'), l('Framework de Node.js para APIs modulares y tipadas.', 'A Node.js framework for modular, typed APIs.'), l('Organizar controladores, validación, autenticación y casos de uso en servicios mantenibles.', 'Organize controllers, validation, authentication, and use cases into maintainable services.'), l('Compone la API financiera y de identidad de 2 Free.', 'It composes the 2 Free financial and identity API.'), ['2free']),
  tech('better-auth', 'Better Auth', 'better-auth-mark-dark.svg', l('Identidad', 'Identity'), l('Framework de autenticación para TypeScript.', 'An authentication framework for TypeScript.'), l('Gestionar sesiones, cookies y orígenes confiables con contratos compartidos.', 'Manage sessions, cookies, and trusted origins with shared contracts.'), l('Centraliza la identidad de la web y la API de 2 Free, y persiste las sesiones de Pokédex Manager en MongoDB.', 'It centralizes identity across the 2 Free web app and API, and persists Pokédex Manager sessions in MongoDB.'), ['2free', 'pokedex'], 'better-auth-mark-light.svg'),
  tech('prisma', 'Prisma', 'Prisma_light.svg', l('Datos', 'Data'), l('ORM tipado para bases de datos relacionales.', 'A typed ORM for relational databases.'), l('Modelar persistencia, migraciones y consultas con tipos generados.', 'Model persistence, migrations, and queries with generated types.'), l('Conecta el dominio cloud de 2 Free con PostgreSQL.', 'It connects the 2 Free cloud domain to PostgreSQL.'), ['2free'], 'Prisma_dark.svg'),
  tech('postgresql', 'PostgreSQL', 'postgresql.svg', l('Datos', 'Data'), l('Base de datos relacional robusta y extensible.', 'A robust, extensible relational database.'), l('Persistir datos transaccionales con integridad, índices y operaciones atómicas.', 'Persist transactional data with integrity, indexes, and atomic operations.'), l('Sostiene la operación del Portal, la modalidad cloud de 2 Free y el par primario–réplica del homelab.', 'It supports Portal operations, the cloud mode of 2 Free, and the primary–standby pair in the homelab.'), ['portal', '2free', 'infraestructura']),
  tech('sqlite', 'SQLite / SQLCipher', 'SQLite.svg', l('Datos locales', 'Local data'), l('Base embebida; SQLCipher agrega cifrado transparente.', 'An embedded database; SQLCipher adds transparent encryption.'), l('Ofrecer persistencia local transaccional sin depender de un servidor.', 'Provide transactional local persistence without depending on a server.'), l('Es el origen local cifrado de 2 Free en Linux y Android.', 'It is the encrypted local source of truth for 2 Free on Linux and Android.'), ['2free']),
  tech('tauri', 'Tauri', 'tauri.svg', l('Nativo', 'Native'), l('Toolkit para aplicaciones de escritorio y móviles con frontend web y núcleo Rust.', 'A toolkit for desktop and mobile apps with a web frontend and Rust core.'), l('Compartir interfaz web sin renunciar a almacenamiento y capacidades nativas controladas.', 'Share a web interface without giving up controlled native storage and capabilities.'), l('Empaqueta 2 Free para Linux y Android y conecta la UI con SQLCipher.', 'It packages 2 Free for Linux and Android and connects the UI to SQLCipher.'), ['2free']),
  tech('rust', 'Rust', 'Rust_light.svg', l('Lenguaje', 'Language'), l('Lenguaje de sistemas con seguridad de memoria sin recolector de basura.', 'A systems language with memory safety and no garbage collector.'), l('Construir límites nativos seguros y eficientes.', 'Build safe and efficient native boundaries.'), l('Gestiona base local, llaves, migraciones y sincronización en 2 Free.', 'It manages local storage, keys, migrations, and synchronization in 2 Free.'), ['2free'], 'Rust_dark.svg'),
  tech('directus', 'Directus', 'directus.svg', l('Datos y CMS', 'Data and CMS'), l('Plataforma de datos sobre SQL con API, permisos y panel administrativo.', 'A data platform on top of SQL with APIs, permissions, and an admin panel.'), l('Exponer datos operativos con control por roles sin construir un back office desde cero.', 'Expose operational data with role controls without building a back office from scratch.'), l('Gestiona identidad y datos operativos del Portal.', 'It manages identity and operational data for the Portal.'), ['portal']),
  tech('docker', 'Docker', 'docker.svg', l('Infraestructura', 'Infrastructure'), l('Contenedores reproducibles para servicios y dependencias.', 'Reproducible containers for services and dependencies.'), l('Empaquetar, conectar y desplegar stacks completos de forma consistente.', 'Package, connect, and deploy complete stacks consistently.'), l('Despliega el Portal y sus servicios Go, el modo autohospedado de 2 Free y el entorno local de Pokédex Manager; en el homelab, las imágenes se publican por digest y las ejecuta Kubernetes.', 'It deploys the Portal and its Go services, 2 Free self-hosting mode, and the Pokédex Manager local environment; in the homelab the images are published by digest and run by Kubernetes.'), ['portal', '2free', 'pokedex', 'infraestructura']),
  tech('dokploy', 'Dokploy', 'dokploy.svg', l('Despliegue', 'Deployment'), l('Plataforma autohospedada para desplegar y administrar aplicaciones y servicios.', 'A self-hosted platform for deploying and managing applications and services.'), l('Centralizar despliegues, configuración y operación de stacks Docker desde una superficie controlada.', 'Centralize deployments, configuration, and Docker stack operations from one controlled surface.'), l('Lo uso para administrar el despliegue de todos mis servicios y aplicaciones.', 'I use it to manage deployment for all my services and applications.'), ['portal', '2free'], 'dokploy-dark.svg'),
  tech('cloudflare', 'Cloudflare', 'cloudflare.svg', l('Infraestructura', 'Infrastructure'), l('Red perimetral, DNS y túneles para servicios web.', 'Edge network, DNS, and tunnels for web services.'), l('Publicar servicios, proteger orígenes y conectar infraestructura distribuida.', 'Publish services, protect origins, and connect distributed infrastructure.'), l('Conecta y protege la infraestructura autohospedada del Portal, y administra el DNS, el certificado comodín y el bucket de estado y respaldo del homelab.', 'It connects and protects the Portal’s self-hosted infrastructure, and manages DNS, the wildcard certificate, and the state and backup bucket of the homelab.'), ['portal', 'infraestructura']),
  tech('linux', 'Linux', 'linux.svg', l('Sistemas', 'Systems'), l('Sistema operativo abierto para servidores y estaciones de trabajo.', 'An open operating system for servers and workstations.'), l('Operar servicios con control, automatización y observabilidad.', 'Operate services with control, automation, and observability.'), l('Administro los nodos Debian del homelab y del Portal, y distribuyo 2 Free como AppImage.', 'I administer the Debian nodes of the homelab and the Portal, and distribute 2 Free as an AppImage.'), ['portal', '2free', 'infraestructura']),
  tech('bash', 'Bash', 'Bash_light.svg', l('Automatización', 'Automation'), l('Shell y lenguaje de scripting habitual en sistemas Unix.', 'The common shell and scripting language on Unix systems.'), l('Automatizar instalación, diagnóstico y tareas repetibles de operación.', 'Automate installation, diagnostics, and repeatable operational tasks.'), l('Lo uso para administrar servidores, despliegues y herramientas del repositorio; en el homelab, un solo script lee los secretos y todos los objetivos de make pasan por él.', 'I use it for server administration, deployments, and repository tooling; in the homelab a single script reads the secrets and every make target goes through it.'), ['portal', '2free', 'infraestructura']),
  tech('tailwindcss', 'Tailwind CSS', 'tailwindcss.svg', l('Interfaz', 'Interface'), l('Framework CSS basado en utilidades.', 'A utility-first CSS framework.'), l('Construir sistemas visuales consistentes cerca del marcado.', 'Build consistent visual systems close to the markup.'), l('Da forma a las interfaces responsive del Portal y 2 Free.', 'It shapes the responsive interfaces of the Portal and 2 Free.'), ['portal', '2free']),
  tech('vite', 'Vite', 'vite.svg', l('Tooling', 'Tooling'), l('Servidor de desarrollo y empaquetador web rápido.', 'A fast web development server and bundler.'), l('Entregar ciclos de desarrollo cortos y builds optimizados.', 'Deliver short development cycles and optimized builds.'), l('Compila la interfaz Tauri de 2 Free y la aplicación de Pokédex Manager sobre TanStack Start.', 'It builds the 2 Free Tauri UI and the Pokédex Manager application on TanStack Start.'), ['2free', 'pokedex']),
  tech('vitest', 'Vitest', 'vitest.svg', l('Calidad', 'Quality'), l('Runner de pruebas integrado con Vite y TypeScript.', 'A test runner integrated with Vite and TypeScript.'), l('Verificar unidades y contratos con una configuración rápida y cercana al proyecto.', 'Verify units and contracts with fast project-native configuration.'), l('Cubre lógica compartida, APIs y componentes, y en Pokédex Manager ejecuta además los contratos de toolchain, Kimi y MCP.', 'It covers shared logic, APIs, and components, and in Pokédex Manager it also runs the toolchain, Kimi, and MCP contracts.'), ['portal', '2free', 'pokedex']),
  tech('playwright', 'Playwright', 'playwright-logo.svg', l('Calidad', 'Quality'), l('Automatización de navegadores para pruebas end-to-end y visuales.', 'Browser automation for end-to-end and visual testing.'), l('Comprobar interacción, accesibilidad y regresiones en un navegador real.', 'Check interaction, accessibility, and regressions in a real browser.'), l('Valida rutas y estados visuales de 2 Free, y ejecuta la auditoría de este portfolio en un navegador real.', 'It validates routes and visual states in 2 Free, and runs this portfolio’s audit in a real browser.'), ['2free']),
  tech('gsap', 'GSAP', 'gsap-black.svg', l('Movimiento', 'Motion'), l('Motor de animación para secuencias web precisas.', 'An animation engine for precise web sequences.'), l('Orquestar movimiento con control de tiempos, easing y estados.', 'Orchestrate motion with control over timing, easing, and state.'), l('Anima las landings de 2 Free y FER&REN, microinteracciones de Pokédex Manager y la secuencia de arranque de este portfolio.', 'It animates the 2 Free and FER&REN landings, Pokédex Manager micro-interactions, and this portfolio’s startup sequence.'), ['portal', '2free', 'pokedex', 'ferren-landing'], 'gsap-white.svg'),
  tech('pnpm', 'pnpm', 'pnpm.svg', l('Tooling', 'Tooling'), l('Gestor de paquetes eficiente con soporte sólido para workspaces.', 'An efficient package manager with strong workspace support.'), l('Administrar monorepos con instalaciones reproducibles y poco espacio duplicado.', 'Manage monorepos with reproducible installs and little duplicated storage.'), l('Organiza el monorepo de 2 Free, Pokédex Manager y este portfolio, con el lockfile como parte del contrato reproducible.', 'It organizes the 2 Free monorepo, Pokédex Manager, and this portfolio, with the lockfile as part of the reproducible contract.'), ['2free', 'pokedex'], 'pnpm-light.svg'),
  tech('git', 'Git', 'git.svg', l('Control de versiones', 'Version control'), l('Sistema distribuido para registrar cambios y coordinar el desarrollo de software.', 'A distributed system for recording changes and coordinating software development.'), l('Mantener una historia verificable, aislar trabajo y revisar cambios antes de integrarlos.', 'Maintain a verifiable history, isolate work, and review changes before integration.'), l('Lo uso en los cinco proyectos, y en el homelab un commit al repositorio gitops es literalmente el mecanismo de despliegue.', 'I use it across all five projects, and in the homelab a commit to the gitops repository is literally the deployment mechanism.'), ['infraestructura', 'portal', '2free', 'pokedex', 'ferren-landing']),
  tech('proxmox', 'Proxmox VE', 'proxmox.svg', l('Virtualización', 'Virtualization'), l('Plataforma de virtualización sobre Debian para máquinas virtuales y contenedores LXC.', 'A Debian-based virtualization platform for virtual machines and LXC containers.'), l('Dividir un servidor físico en invitados aislados sin renunciar al control del hardware.', 'Split one physical server into isolated guests without giving up control of the hardware.'), l('Es la capa base del homelab: trece invitados sobre un solo servidor de OVHcloud, con la memoria presupuestada y la CPU sobrecomprometida a propósito.', 'It is the base layer of the homelab: thirteen guests on a single OVHcloud server, with memory budgeted and CPU overcommitted on purpose.'), ['infraestructura'], 'proxmox-dark.svg'),
  tech('kubernetes', 'Kubernetes', 'kubernetes.svg', l('Orquestación', 'Orchestration'), l('Orquestador de contenedores que reconcilia continuamente el estado real con el declarado.', 'A container orchestrator that continuously reconciles actual state with declared state.'), l('Describir cómo debe verse un despliegue y dejar que el clúster lo sostenga.', 'Describe what a deployment should look like and let the cluster hold it there.'), l('Corre las aplicaciones del homelab sobre un plano de control de tres miembros con etcd, detrás de un Gateway que termina TLS.', 'It runs the homelab applications on a three-member control plane with etcd, behind a Gateway that terminates TLS.'), ['infraestructura']),
  tech('ansible', 'Ansible', 'ansible.svg', l('Automatización', 'Automation'), l('Automatización sin agente que aplica configuración por SSH desde playbooks y roles.', 'Agentless automation that applies configuration over SSH from playbooks and roles.'), l('Llevar un host a un estado conocido y repetir la operación sin resultados distintos.', 'Bring a host to a known state and repeat the operation without different results.'), l('Configura todo lo que ocurre dentro de un host o un invitado del homelab, con el inventario regenerado desde la salida de Terraform.', 'It configures everything that happens inside a homelab host or guest, with the inventory regenerated from Terraform output.'), ['infraestructura'], 'ansible-dark.svg'),
  tech('terraform', 'Terraform', 'terraform.svg', l('Infraestructura como código', 'Infrastructure as code'), l('Herramienta declarativa que crea recursos y guarda un estado de lo que existe.', 'A declarative tool that creates resources and keeps state describing what exists.'), l('Ver un cambio de infraestructura antes de aplicarlo, en lugar de descubrirlo después.', 'See an infrastructure change before applying it instead of discovering it afterwards.'), l('Aprovisiona el almacenamiento del nodo, los invitados, el DNS y el repositorio GitOps del homelab, con el estado en un bucket R2 creado por su propio stack de bootstrap.', 'It provisions the node storage, the guests, DNS, and the GitOps repository of the homelab, with state in an R2 bucket created by its own bootstrap stack.'), ['infraestructura'], 'terraform-dark.svg'),
  tech('argocd', 'Argo CD', 'argocd.svg', l('Entrega continua', 'Continuous delivery'), l('Controlador de GitOps que sincroniza un clúster de Kubernetes con un repositorio Git.', 'A GitOps controller that syncs a Kubernetes cluster with a Git repository.'), l('Dejar que el repositorio sea la única descripción del clúster y notar cuándo dejan de coincidir.', 'Let the repository be the only description of the cluster and notice when the two stop matching.'), l('Aplica cada commit del repositorio gitops sobre el clúster del homelab; ningún otro proceso escribe en él.', 'It applies every commit from the gitops repository onto the homelab cluster; nothing else writes to it.'), ['infraestructura']),
  tech('jenkins', 'Jenkins', 'jenkins.svg', l('Integración continua', 'Continuous integration'), l('Servidor de automatización para pipelines de prueba, construcción y publicación.', 'An automation server for test, build, and publish pipelines.'), l('Resolver la parte del proceso que ocurre antes de que exista una imagen que desplegar.', 'Handle the part of the process that happens before there is an image to deploy.'), l('Está definido por completo con JCasC, construye en un agente aparte porque ejecuta código de pull requests, y publica la imagen por digest sha256.', 'It is defined entirely through JCasC, builds on a separate agent because it runs pull request code, and publishes the image by sha256 digest.'), ['infraestructura']),
  tech('wireguard', 'WireGuard', undefined, l('Redes', 'Networking'), l('VPN en el kernel con criptografía fija y una configuración corta.', 'An in-kernel VPN with fixed cryptography and a short configuration.'), l('Tener una sola puerta a una red privada en lugar de exponer interfaces administrativas.', 'Have one door into a private network instead of exposing administrative interfaces.'), l('Es la única entrada a la red interna del homelab; las interfaces de administración solo resuelven a través del túnel.', 'It is the only way into the homelab’s internal network; administrative interfaces resolve only through the tunnel.'), ['infraestructura']),
  tech('github-actions', 'GitHub Actions', 'githubactions.svg', l('Integración continua', 'Continuous integration'), l('Automatización dentro del repositorio, definida en workflows versionados junto al código.', 'Automation inside the repository, defined in workflows versioned next to the code.'), l('Ejecutar comprobaciones en cada push y cada pull request sin mantener un servidor.', 'Run checks on every push and pull request without maintaining a server.'), l('Corre la cadena de calidad de este portfolio y las pruebas de Pokédex Manager contra un MongoDB real, sin omitir la persistencia.', 'It runs this portfolio’s quality chain and the Pokédex Manager tests against a real MongoDB, without skipping persistence.'), ['pokedex', 'infraestructura']),
  tech('prometheus', 'Prometheus', undefined, l('Observabilidad', 'Observability'), l('Base de series temporales que recolecta métricas por scrape y las consulta con PromQL.', 'A time-series database that collects metrics by scraping and queries them with PromQL.'), l('Saber qué estaba pasando antes de una falla, no solo que ocurrió.', 'Know what was happening before a failure, not only that it happened.'), l('Recolecta las métricas del homelab desde un invitado propio, fuera del clúster que observa.', 'It collects homelab metrics from its own guest, outside the cluster it watches.'), ['infraestructura']),
  tech('grafana', 'Grafana', undefined, l('Observabilidad', 'Observability'), l('Interfaz de consulta y tableros sobre métricas y registros.', 'A query and dashboard interface over metrics and logs.'), l('Reunir métricas y registros en una vista para diagnosticar sin cambiar de herramienta.', 'Bring metrics and logs into one view so diagnosis does not mean switching tools.'), l('Lee Prometheus y Loki y se sirve fuera del clúster, porque un tablero que depende del clúster no está disponible cuando hace falta.', 'It reads Prometheus and Loki and is served outside the cluster, because a dashboard that depends on the cluster is unavailable when it is needed.'), ['infraestructura']),
  tech('mongodb', 'MongoDB', 'mongodb.svg', l('Datos', 'Data'), l('Base documental con índices, agregaciones y esquema definido por la aplicación.', 'A document database with indexes, aggregations, and a schema defined by the application.'), l('Guardar documentos con la forma que pide cada consulta sin forzar un modelo relacional.', 'Store documents shaped the way each query asks for, without forcing a relational model.'), l('Persiste sesiones, colección, caché de PokéAPI y conversaciones en Pokédex Manager, con veintiséis índices que la aplicación verifica al arrancar.', 'It persists sessions, collection, PokéAPI cache, and conversations in Pokédex Manager, with twenty-six indexes the application verifies at startup.'), ['pokedex'], 'mongodb-dark.svg'),
  tech('bitwarden', 'Bitwarden', 'bitwarden.svg', l('Secretos', 'Secrets'), l('Bitwarden Secrets Manager: almacén de secretos con acceso por proyecto y clientes para máquinas.', 'Bitwarden Secrets Manager: a secrets store with per-project access and machine clients.'), l('Mantener las credenciales fuera del repositorio, del historial del shell y de la lista de procesos.', 'Keep credentials out of the repository, out of shell history, and out of the process list.'), l('Guarda cada secreto del homelab; un solo script los lee y todos los objetivos de make pasan por él.', 'It holds every homelab secret; a single script reads them and every make target goes through it.'), ['infraestructura'], 'bitwarden-dark.svg'),
  tech('mcp', 'MCP', 'mcp.svg', l('Integración de IA', 'AI integration'), l('Model Context Protocol: un contrato para exponer herramientas y recursos a un modelo dentro de una sesión.', 'Model Context Protocol: a contract for exposing tools and resources to a model inside a session.'), l('Que un asistente lea datos por una herramienta con esquema y permisos en lugar de deducirlos del texto.', 'Let an assistant read data through a schemed, permissioned tool instead of inferring it from text.'), l('Escribí el servidor MCP de Pokédex Manager: seis herramientas de solo lectura que el asistente y los clientes externos consumen por la misma frontera, así que el asistente cita lo que devolvió una herramienta.', 'I wrote the MCP server in Pokédex Manager: six read-only tools that the assistant and external clients consume through the same boundary, so the assistant cites what a tool returned.'), ['pokedex'], 'mcp-dark.svg'),
  tech('claude-code', 'Claude Code', undefined, l('Agentes de codificación', 'Coding agents'), l('Agente de codificación de Anthropic que trabaja en la terminal sobre el repositorio abierto.', 'Anthropic’s coding agent, working in the terminal against the open repository.'), l('Delegar exploración, cambios acotados y verificación, y revisar el resultado como se revisa un pull request.', 'Delegate exploration, bounded changes, and verification, then review the result the way a pull request is reviewed.'), l('Es uno de los agentes de codificación con los que trabajo, junto a OpenCode, Codex y Pi, bajo la metodología de Spec-Driven Development. Entre todos hacen que el stack que ya domino no limite el que puedo aprender. Tengo el certificado de Hybridge, del 4 de septiembre de 2026.', 'It is one of the coding agents I work with, alongside OpenCode, Codex and Pi, under the Spec-Driven Development method. Together they keep the stack I already know from limiting the stack I can learn. I hold Hybridge’s certificate, dated 4 September 2026.'), ['infraestructura', 'pokedex', 'ferren-landing']),
  tech('tanstack', 'TanStack', 'tanstack.svg', l('Web y enrutamiento', 'Web and routing'), l('Router tipado desde el árbol de archivos y framework full stack para React.', 'A typed file-tree router and a full-stack framework for React.'), l('Definir rutas de interfaz y de servidor en un mismo árbol, con los enlaces verificados al compilar.', 'Define interface and server routes in one tree, with links verified at build time.'), l('Sostiene la navegación y las rutas de servidor de Pokédex Manager: TanStack Router en el navegador y TanStack Start sobre Vite y Nitro.', 'It carries the navigation and server routes of Pokédex Manager: TanStack Router in the browser and TanStack Start on Vite and Nitro.'), ['pokedex'], 'tanstack-dark.svg'),
] as const;

export const technologyIndexEntries = (() => {
  const entries = technologies.map((technology, sourceIndex) => ({ technology, sourceIndex }));

  for (let index = 2; index < entries.length - 1; index += 4) {
    [entries[index], entries[index + 1]] = [entries[index + 1], entries[index]];
  }

  return entries;
})();

export function text(value: Localized, locale: Locale): string {
  return value[locale];
}

export function projectPath(project: Project, locale: Locale): string {
  return locale === 'es' ? `/proyectos/${project.slug}/` : `/en/projects/${project.slug}/`;
}

export function modulePath(project: Project, module: ProjectModule, locale: Locale): string {
  return `${projectPath(project, locale)}${module.slug}/`;
}

export function technologyPath(technology: Technology, locale: Locale): string {
  return locale === 'es' ? `/tecnologias/${technology.slug}/` : `/en/technologies/${technology.slug}/`;
}

export function localizedPath(path: string, locale: Locale): string {
  if (locale === 'en') {
    if (path === '/') return '/en/';
    return `/en${path}`;
  }
  return path;
}
