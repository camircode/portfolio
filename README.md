# camir.tech

[![Calidad](https://github.com/camircode/portfolio/actions/workflows/quality.yml/badge.svg)](https://github.com/camircode/portfolio/actions/workflows/quality.yml)

Portfolio bilingüe de sistemas de **Carlos Miranda**, construido como un rack de operaciones interactivo en lugar de una galería convencional de proyectos.

[Visitar camir.tech](https://camir.tech) · [Versión en inglés](https://camir.tech/en/) · [Perfil de GitHub](https://github.com/camircode) · [2 Free](https://github.com/camircode/2free)

![Vista previa del portfolio camir.tech](public/assets/og/portfolio.png)

## Qué demuestra

- Una experiencia inicial inmersiva y guiada, con rutas reales e indexables detrás de cada módulo.
- Contenido canónico en español con rutas equivalentes en inglés bajo `/en/`.
- Mapas detallados de FER&REN Portal y de la plataforma de código abierto [2 Free](https://github.com/camircode/2free).
- Artículos dedicados para cada área de proyecto y tecnología, en lugar de una galería limitada al cliente.
- Páginas Astro estáticas primero, mejoradas con GSAP, Three.js, contenido Remotion y transiciones de vista de Astro.
- Mejora progresiva, soporte para movimiento reducido, acceso por teclado, datos estructurados y generación de sitemap.

## Arquitectura

| Capa | Responsabilidad |
| --- | --- |
| `src/data/` | Contenido tipado compartido entre ambos idiomas: proyectos, módulos, tecnologías y narrativas de casos de estudio. |
| `src/pages/` | Rutas canónicas en español y sus equivalentes en inglés. |
| `src/components/` | Rack inmersivo, mapas de proyectos, artículos, rieles de navegación y evidencia multimedia. |
| `src/scripts/` | Artefactos progresivos de módulos construidos con Three.js. |
| `video/` | Composiciones Remotion para demostraciones sanitizadas de los flujos del Portal. |
| `public/assets/` | Tipografías, logos, capturas, pósteres y videos generados para producción. |
| `scripts/` | Auditoría del sitio, generación del CV y renderizado de demostraciones del Portal. |

El sitio entrega primero HTML utilizable. JavaScript añade activación guiada, transiciones espaciales, movimiento y escenas 3D acotadas sin convertirse en un requisito para acceder al contenido.

## Desarrollo local

### Requisitos

- Node.js 22.12 o superior
- pnpm 11
- Chromium, instalado mediante Playwright para ejecutar la auditoría en navegador

### Configuración

```bash
pnpm install
cp .env.example .env
pnpm astro dev --background
```

El servidor de desarrollo queda disponible en `http://localhost:4321`.

```bash
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

### Entorno

| Variable | Propósito |
| --- | --- |
| `PUBLIC_2FREE_URL` | URL pública opcional para la futura página de presentación de 2 Free. La acción para visitar el sitio permanece oculta cuando el valor está vacío. |

No se requieren credenciales ni valores privados de infraestructura para construir el portfolio.

## Comandos

| Comando | Propósito |
| --- | --- |
| `pnpm astro check` | Validar Astro y TypeScript. |
| `pnpm build` | Generar el sitio de producción en `dist/`. |
| `pnpm audit:site` | Auditar rutas adaptables, interacciones, multimedia, preferencias de movimiento y enlaces internos en Chromium. |
| `pnpm generate:demos` | Renderizar con Remotion los videos y pósteres sanitizados del Portal. |
| `pnpm generate:cv` | Regenerar los archivos públicos del CV en inglés. |

La verificación completa de producción se ejecuta con:

```bash
pnpm astro check
pnpm build
pnpm astro dev --background
pnpm audit:site
pnpm astro dev stop
```

## Modelo de contenido

Los proyectos, sus módulos y las tecnologías viven en `src/data/content.ts`. Las narrativas de implementación más extensas viven en `src/data/stories.ts`. Ambas versiones de idioma consumen los mismos registros tipados para mantener alineados el orden de rutas, las relaciones y las afirmaciones técnicas.

Al añadir un elemento, se debe conservar una ruta real en ambos idiomas y actualizar los datos compartidos en lugar de duplicar contenido dentro de las plantillas de página.

## Límite de privacidad

FER&REN Portal es un sistema privado en producción. Este repositorio **no** contiene su código fuente, credenciales, URLs internas, registros de clientes, datos de empleados, información financiera ni configuración de infraestructura de producción.

El contenido multimedia del Portal se recrea con Remotion a partir de flujos verificados, con registros ficticios y sin conexión a producción. Las capturas públicas se limitan a pantallas sin autenticación o demostraciones sanitizadas. El contenido generado explica el flujo, pero no reproduce por completo la interfaz ni la experiencia de usuario del sistema en producción.

## Despliegue

`astro build` genera un sitio compatible con cualquier proveedor de alojamiento estático. El origen de producción está configurado como `https://camir.tech` en `astro.config.mjs`; debe actualizarse antes de desplegar una copia derivada bajo otro dominio.

## Derechos

Copyright © 2026 Carlos Miranda. Todos los derechos reservados.

El código fuente de este repositorio está disponible para revisión. No se concede una licencia de código abierto. El contenido personal, la marca, los CV, certificados, recursos de proyectos y marcas de terceros no pueden reutilizarse sin permiso de su titular correspondiente.
