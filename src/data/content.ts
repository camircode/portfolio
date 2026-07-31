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
  slug: 'portal' | '2free';
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
  logo: string;
  image: string;
  imageAlt: Localized;
  private: boolean;
}>;

export type Technology = Readonly<{
  slug: string;
  name: string;
  logo: string;
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
    'Portfolio de Carlos Miranda, desarrollador de software y consultor DevOps especializado en productos web, local-first e infraestructura autohospedada.',
    'Carlos Miranda’s portfolio: a software developer and DevOps consultant focused on web products, local-first architecture, and self-hosted infrastructure.',
  ),
} as const;

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
      'Next.js y React entregan cuentas, transacciones, presupuestos, metas, gastos compartidos, alertas y portabilidad. El modo invitado demuestra el producto sin registro ni datos reales.',
      'Next.js and React deliver accounts, transactions, budgets, goals, shared expenses, alerts, and portability. Guest mode demonstrates the product without registration or real data.',
    ),
    technologies: ['nextjs', 'react', 'typescript', 'tailwindcss'],
  },
  {
    slug: 'landing',
    title: l('Landing', 'Landing'),
    summary: l('Presentación pública, descargas y autohospedaje.', 'Public presentation, downloads, and self-hosting.'),
    detail: l(
      'Astro entrega una superficie estática con SEO, datos estructurados, descargas por plataforma y una guía separada de Docker Compose.',
      'Astro delivers a static surface with SEO, structured data, platform downloads, and a dedicated Docker Compose self-hosting guide.',
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
      'NestJS compone autenticación, aislamiento por propietario, idempotencia, portabilidad y cifrado de campos sobre Prisma y PostgreSQL.',
      'NestJS composes authentication, owner-scoped access, idempotency, portability, and field encryption on top of Prisma and PostgreSQL.',
    ),
    technologies: ['nestjs', 'better-auth', 'prisma', 'postgresql', 'typescript'],
  },
  {
    slug: 'arquitectura',
    title: l('Núcleo compartido', 'Shared core'),
    summary: l('Dominio independiente de frameworks y contratos portables.', 'Framework-independent domain and portable contracts.'),
    detail: l(
      'Los paquetes de core, application, auth, data-provider, database y UI separan reglas monetarias exactas, puertos de datos y composición de los runtimes web y nativo.',
      'Core, application, auth, data-provider, database, and UI packages keep exact money rules, data ports, and composition separate from web and native runtimes.',
    ),
    technologies: ['typescript', 'vitest', 'playwright', 'pnpm'],
  },
];

export const projects: readonly Project[] = [
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
      '2 Free reúne cuentas, transacciones, presupuestos, metas, gastos compartidos y alertas. Puede trabajar completamente en el dispositivo con SQLCipher o sincronizarse con una instancia administrada o propia.',
      '2 Free brings accounts, transactions, budgets, goals, shared expenses, and alerts together. It can run entirely on-device with SQLCipher or synchronize with a managed or self-hosted instance.',
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
    logo: '/assets/logos/2free.svg',
    image: '/assets/projects/2free/dashboard-desktop.png',
    imageAlt: l('Dashboard de demostración de 2 Free con datos ficticios.', '2 Free guest dashboard with fictional demo data.'),
    private: false,
  },
] as const;

const tech = (
  slug: string,
  name: string,
  logo: string,
  category: Localized,
  summary: Localized,
  purpose: Localized,
  usage: Localized,
  projectSlugs: readonly Project['slug'][],
  logoOnDark?: string,
): Technology => ({ slug, name, logo: `/assets/logos/${logo}`, logoOnDark: logoOnDark ? `/assets/logos/${logoOnDark}` : undefined, category, summary, purpose, usage, projects: projectSlugs });

export const technologies: readonly Technology[] = [
  tech('html', 'HTML', 'html5.svg', l('Fundamentos web', 'Web foundations'), l('Lenguaje de marcado semántico que estructura documentos y aplicaciones web.', 'The semantic markup language that structures web documents and applications.'), l('Construir contenido accesible, indexable y resistente antes de añadir comportamiento.', 'Build accessible, indexable, resilient content before adding behavior.'), l('Es la base de las interfaces del Portal, 2 Free y este portfolio.', 'It is the foundation of the Portal, 2 Free, and this portfolio.'), ['portal', '2free']),
  tech('css', 'CSS', 'css.svg', l('Fundamentos web', 'Web foundations'), l('Lenguaje de estilos para composición, tipografía, adaptación y estados visuales.', 'The styling language for layout, typography, adaptation, and visual states.'), l('Crear interfaces responsive y sistemas visuales sin depender de JavaScript.', 'Create responsive interfaces and visual systems without depending on JavaScript.'), l('Define la presentación base de mis productos web, incluso cuando uso Tailwind CSS.', 'It defines the presentation foundation of my web products, including those that use Tailwind CSS.'), ['portal', '2free']),
  tech('astro', 'Astro', 'Astro_light.svg', l('Web', 'Web'), l('Framework web orientado a contenido con renderizado en servidor y mínimo JavaScript.', 'A content-focused web framework with server rendering and minimal client JavaScript.'), l('Construir sitios rápidos, páginas SSR e islas interactivas sin enviar un runtime completo por defecto.', 'Build fast sites, SSR pages, and interactive islands without shipping a full runtime by default.'), l('Lo usé en el Portal SSR, la landing de 2 Free y este portfolio bilingüe.', 'I used it for the Portal SSR app, the 2 Free landing, and this bilingual portfolio.'), ['portal', '2free']),
  tech('preact', 'Preact', 'preact.svg', l('Interfaz', 'Interface'), l('Alternativa compacta a React para interfaces reactivas.', 'A compact React alternative for reactive interfaces.'), l('Añadir componentes con estado dentro de aplicaciones que no necesitan un runtime pesado.', 'Add stateful components to applications that do not need a heavy runtime.'), l('Construye los módulos interactivos del Portal dentro de páginas Astro SSR.', 'It powers interactive Portal modules inside Astro SSR pages.'), ['portal']),
  tech('flutter', 'Flutter', 'flutter.svg', l('Aplicaciones', 'Applications'), l('Toolkit multiplataforma para crear aplicaciones móviles y de escritorio desde una base de código.', 'A cross-platform toolkit for building mobile and desktop applications from one codebase.'), l('Construir interfaces nativas multiplataforma con un sistema de widgets consistente.', 'Build cross-platform native interfaces with a consistent widget system.'), l('Lo usé para implementar las primeras cinco aplicaciones internas de FER&REN: asistencia, cotización e inventario PPF, ventas e ingresos del estudio.', 'I used it to implement FER&REN’s first five internal applications: attendance, PPF quoting and inventory, sales, and studio income.'), ['portal']),
  tech('supabase', 'Supabase', 'supabase.svg', l('Backend administrado', 'Managed backend'), l('Plataforma backend sobre PostgreSQL para datos y servicios de aplicaciones.', 'A PostgreSQL-based backend platform for application data and services.'), l('Levantar rápidamente persistencia y servicios backend para productos conectados.', 'Quickly provide persistence and backend services for connected products.'), l('Fue el backend de las cinco aplicaciones Flutter iniciales de FER&REN antes de la migración a la infraestructura propia.', 'It backed FER&REN’s first five Flutter applications before the migration to self-hosted infrastructure.'), ['portal']),
  tech('react', 'React', 'React_light.svg', l('Interfaz', 'Interface'), l('Biblioteca declarativa para construir interfaces por componentes.', 'A declarative library for component-based interfaces.'), l('Modelar estados complejos y compartir sistemas visuales entre runtimes.', 'Model complex state and share visual systems between runtimes.'), l('Comparte la UI de 2 Free entre Next.js y Tauri.', 'It shares the 2 Free UI across Next.js and Tauri.'), ['2free']),
  tech('nextjs', 'Next.js', 'next-js-dark.svg', l('Web', 'Web'), l('Framework React para aplicaciones web con renderizado híbrido.', 'A React framework for hybrid-rendered web applications.'), l('Combinar rutas de servidor, componentes React y entrega optimizada.', 'Combine server routes, React components, and optimized delivery.'), l('Entrega la aplicación web autenticada y el modo invitado de 2 Free.', 'It delivers the authenticated 2 Free web app and guest mode.'), ['2free']),
  tech('typescript', 'TypeScript', 'typescript.svg', l('Lenguaje', 'Language'), l('JavaScript con tipos estáticos para contratos más seguros.', 'JavaScript with static types for safer contracts.'), l('Detectar inconsistencias temprano y hacer explícitos los límites entre capas.', 'Catch inconsistencies early and make layer boundaries explicit.'), l('Es el lenguaje principal de las aplicaciones web, paquetes y APIs de ambos proyectos.', 'It is the primary language for web apps, packages, and APIs in both projects.'), ['portal', '2free']),
  tech('javascript', 'JavaScript', 'javascript.svg', l('Lenguaje', 'Language'), l('Lenguaje nativo de la web y base del ecosistema frontend.', 'The web’s native language and the foundation of the frontend ecosystem.'), l('Crear comportamiento progresivo que se ejecuta directamente en el navegador.', 'Create progressive behavior that runs directly in the browser.'), l('Lo uso para interacción, automatización y animaciones en productos web.', 'I use it for interaction, automation, and motion in web products.'), ['portal', '2free']),
  tech('go', 'Go', 'Go-Logo_LightBlue.svg', l('Backend', 'Backend'), l('Lenguaje compilado simple, concurrente y eficiente.', 'A simple, concurrent, and efficient compiled language.'), l('Construir servicios operativos pequeños, predecibles y fáciles de desplegar.', 'Build small, predictable operational services that are easy to deploy.'), l('Implementa notificaciones, monitoreo y control de alta disponibilidad del Portal.', 'It implements notifications, monitoring, and high-availability control for the Portal.'), ['portal']),
  tech('nodejs', 'Node.js', 'nodejsHex.svg', l('Runtime', 'Runtime'), l('Entorno de ejecución de JavaScript para servicios, herramientas y aplicaciones de servidor.', 'A JavaScript runtime for services, tooling, and server applications.'), l('Ejecutar APIs y herramientas TypeScript dentro del mismo ecosistema que las aplicaciones web.', 'Run APIs and TypeScript tooling in the same ecosystem as web applications.'), l('Sostiene la API NestJS y las herramientas de desarrollo de 2 Free.', 'It powers the NestJS API and development tooling for 2 Free.'), ['2free']),
  tech('nestjs', 'NestJS', 'nestjs.svg', l('Backend', 'Backend'), l('Framework de Node.js para APIs modulares y tipadas.', 'A Node.js framework for modular, typed APIs.'), l('Organizar controladores, validación, autenticación y casos de uso en servicios mantenibles.', 'Organize controllers, validation, authentication, and use cases into maintainable services.'), l('Compone la API financiera y de identidad de 2 Free.', 'It composes the 2 Free financial and identity API.'), ['2free']),
  tech('better-auth', 'Better Auth', 'better-auth-mark-dark.svg', l('Identidad', 'Identity'), l('Framework de autenticación para TypeScript.', 'An authentication framework for TypeScript.'), l('Gestionar sesiones, cookies y orígenes confiables con contratos compartidos.', 'Manage sessions, cookies, and trusted origins with shared contracts.'), l('Centraliza la identidad de la web y la API de 2 Free.', 'It centralizes identity across the 2 Free web app and API.'), ['2free'], 'better-auth-mark-light.svg'),
  tech('prisma', 'Prisma', 'Prisma_light.svg', l('Datos', 'Data'), l('ORM tipado para bases de datos relacionales.', 'A typed ORM for relational databases.'), l('Modelar persistencia, migraciones y consultas con tipos generados.', 'Model persistence, migrations, and queries with generated types.'), l('Conecta el dominio cloud de 2 Free con PostgreSQL.', 'It connects the 2 Free cloud domain to PostgreSQL.'), ['2free'], 'Prisma_dark.svg'),
  tech('postgresql', 'PostgreSQL', 'postgresql.svg', l('Datos', 'Data'), l('Base de datos relacional robusta y extensible.', 'A robust, extensible relational database.'), l('Persistir datos transaccionales con integridad, índices y operaciones atómicas.', 'Persist transactional data with integrity, indexes, and atomic operations.'), l('Sostiene la operación del Portal y la modalidad cloud de 2 Free.', 'It supports Portal operations and the cloud mode of 2 Free.'), ['portal', '2free']),
  tech('sqlite', 'SQLite / SQLCipher', 'SQLite.svg', l('Datos locales', 'Local data'), l('Base embebida; SQLCipher agrega cifrado transparente.', 'An embedded database; SQLCipher adds transparent encryption.'), l('Ofrecer persistencia local transaccional sin depender de un servidor.', 'Provide transactional local persistence without depending on a server.'), l('Es el origen local cifrado de 2 Free en Linux y Android.', 'It is the encrypted local source of truth for 2 Free on Linux and Android.'), ['2free']),
  tech('tauri', 'Tauri', 'tauri.svg', l('Nativo', 'Native'), l('Toolkit para aplicaciones de escritorio y móviles con frontend web y núcleo Rust.', 'A toolkit for desktop and mobile apps with a web frontend and Rust core.'), l('Compartir interfaz web sin renunciar a almacenamiento y capacidades nativas controladas.', 'Share a web interface without giving up controlled native storage and capabilities.'), l('Empaqueta 2 Free para Linux y Android y conecta la UI con SQLCipher.', 'It packages 2 Free for Linux and Android and connects the UI to SQLCipher.'), ['2free']),
  tech('rust', 'Rust', 'Rust_light.svg', l('Lenguaje', 'Language'), l('Lenguaje de sistemas con seguridad de memoria sin recolector de basura.', 'A systems language with memory safety and no garbage collector.'), l('Construir límites nativos seguros y eficientes.', 'Build safe and efficient native boundaries.'), l('Gestiona base local, llaves, migraciones y sincronización en 2 Free.', 'It manages local storage, keys, migrations, and synchronization in 2 Free.'), ['2free'], 'Rust_dark.svg'),
  tech('directus', 'Directus', 'directus.svg', l('Datos y CMS', 'Data and CMS'), l('Plataforma de datos sobre SQL con API, permisos y panel administrativo.', 'A data platform on top of SQL with APIs, permissions, and an admin panel.'), l('Exponer datos operativos con control por roles sin construir un back office desde cero.', 'Expose operational data with role controls without building a back office from scratch.'), l('Gestiona identidad y datos operativos del Portal.', 'It manages identity and operational data for the Portal.'), ['portal']),
  tech('docker', 'Docker', 'docker.svg', l('Infraestructura', 'Infrastructure'), l('Contenedores reproducibles para servicios y dependencias.', 'Reproducible containers for services and dependencies.'), l('Empaquetar, conectar y desplegar stacks completos de forma consistente.', 'Package, connect, and deploy complete stacks consistently.'), l('Despliega el Portal, sus servicios Go y el modo autohospedado de 2 Free.', 'It deploys the Portal, its Go services, and 2 Free self-hosting mode.'), ['portal', '2free']),
  tech('dokploy', 'Dokploy', 'dokploy.svg', l('Despliegue', 'Deployment'), l('Plataforma autohospedada para desplegar y administrar aplicaciones y servicios.', 'A self-hosted platform for deploying and managing applications and services.'), l('Centralizar despliegues, configuración y operación de stacks Docker desde una superficie controlada.', 'Centralize deployments, configuration, and Docker stack operations from one controlled surface.'), l('Lo uso para administrar el despliegue de todos mis servicios y aplicaciones.', 'I use it to manage deployment for all my services and applications.'), ['portal', '2free'], 'dokploy-dark.svg'),
  tech('cloudflare', 'Cloudflare', 'cloudflare.svg', l('Infraestructura', 'Infrastructure'), l('Red perimetral, DNS y túneles para servicios web.', 'Edge network, DNS, and tunnels for web services.'), l('Publicar servicios, proteger orígenes y conectar infraestructura distribuida.', 'Publish services, protect origins, and connect distributed infrastructure.'), l('Conecta y protege la infraestructura autohospedada del Portal.', 'It connects and protects the Portal’s self-hosted infrastructure.'), ['portal']),
  tech('linux', 'Linux', 'linux.svg', l('Sistemas', 'Systems'), l('Sistema operativo abierto para servidores y estaciones de trabajo.', 'An open operating system for servers and workstations.'), l('Operar servicios con control, automatización y observabilidad.', 'Operate services with control, automation, and observability.'), l('Administro nodos Debian y distribuyo 2 Free como AppImage.', 'I administer Debian nodes and distribute 2 Free as an AppImage.'), ['portal', '2free']),
  tech('bash', 'Bash', 'Bash_light.svg', l('Automatización', 'Automation'), l('Shell y lenguaje de scripting habitual en sistemas Unix.', 'The common shell and scripting language on Unix systems.'), l('Automatizar instalación, diagnóstico y tareas repetibles de operación.', 'Automate installation, diagnostics, and repeatable operational tasks.'), l('Lo uso para administrar servidores, despliegues y herramientas del repositorio.', 'I use it for server administration, deployments, and repository tooling.'), ['portal', '2free']),
  tech('tailwindcss', 'Tailwind CSS', 'tailwindcss.svg', l('Interfaz', 'Interface'), l('Framework CSS basado en utilidades.', 'A utility-first CSS framework.'), l('Construir sistemas visuales consistentes cerca del marcado.', 'Build consistent visual systems close to the markup.'), l('Da forma a las interfaces responsive del Portal y 2 Free.', 'It shapes the responsive interfaces of the Portal and 2 Free.'), ['portal', '2free']),
  tech('vite', 'Vite', 'vite.svg', l('Tooling', 'Tooling'), l('Servidor de desarrollo y empaquetador web rápido.', 'A fast web development server and bundler.'), l('Entregar ciclos de desarrollo cortos y builds optimizados.', 'Deliver short development cycles and optimized builds.'), l('Compila la interfaz Tauri de 2 Free y herramientas del ecosistema Astro.', 'It builds the 2 Free Tauri UI and tooling around Astro.'), ['2free']),
  tech('vitest', 'Vitest', 'vitest.svg', l('Calidad', 'Quality'), l('Runner de pruebas integrado con Vite y TypeScript.', 'A test runner integrated with Vite and TypeScript.'), l('Verificar unidades y contratos con una configuración rápida y cercana al proyecto.', 'Verify units and contracts with fast project-native configuration.'), l('Cubre lógica compartida, APIs y componentes en ambos proyectos.', 'It covers shared logic, APIs, and components across both projects.'), ['portal', '2free']),
  tech('playwright', 'Playwright', 'playwright-logo.svg', l('Calidad', 'Quality'), l('Automatización de navegadores para pruebas end-to-end y visuales.', 'Browser automation for end-to-end and visual testing.'), l('Comprobar interacción, accesibilidad y regresiones en un navegador real.', 'Check interaction, accessibility, and regressions in a real browser.'), l('Valida rutas y estados visuales de 2 Free.', 'It validates routes and visual states in 2 Free.'), ['2free']),
  tech('gsap', 'GSAP', 'gsap-black.svg', l('Movimiento', 'Motion'), l('Motor de animación para secuencias web precisas.', 'An animation engine for precise web sequences.'), l('Orquestar movimiento con control de tiempos, easing y estados.', 'Orchestrate motion with control over timing, easing, and state.'), l('Anima las landings, microinteracciones y la apertura de este portfolio.', 'It animates landing pages, micro-interactions, and this portfolio’s startup sequence.'), ['portal', '2free'], 'gsap-white.svg'),
  tech('pnpm', 'pnpm', 'pnpm.svg', l('Tooling', 'Tooling'), l('Gestor de paquetes eficiente con soporte sólido para workspaces.', 'An efficient package manager with strong workspace support.'), l('Administrar monorepos con instalaciones reproducibles y poco espacio duplicado.', 'Manage monorepos with reproducible installs and little duplicated storage.'), l('Organiza el monorepo de 2 Free y este portfolio.', 'It organizes the 2 Free monorepo and this portfolio.'), ['2free'], 'pnpm-light.svg'),
  tech('git', 'Git', 'git.svg', l('Control de versiones', 'Version control'), l('Sistema distribuido para registrar cambios y coordinar el desarrollo de software.', 'A distributed system for recording changes and coordinating software development.'), l('Mantener una historia verificable, aislar trabajo y revisar cambios antes de integrarlos.', 'Maintain a verifiable history, isolate work, and review changes before integration.'), l('Lo uso para mantener el Portal, desarrollar 2 Free y organizar entregas reproducibles.', 'I use it to maintain the Portal, develop 2 Free, and organize reproducible deliveries.'), ['portal', '2free']),
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
