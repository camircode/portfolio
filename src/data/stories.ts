import type { Localized, Project } from '@/data/content';

const l = (es: string, en: string): Localized => ({ es, en });

export type ModuleStory = Readonly<{
  steps: readonly [Localized, Localized, Localized];
  implementation: Localized;
}>;

export const projectNarratives: Readonly<Record<Project['slug'], readonly Localized[]>> = {
  infraestructura: [
    l(
      'Un solo servidor de OVHcloud sostiene trece invitados, un clúster de Kubernetes y la entrega de todo lo que publico. Proxmox divide el hardware, Kubernetes ejecuta las cargas y un repositorio Git describe qué debe estar corriendo; entre un push y una respuesta HTTPS pública no queda ningún paso manual.',
      'A single OVHcloud server holds thirteen guests, a Kubernetes cluster, and the delivery path for everything I publish. Proxmox splits the hardware, Kubernetes runs the workloads, and a Git repository describes what should be running; between a push and a public HTTPS response there is no manual step left.',
    ),
    l(
      'El reparto de responsabilidades es explícito. Terraform crea recursos y guarda su estado en un bucket remoto que otro stack creó primero; Ansible se ocupa de todo lo que ocurre dentro de un invitado, con el inventario regenerado desde la salida de Terraform. Los scripts largos de remote-exec quedaron fuera: terminan con código 0, el recurso reporta éxito y el estado deja de describir la realidad.',
      'The division of responsibility is explicit. Terraform creates resources and keeps its state in a remote bucket another stack created first; Ansible owns everything that happens inside a guest, with the inventory regenerated from Terraform output. Long remote-exec scripts were left out: they exit 0, the resource reports success, and state stops describing reality.',
    ),
    l(
      'Lo que más cambió el diseño fue reiniciar el servidor. El primer reinicio devolvió todo menos el túnel, y la causa eran unidades systemd hechas a mano que cargaban sus propias tablas de nftables en cada arranque; ninguna prueba las había visto porque cada ejecución de Ansible las borraba antes de medir. Desde entonces cada procedimiento de recuperación anota si llegó a ejecutarse contra este clúster, y el segundo reinicio devolvió los trece invitados sin tocar nada.',
      'The design changed most when I rebooted the server. The first reboot brought everything back except the tunnel, and the cause was hand-built systemd units loading their own nftables tables on every boot; no test had ever seen them because each Ansible run deleted them before measuring. Since then every recovery procedure records whether it was ever run against this cluster, and the second reboot brought all thirteen guests back with nothing touched.',
    ),
  ],
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
  pokedex: [
    l(
      'Un asistente que conversa sobre una colección puede inventar lo que no encuentra. Pokédex Manager resuelve eso antes que la conversación: el modelo no consulta la base de datos, ejecuta herramientas con esquema por una sesión MCP de solo lectura y la respuesta cita cuáles se ejecutaron.',
      'An assistant talking about a collection can make up whatever it fails to find. Pokédex Manager settles that before the conversation: the model does not query the database, it runs schemed tools through a read-only MCP session, and the answer cites which ones ran.',
    ),
    l(
      'El asistente interno y los clientes MCP externos atraviesan la misma frontera: un puerto de producto de solo lectura, en memoria para uno y por Streamable HTTP con bearer y sujeto explícitos para el otro. No existe una ruta paralela que evite el aislamiento por cuenta, y ninguna operación MCP escribe datos de negocio.',
      'The internal assistant and external MCP clients cross the same boundary: a read-only product port, in memory for one and over Streamable HTTP with an explicit bearer and subject for the other. There is no parallel route around per-account isolation, and no MCP operation writes business data.',
    ),
    l(
      'El resto del producto no depende de que Kimi esté disponible. Sin proveedor de IA quedan catálogo, colección, estadísticas y un asistente local que cruza esa misma frontera; una caché de 24 horas en MongoDB conserva la última ficha conocida de PokéAPI, y el contenedor verifica sus índices antes de arrancar en lugar de operar sobre una base ambigua.',
      'The rest of the product does not depend on Kimi being available. Without an AI provider the catalog, collection, statistics, and a local assistant crossing that same boundary remain; a 24-hour MongoDB cache keeps the last known PokéAPI entry, and the container verifies its indexes before starting instead of running against an ambiguous database.',
    ),
  ],
  'ferren-landing': [
    l(
      'FER&REN DETAILING - CUSTOM ofrece protección cerámica, PPF, wrap, películas, pintura y varillaje, y quien llega rara vez sabe cuál de esos servicios corresponde a su caso. La landing existe para que esa decisión ocurra antes de la cotización, no dentro de una conversación de WhatsApp que empieza desde cero.',
      'FER&REN DETAILING - CUSTOM offers ceramic protection, PPF, wrap, films, paint, and dent work, and visitors rarely know which of those fits their case. The landing exists so that decision happens before the quote, not inside a WhatsApp conversation that starts from nothing.',
    ),
    l(
      'Cada servicio tiene su propia página estática, y su ruta y su nombre coinciden con la documentación operativa del estudio para que el sitio y el mostrador hablen del mismo servicio. Los paquetes cerámicos publican precio por tamaño de vehículo porque existe una tabla que lo respalda; PPF, wrap, rotulación, hojalatería, pintura y varillaje aparecen bajo cotización.',
      'Each service has its own static page, and its route and name match the studio’s operational documentation so the site and the counter describe the same service. Ceramic packages publish a price by vehicle size because a table supports it; PPF, wrap, lettering, bodywork, paint, and dent work appear as quote-only.',
    ),
    l(
      'La entrega sigue esa misma economía. El ClientRouter de Astro reemplaza el HTML ya generado para que el video de la portada no vuelva a empezar en cada navegación, GSAP se carga solo ahí, y el resto del catálogo se lee sin JavaScript, con las tablas de precios convertidas en tarjetas cuando la pantalla es pequeña.',
      'Delivery follows the same economy. Astro’s ClientRouter swaps in the already-generated HTML so the hero video does not restart on every navigation, GSAP loads only there, and the rest of the catalog reads without JavaScript, with the price tables turning into cards on small screens.',
    ),
  ],
};

export const moduleStories: Readonly<Record<Project['slug'], Readonly<Record<string, ModuleStory>>>> = {
  infraestructura: {
    aprovisionamiento: {
      steps: [
        l('Un stack de bootstrap crea el bucket remoto donde vivirá el estado de todos los demás.', 'A bootstrap stack creates the remote bucket that will hold every other stack’s state.'),
        l('Los stacks siguientes describen almacenamiento e imágenes base, invitados, DNS y el repositorio GitOps.', 'The following stacks describe storage and base images, guests, DNS, and the GitOps repository.'),
        l('Cada cambio se revisa como plan antes de aplicarse contra el servidor.', 'Every change is reviewed as a plan before it is applied against the server.'),
      ],
      implementation: l('El estado no vive en el servidor que describe, así que perder el nodo no significa perder el registro de lo que existía. Separar bootstrap, base, invitados, DNS y GitOps en cinco stacks permite planear un cambio de red sin arrastrar el aprovisionamiento completo, y el plan es donde se descubre que una modificación iba a recrear un invitado.', 'State does not live on the server it describes, so losing the node does not mean losing the record of what existed. Splitting bootstrap, base, guests, DNS, and GitOps into five stacks makes it possible to plan a network change without dragging the whole provisioning along, and the plan is where you find out an edit was going to recreate a guest.'),
    },
    configuracion: {
      steps: [
        l('Terraform publica la salida de los invitados que acaba de crear.', 'Terraform publishes the output of the guests it just created.'),
        l('El inventario de Ansible se regenera desde esa salida en lugar de mantenerse a mano.', 'The Ansible inventory is regenerated from that output instead of being maintained by hand.'),
        l('Los roles llevan cada host a un estado conocido y vuelven a ejecutarse sin cambiarlo.', 'Roles bring each host to a known state and run again without changing it.'),
      ],
      implementation: l('El inventario derivado elimina la clase de error más aburrida de la automatización: una máquina que existe pero que ningún playbook alcanza porque nadie actualizó una lista. Los roles se escriben para repetirse, y esa disciplina también los vuelve el lugar correcto para afirmar lo que no debe existir en un host, no solo lo que sí.', 'A derived inventory removes the dullest class of automation failure: a machine that exists but no playbook reaches because nobody updated a list. Roles are written to be repeated, and that discipline also makes them the right place to assert what must not exist on a host, not only what must.'),
    },
    cluster: {
      steps: [
        l('Tres nodos de control comparten etcd y una dirección virtual.', 'Three control nodes share etcd and a virtual address.'),
        l('Un Gateway termina TLS con un certificado comodín que cert-manager renueva por DNS-01.', 'A Gateway terminates TLS with a wildcard certificate cert-manager renews over DNS-01.'),
        l('Un miembro de etcd sin voto guarda snapshots fuera del servidor.', 'A non-voting etcd member keeps snapshots off the server.'),
      ],
      implementation: l('Tres votantes de etcd toleran la pérdida de uno; el miembro sin voto no altera el quórum y existe para que el respaldo salga del mismo hardware que protege. La renovación va por DNS-01 y no por HTTP-01 porque los nodos no están expuestos, y validar un certificado no debería ser la razón para exponerlos.', 'Three etcd voters tolerate losing one; the non-voting member does not change quorum and exists so the backup leaves the hardware it protects. Renewal goes over DNS-01 rather than HTTP-01 because the nodes are not exposed, and validating a certificate should not be the reason to expose them.'),
    },
    entrega: {
      steps: [
        l('Jenkins prueba y construye en un agente aparte, porque ejecuta código que llega en pull requests.', 'Jenkins tests and builds on a separate agent, because it runs code that arrives in pull requests.'),
        l('La imagen se publica por digest sha256 y ese digest entra como commit al repositorio gitops.', 'The image is published by sha256 digest, and that digest lands as a commit in the gitops repository.'),
        l('Argo CD sincroniza ese repositorio contra el clúster y señala cuándo dejan de coincidir.', 'Argo CD syncs that repository against the cluster and flags when the two stop matching.'),
      ],
      implementation: l('La etiqueta de una imagen puede reapuntar; un digest no. Fijar el despliegue por sha256 significa que el repositorio gitops describe una versión concreta y que reconstruir el clúster desde ese repositorio devuelve los mismos bytes. Jenkins está definido por completo con JCasC, así que la configuración del servidor de compilación también se revisa como archivo.', 'An image tag can be repointed; a digest cannot. Pinning the deployment by sha256 means the gitops repository describes one specific version, and rebuilding the cluster from that repository returns the same bytes. Jenkins is defined entirely through JCasC, so the build server configuration is reviewed as a file too.'),
    },
    'secretos-y-acceso': {
      steps: [
        l('Cada secreto vive en Bitwarden Secrets Manager, bajo un proyecto con su propio acceso.', 'Every secret lives in Bitwarden Secrets Manager, under a project with its own access.'),
        l('Un solo script los lee y todos los objetivos de make pasan por él.', 'A single script reads them, and every make target goes through it.'),
        l('WireGuard es la única entrada; las interfaces de administración solo resuelven por el túnel.', 'WireGuard is the only way in; administrative interfaces resolve only through the tunnel.'),
      ],
      implementation: l('Nada viaja por la línea de comandos, donde quedaría en el historial del shell y en la lista de procesos de cualquiera que mire. Las dos excepciones están documentadas donde ocurren: el token de GitHub se toma del llavero del CLI gh en lugar de duplicarse, y el secreto de descarga del registro lo escribe Ansible dentro del clúster, porque no puede vivir en un repositorio GitOps público.', 'Nothing travels on a command line, where it would remain in shell history and in the process list for anyone who looks. The two exceptions are documented where they occur: the GitHub token is taken from the gh CLI keyring instead of being duplicated, and the registry pull secret is written into the cluster by Ansible, because it cannot live in a public GitOps repository.'),
    },
    datos: {
      steps: [
        l('Un invitado lleva el primario de PostgreSQL y Redis; otro mantiene una réplica en streaming.', 'One guest holds the PostgreSQL primary and Redis; another keeps a streaming standby.'),
        l('Cada procedimiento de recuperación vive como documento junto a los scripts que ejecuta.', 'Each recovery procedure lives as a document next to the scripts it runs.'),
        l('Ese documento anota si el procedimiento llegó a ejecutarse contra este clúster.', 'That document records whether the procedure was ever run against this cluster.'),
      ],
      implementation: l('La promoción de la réplica se probó hasta la línea temporal 2 y después se volvió a sembrar; la restauración de etcd se promovió, se verificó y se revirtió. Los casos que no se han ejecutado quedan marcados como tales en la misma tabla, porque un procedimiento que nadie ha corrido es una hipótesis, no un respaldo.', 'The replica promotion was tested through timeline 2 and then re-seeded; the etcd restore was promoted, verified, and reverted. The cases that have not been run are marked as such in the same table, because a procedure nobody has run is a hypothesis, not a backup.'),
    },
    observabilidad: {
      steps: [
        l('Prometheus recolecta métricas por scrape y Loki concentra los registros.', 'Prometheus collects metrics by scraping and Loki concentrates the logs.'),
        l('Grafana consulta ambos desde un invitado propio, fuera del clúster que observa.', 'Grafana queries both from its own guest, outside the cluster it watches.'),
        l('Su interfaz resuelve por el túnel y no atraviesa el Gateway del clúster.', 'Its interface resolves through the tunnel and does not cross the cluster Gateway.'),
      ],
      implementation: l('Un tablero servido a través del clúster deja de estar disponible justo cuando hay que consultarlo, así que la pila de observabilidad no comparte destino con las cargas que mide. La memoria del nodo se presupuesta en lugar de sobrecomprometerse; la CPU sí se sobrecompromete, porque una carga intermitente lo tolera y la memoria no.', 'A dashboard served through the cluster stops being available exactly when it has to be read, so the observability stack does not share fate with the workloads it measures. Node memory is budgeted rather than overcommitted; CPU is overcommitted, because an intermittent workload tolerates that and memory does not.'),
    },
  },
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
  pokedex: {
    catalogo: {
      steps: [
        l('La búsqueda filtra por tipo, generación, habilidad y categoría Pokédex.', 'Search filters by type, generation, ability, and Pokédex category.'),
        l('El orden se resuelve sobre el catálogo completo, por generación o por cada estadística base.', 'Sorting is resolved across the whole catalog, by generation or by each base stat.'),
        l('Una caché de 24 horas en MongoDB conserva la última ficha conocida de cada especie.', 'A 24-hour MongoDB cache keeps the last known entry for each species.'),
      ],
      implementation: l('Ordenar solo la página visible produce un ranking falso, así que el orden se aplica antes de paginar. Cuando PokéAPI no responde, una ficha vencida se sigue leyendo desde la caché en lugar de desaparecer: un dato viejo sirve más que un error, siempre que la aplicación sepa que está vencido.', 'Sorting only the visible page produces a false ranking, so ordering is applied before pagination. When PokéAPI does not answer, an expired entry still reads from the cache instead of disappearing: stale data is worth more than an error, as long as the application knows it is stale.'),
    },
    coleccion: {
      steps: [
        l('Cada consulta lleva el identificador de la cuenta.', 'Every query carries the account identifier.'),
        l('Un índice único impide repetir una especie dentro de la misma colección.', 'A unique index prevents repeating a species within the same collection.'),
        l('La entrada guarda cantidad, apodo, notas, etiquetas y favorito junto a una instantánea del Pokémon.', 'The entry stores quantity, nickname, notes, tags, and favorite alongside a Pokémon snapshot.'),
      ],
      implementation: l('El aislamiento por cuenta se sostiene en la consulta y en el índice, no en una comprobación que un caso de uso podría olvidar. La instantánea mínima evita que una caída de PokéAPI deje ilegible lo ya registrado, y las estadísticas se derivan de la colección en el servidor en vez de guardarse como un total que puede quedar desfasado.', 'Account isolation is held by the query and by the index, not by a check a use case could forget. The minimal snapshot keeps a PokéAPI outage from making already-recorded entries unreadable, and statistics are derived from the collection on the server instead of stored as a total that can fall out of step.'),
    },
    mcp: {
      steps: [
        l('Seis herramientas de consulta quedan anotadas como de solo lectura.', 'Six query tools are annotated read-only.'),
        l('Todas resuelven por el mismo puerto de producto que usa la aplicación.', 'All of them resolve through the same product port the application uses.'),
        l('El asistente entra por un transporte en memoria y los clientes externos por Streamable HTTP.', 'The assistant enters over an in-memory transport and external clients over Streamable HTTP.'),
      ],
      implementation: l('Una segunda superficie de datos es una segunda oportunidad de olvidar el aislamiento por cuenta, así que MCP no tiene la suya: search_pokemon, get_pokemon, list_my_collection, get_collection_stats, compare_pokemon y get_research_progress llaman a los mismos casos de uso. El bearer HTTP se vincula a un sujeto explícito, equivale a lectura sobre esa cuenta y debe rotarse si se expone.', 'A second data surface is a second chance to forget account isolation, so MCP does not get one: search_pokemon, get_pokemon, list_my_collection, get_collection_stats, compare_pokemon, and get_research_progress call the same use cases. The HTTP bearer is bound to an explicit subject, amounts to read access over that account, and has to be rotated if it is exposed.'),
    },
    asistente: {
      steps: [
        l('Cada envío negocia una sesión MCP, ejecuta tools/list y tools/call, y la cierra al terminar.', 'Each message negotiates an MCP session, runs tools/list and tools/call, and closes it when done.'),
        l('Con Kimi habilitado el modelo descubre y elige las herramientas.', 'With Kimi enabled the model discovers and picks the tools.'),
        l('Sin proveedor de IA, un enrutador determinista cruza esa misma frontera.', 'Without an AI provider, a deterministic router crosses that same boundary.'),
      ],
      implementation: l('La respuesta cita las herramientas que se ejecutaron, así que un dato que ninguna devolvió no tiene dónde apoyarse. El historial queda aislado por cuenta y el contexto que llega al modelo está acotado por el mismo puerto de lectura: Kimi orquesta la conversación, pero no es la autoridad sobre lo que hay en la colección.', 'The answer cites the tools that ran, so a fact none of them returned has nothing to stand on. History stays isolated per account and the context reaching the model is bounded by the same read port: Kimi orchestrates the conversation but is not the authority on what the collection holds.'),
    },
    reconocimiento: {
      steps: [
        l('El navegador prepara y optimiza la imagen antes de enviarla.', 'The browser prepares and optimizes the image before sending it.'),
        l('La aplicación pide consentimiento explícito antes de consultar al modelo.', 'The application asks for explicit consent before querying the model.'),
        l('La propuesta se contrasta contra PokéAPI por identificador y por nombre.', 'The proposal is checked against PokéAPI by identifier and by name.'),
      ],
      implementation: l('El modelo propone y el catálogo resuelve: si la identificación no corresponde a una especie real, no llega a la pantalla de confirmación. La imagen no se guarda en ningún momento y nada entra a la colección sin que la persona lo confirme; cuando la propuesta falla, la misma imagen se reintenta con una indicación en lugar de obligar a repetir la foto.', 'The model proposes and the catalog resolves: if the identification does not match a real species, it never reaches the confirmation screen. The image is never stored and nothing enters the collection without the person confirming it; when a proposal is wrong, the same image is retried with a hint instead of forcing a new photo.'),
    },
    operacion: {
      steps: [
        l('Docker Compose levanta MongoDB y la aplicación con valores de desarrollo local.', 'Docker Compose brings up MongoDB and the application with local development values.'),
        l('El contenedor inicializa y verifica los índices antes de arrancar el servidor.', 'The container initializes and verifies the indexes before starting the server.'),
        l('GitHub Actions ejecuta auditoría, lint, formato, tipos, pruebas y build en cada push.', 'GitHub Actions runs the audit, lint, formatting, types, tests, and build on every push.'),
      ],
      implementation: l('La inicialización es idempotente: crea o verifica los índices, no borra documentos y falla si uno existente contradice el contrato esperado, para no arrancar sobre una base ambigua. Las pruebas de integración corren contra un MongoDB real, porque el aislamiento por cuenta y los índices únicos son exactamente lo que un doble de prueba no comprueba.', 'Initialization is idempotent: it creates or verifies indexes, deletes no documents, and fails if an existing index contradicts the expected contract, so nothing starts against an ambiguous database. Integration tests run against a real MongoDB, because per-account isolation and unique indexes are exactly what a test double does not check.'),
    },
  },
  'ferren-landing': {
    catalogo: {
      steps: [
        l('Un módulo de datos declara cada servicio con su alcance, proceso, ventajas y marcas.', 'One data module declares each service with its scope, process, advantages, and brands.'),
        l('Astro genera desde ahí una página estática por servicio.', 'Astro generates one static page per service from that module.'),
        l('Las secciones y subsecciones conservan su numeración y su ruta propia.', 'Sections and subsections keep their numbering and their own route.'),
      ],
      implementation: l('La ruta y el nombre de cada servicio vienen de la documentación operativa del estudio, no de una reescritura para la web: cuando alguien pregunta por Protección Total Cerámica ONYX, ventas y el sitio se refieren a lo mismo. Cerámicos por superficie, PPF por cobertura, películas de seguridad, pulido, interiores, wrap, varillaje y servicios adicionales tienen cada uno su página indexable.', 'Each service route and name comes from the studio’s operational documentation rather than a rewrite for the web: when someone asks about Protección Total Cerámica ONYX, sales and the site mean the same thing. Ceramic coatings by surface, PPF by coverage, security films, polishing, interiors, wrap, dent work, and additional services each get their own indexable page.'),
    },
    precios: {
      steps: [
        l('Los paquetes cerámicos se comparan por protección, corrección, superficies y precio.', 'Ceramic packages are compared by protection, correction, surfaces, and price.'),
        l('La tabla separa el precio por tamaño de vehículo, como lo hace la documentación de origen.', 'The table separates price by vehicle size, the way the source documentation does.'),
        l('Los servicios que dependen del vehículo y del material se muestran bajo cotización.', 'Services that depend on the vehicle and the material are shown as quote-only.'),
      ],
      implementation: l('PPF, wrap, rotulación, hojalatería, pintura y varillaje no llevan cifra porque el precio depende de la cobertura, el material y el estado de la superficie; publicar un número aproximado obliga a corregirlo en la primera conversación. Donde sí existe tabla, el sitio la reproduce completa y anota que la categoría del vehículo se confirma antes de agendar.', 'PPF, wrap, lettering, bodywork, paint, and dent work carry no figure because price depends on coverage, material, and the condition of the surface; publishing an approximate number means correcting it in the first conversation. Where a table does exist, the site reproduces it in full and notes that the vehicle category is confirmed before scheduling.'),
    },
    conversion: {
      steps: [
        l('Cada llamada a la acción construye su enlace con el servicio que la persona está leyendo.', 'Every call to action builds its link with the service the visitor is reading.'),
        l('WhatsApp se abre con un mensaje que ya nombra ese servicio o material.', 'WhatsApp opens with a message that already names that service or material.'),
        l('Ventas responde sobre algo concreto en lugar de empezar preguntando qué se necesita.', 'Sales answers something specific instead of opening by asking what is needed.'),
      ],
      implementation: l('El texto del mensaje se genera desde el mismo módulo de datos que la página, así que no existe una versión del nombre del servicio que solo viva dentro del enlace. Una conversación que empieza con el interés ya declarado ahorra el intercambio en el que ambas partes averiguan de qué están hablando.', 'The message text is generated from the same data module as the page, so no version of a service name lives only inside the link. A conversation that opens with the interest already stated saves the exchange where both sides work out what they are discussing.'),
    },
    navegacion: {
      steps: [
        l('El ClientRouter de Astro intercepta el click y reemplaza el HTML ya generado.', 'Astro’s ClientRouter intercepts the click and swaps in the already-generated HTML.'),
        l('El video de la portada continúa en lugar de reiniciarse en cada navegación.', 'The hero video continues instead of restarting on every navigation.'),
        l('Los componentes con estado se reinicializan en astro:page-load.', 'Stateful components reinitialize on astro:page-load.'),
      ],
      implementation: l('La regla nativa de transiciones de vista queda declarada como respaldo para cuando el router no está disponible, y el contenido sigue siendo el HTML estático que el servidor ya entregó. GSAP se carga solo en la portada: las diecinueve páginas de servicio se leen sin JavaScript, con un control para pausar el video y las tablas convertidas en tarjetas en pantallas pequeñas.', 'The native view-transition rule stays declared as a fallback for when the router is unavailable, and the content is still the static HTML the server already delivered. GSAP loads only on the home page: the nineteen service pages read without JavaScript, with a control to pause the video and tables turned into cards on small screens.'),
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
  proxmox: l('Proxmox convierte un servidor rentado en trece invitados aislados sin meter una capa de proveedor entre el hardware y yo. Elegirlo obliga a presupuestar memoria en vez de sobrecomprometerla, y a decidir caso por caso: un contenedor LXC comparte kernel con el nodo y una máquina virtual no, así que el agente que construye código de pull requests es una máquina virtual.', 'Proxmox turns a rented server into thirteen isolated guests without putting a provider layer between me and the hardware. Choosing it forces budgeting memory instead of overcommitting it, and deciding case by case: an LXC container shares a kernel with the node and a virtual machine does not, so the agent that builds pull request code is a virtual machine.'),
  kubernetes: l('Kubernetes se gana el lugar por la reconciliación, no por su lista de recursos: describo cómo debe verse un despliegue y el clúster lo sostiene ahí, también después de un reinicio del nodo. El costo es un plano de control que hay que operar, y por eso etcd tiene tres votantes, un miembro sin voto que respalda fuera del servidor y un procedimiento de restauración que ya se ejecutó una vez.', 'Kubernetes earns its place through reconciliation, not through its resource list: I describe what a deployment should look like and the cluster holds it there, including after a node reboot. The cost is a control plane that has to be operated, which is why etcd has three voters, a non-voting member backing up off the server, and a restore procedure that has already been run once.'),
  terraform: l('Terraform muestra un cambio antes de aplicarlo, y esa es la parte que más uso: el plan es donde se descubre que una modificación de red iba a recrear un invitado. El estado es el activo real, no la configuración, así que vive en un bucket remoto creado por su propio stack de bootstrap y no en el servidor que describe.', 'Terraform shows a change before applying it, and that is the part I use most: the plan is where you find out a network edit was going to recreate a guest. State is the real asset, not the configuration, so it lives in a remote bucket created by its own bootstrap stack rather than on the server it describes.'),
  ansible: l('Ansible se ocupa de lo que ocurre dentro de una máquina, que es justo donde Terraform pierde visibilidad. Escribo los roles para que una segunda ejecución sobre un host ya configurado no cambie nada, y mantengo el inventario derivado de la salida de Terraform: una lista escrita a mano se desactualiza sin avisar y deja máquinas que ningún playbook alcanza.', 'Ansible owns what happens inside a machine, which is exactly where Terraform loses visibility. I write roles so a second run against an already-configured host changes nothing, and I keep the inventory derived from Terraform output: a hand-written list goes stale without warning and leaves machines no playbook reaches.'),
  argocd: l('Argo CD convierte el repositorio gitops en la única descripción del clúster: nada más escribe en él, así que una diferencia entre el repositorio y lo que corre es un hecho visible en lugar de una sospecha. Eso también es lo que hace revisable un despliegue, porque el cambio llega como commit con su digest y no como un comando escrito en una terminal.', 'Argo CD makes the gitops repository the only description of the cluster: nothing else writes to it, so a difference between the repository and what runs is a visible fact rather than a suspicion. That is also what makes a deployment reviewable, because the change arrives as a commit with its digest instead of a command typed into a terminal.'),
  jenkins: l('Jenkins resuelve la parte del proceso anterior a que exista una imagen que desplegar, y lo mantengo definido por completo con JCasC para revisar su configuración como código y no como una serie de clicks. Construye en un agente separado del controlador porque ejecuta código que llega en pull requests, y publica por digest para que el despliegue no dependa de una etiqueta que puede reapuntar.', 'Jenkins handles the part of the process before there is an image to deploy, and I keep it defined entirely through JCasC so its configuration is reviewed as code instead of as a series of clicks. It builds on an agent separate from the controller because it runs code arriving in pull requests, and it publishes by digest so the deployment does not depend on a tag that can be repointed.'),
  wireguard: l('WireGuard cabe en una configuración corta y vive en el kernel, sin negociación de algoritmos ni modos de compatibilidad que auditar. Lo uso como única puerta a la red interna, lo que convierte al túnel en dependencia crítica: su módulo carga en el arranque y el firewall del nodo se levanta desde un servicio habilitado, no desde unidades hechas a mano que nadie recuerda.', 'WireGuard fits in a short configuration and lives in the kernel, with no algorithm negotiation or compatibility modes to audit. I use it as the only door into the internal network, which makes the tunnel a critical dependency: its module loads at boot and the node firewall comes up from an enabled service rather than hand-built units nobody remembers.'),
  'github-actions': l('GitHub Actions mantiene las comprobaciones dentro del repositorio, versionadas junto al código que verifican y sin un servidor que administrar. Lo uso donde el trabajo empieza y termina en ese repositorio; cuando el pipeline debe construir código de pull requests y publicar en un registro propio, prefiero un agente aislado que yo controle.', 'GitHub Actions keeps checks inside the repository, versioned next to the code they verify and with no server to administer. I use it where the work starts and ends in that repository; when a pipeline has to build pull request code and publish to a registry I own, I prefer an isolated agent under my control.'),
  prometheus: l('Prometheus guarda la serie completa y no el último valor, que es lo que permite reconstruir qué estaba pasando en los minutos previos a una falla. Recolecta por scrape, así que un objetivo que deja de responder es en sí mismo una señal; lo ejecuto en un invitado aparte para que no comparta destino con aquello que mide.', 'Prometheus stores the whole series rather than the last value, which is what makes it possible to reconstruct what was happening in the minutes before a failure. It collects by scraping, so a target that stops answering is itself a signal; I run it on a separate guest so it does not share fate with what it measures.'),
  grafana: l('Grafana reúne métricas y registros en una misma consulta, que es donde un diagnóstico deja de ser saltar entre herramientas con relojes distintos. Se sirve fuera del clúster y a través del túnel a propósito: un tablero que depende de la infraestructura que observa no está disponible en el único momento en que hace falta.', 'Grafana brings metrics and logs into one query, which is where diagnosis stops being a jump between tools with different clocks. It is served outside the cluster and through the tunnel on purpose: a dashboard that depends on the infrastructure it watches is unavailable at the one moment it is needed.'),
  mongodb: l('MongoDB deja que un documento tenga la forma que pide la consulta, y eso encaja con una colección donde cada entrada guarda su propia instantánea del Pokémon. A cambio, la integridad se traslada a la aplicación: en Pokédex Manager el aislamiento por cuenta se apoya en un índice único por usuario y especie, y el arranque falla si un índice existente contradice el contrato esperado.', 'MongoDB lets a document take the shape the query asks for, and that fits a collection where each entry keeps its own Pokémon snapshot. In exchange, integrity moves into the application: in Pokédex Manager per-account isolation rests on a unique index by user and species, and startup fails if an existing index contradicts the expected contract.'),
  bitwarden: l('Bitwarden Secrets Manager separa el acceso por proyecto y entrega clientes para máquinas, así que un host lee lo suyo sin que exista una copia del secreto en disco. Lo que resuelve no es guardar la credencial sino cómo llega al proceso: un solo script la inyecta como variable de entorno, y nada pasa por la línea de comandos, donde quedaría en el historial y en la lista de procesos.', 'Bitwarden Secrets Manager separates access by project and provides machine clients, so a host reads what belongs to it without a copy of the secret on disk. What it solves is not storing the credential but how it reaches the process: one script injects it as an environment variable, and nothing passes on a command line, where it would remain in history and in the process list.'),
  mcp: l('MCP me interesa como frontera, no como integración: el modelo pide una herramienta con esquema y recibe lo que esa herramienta devuelve, en lugar de recibir un volcado de contexto y deducir el resto. En Pokédex Manager escribí el servidor de modo que el asistente interno y un cliente externo crucen la misma superficie de solo lectura, porque una segunda ruta a los datos es una segunda oportunidad de olvidar el aislamiento por cuenta.', 'MCP interests me as a boundary rather than an integration: the model asks for a schemed tool and receives what that tool returns, instead of receiving a context dump and inferring the rest. In Pokédex Manager I wrote the server so the internal assistant and an external client cross the same read-only surface, because a second route to the data is a second chance to forget per-account isolation.'),
  'claude-code': l('Claude Code trabaja en la terminal sobre el repositorio abierto, así que el resultado se revisa como se revisa un pull request: leyendo el diff y ejecutando la verificación, no confiando en un resumen. Lo trato como colaborador al que hay que dar contexto y límites; el homelab y Pokédex Manager se construyeron así, con los criterios escritos antes que el código.', 'Claude Code works in the terminal against the open repository, so the result is reviewed the way a pull request is reviewed: by reading the diff and running the verification, not by trusting a summary. I treat it as a collaborator that needs context and limits; the homelab and Pokédex Manager were built that way, with the criteria written before the code.'),
  tanstack: l('TanStack Router deriva las rutas del árbol de archivos y las tipa, así que un enlace a una ruta que no existe falla al compilar y no en producción. TanStack Start pone el servidor detrás de ese mismo router: en Pokédex Manager las rutas de interfaz y las de API viven en un solo árbol, y los manejadores HTTP son adaptadores que autentican y validan antes de llamar a un caso de uso.', 'TanStack Router derives routes from the file tree and types them, so a link to a route that does not exist fails at build time and not in production. TanStack Start puts the server behind that same router: in Pokédex Manager the interface routes and the API routes live in one tree, and the HTTP handlers are adapters that authenticate and validate before calling a use case.'),
};
