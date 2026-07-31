import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const slugs = [
  'asistencia',
  'estudio',
  'control-servicios',
  'revision-vehiculos',
  'inventario-ppf',
  'ventas',
  'finanzas',
  'cotizador-ppf',
  'notificaciones',
  'infraestructura-ha',
];
const posterFrames = {
  asistencia: 160,
  estudio: 192,
  'control-servicios': 170,
  'revision-vehiculos': 170,
  'inventario-ppf': 170,
  ventas: 100,
  finanzas: 170,
  'cotizador-ppf': 170,
  notificaciones: 170,
  'infraestructura-ha': 170,
};
const output = join(process.cwd(), 'public/assets/projects/portal/demos');
mkdirSync(output, { recursive: true });

for (const slug of slugs) {
  const result = spawnSync(
    'pnpm',
    [
      'exec',
      'remotion',
      'render',
      'video/index.ts',
      `Portal-${slug}`,
      join(output, `${slug}.mp4`),
      '--codec=h264',
      '--crf=28',
      '--concurrency=4',
      '--log=error',
    ],
    { cwd: process.cwd(), stdio: 'inherit' },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);

  const posterResult = spawnSync(
    'pnpm',
    [
      'exec',
      'remotion',
      'still',
      'video/index.ts',
      `Portal-${slug}`,
      join(output, `${slug}.png`),
      `--frame=${posterFrames[slug]}`,
      '--log=error',
    ],
    { cwd: process.cwd(), stdio: 'inherit' },
  );
  if (posterResult.status !== 0) process.exit(posterResult.status ?? 1);
}
