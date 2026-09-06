import type { Group, Material, PerspectiveCamera, Scene } from 'three';

declare global {
  interface Window {
    __moduleArtifactsCleanup?: () => void;
  }
}

/**
 * Three.js is loaded through `await import('three')` so the engine never enters
 * the initial module graph of a project page. `ProjectDetail.astro` imports this
 * module statically; a static `from 'three'` here put the whole renderer on the
 * critical path of every project route whether or not it was ever drawn.
 */
type ThreeApi = Pick<
  typeof import('three'),
  | 'AmbientLight'
  | 'BoxGeometry'
  | 'ConeGeometry'
  | 'CylinderGeometry'
  | 'DirectionalLight'
  | 'Group'
  | 'Mesh'
  | 'MeshBasicMaterial'
  | 'MeshStandardMaterial'
  | 'OctahedronGeometry'
  | 'PerspectiveCamera'
  | 'Scene'
  | 'SphereGeometry'
  | 'TorusGeometry'
  | 'Vector3'
>;

type Position = readonly [number, number, number];
type Rotation = readonly [number, number, number];

type ArtifactScene = {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scene: Scene;
  camera: PerspectiveCamera;
  group: Group;
  phase: number;
};

const palette = {
  signal: 0xd7ff4f,
  signalDark: 0x738c24,
  panel: 0x252b27,
  panelHigh: 0x465047,
  ink: 0xf2f1e9,
  muted: 0x929b93,
} as const;

function box(three: ThreeApi, group: Group, size: Position, position: Position, material: Material, rotation: Rotation = [0, 0, 0]) {
  const mesh = new three.Mesh(new three.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function cylinder(three: ThreeApi, group: Group, radius: number, depth: number, position: Position, material: Material, rotation: Rotation = [0, 0, 0], segments = 28) {
  const mesh = new three.Mesh(new three.CylinderGeometry(radius, radius, depth, segments), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function torus(three: ThreeApi, group: Group, radius: number, tube: number, position: Position, material: Material, rotation: Rotation = [0, 0, 0]) {
  const mesh = new three.Mesh(new three.TorusGeometry(radius, tube, 12, 36), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function sphere(three: ThreeApi, group: Group, radius: number, position: Position, material: Material) {
  const mesh = new three.Mesh(new three.SphereGeometry(radius, 24, 16), material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function connect(three: ThreeApi, group: Group, start: Position, end: Position, material: Material, radius = 0.045) {
  const from = new three.Vector3(...start);
  const to = new three.Vector3(...end);
  const direction = to.clone().sub(from);
  const mesh = new three.Mesh(new three.CylinderGeometry(radius, radius, direction.length(), 10), material);
  mesh.position.copy(from.clone().add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new three.Vector3(0, 1, 0), direction.normalize());
  group.add(mesh);
  return mesh;
}

function makeScene(three: ThreeApi, host: HTMLElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, key: string, phase: number): ArtifactScene {
  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(4.1, 2.7, 6.4);
  camera.lookAt(0, 0, 0);
  const group = new three.Group();
  group.rotation.set(-0.08, -0.36, 0.02);
  scene.add(group);

  const metal = new three.MeshStandardMaterial({ color: palette.panel, roughness: 0.38, metalness: 0.72 });
  const high = new three.MeshStandardMaterial({ color: palette.panelHigh, roughness: 0.32, metalness: 0.64 });
  const signal = new three.MeshStandardMaterial({ color: palette.signal, roughness: 0.28, metalness: 0.2 });
  const signalDark = new three.MeshStandardMaterial({ color: palette.signalDark, roughness: 0.45, metalness: 0.28 });
  const ink = new three.MeshStandardMaterial({ color: palette.ink, roughness: 0.5, metalness: 0.1 });
  const light = new three.MeshBasicMaterial({ color: palette.signal });

  // Keyed by `project:module`, never by module slug alone: `catalogo` exists in
  // both pokedex and ferren-landing, and a slug-only switch would give the two
  // the same silhouette.
  switch (key) {
    case 'infraestructura:aprovisionamiento': {
      [0, 1, 2, 3, 4].forEach((index) => {
        box(three, group, [1.85 - index * 0.11, 0.19, 1.2 - index * 0.07], [-0.6, -0.92 + index * 0.4, 0], index === 0 ? signalDark : high, [0, index * 0.055, 0]);
      });
      cylinder(three, group, 0.52, 1.05, [1.55, -0.42, 0.12], metal, [0, 0, 0], 24);
      torus(three, group, 0.52, 0.07, [1.55, 0.1, 0.12], signal, [Math.PI / 2, 0, 0]);
      connect(three, group, [-0.6, -0.92, 0], [1.55, -0.42, 0.12], signal, 0.04);
      break;
    }
    case 'infraestructura:configuracion': {
      box(three, group, [3.3, 0.18, 0.52], [0, 0.92, 0], high);
      [-1.35, -0.45, 0.45, 1.35].forEach((x, index) => {
        box(three, group, [0.68, 0.68, 0.68], [x, -0.5, 0], index === 2 ? high : metal);
        connect(three, group, [x, 0.83, 0], [x, -0.16, 0], index === 2 ? signal : signalDark, 0.035);
      });
      torus(three, group, 0.58, 0.07, [0.45, -0.5, 0], signal, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'infraestructura:cluster': {
      const quorum: Position[] = [[-0.82, 0.98, 0.1], [0, 1.2, -0.35], [0.82, 0.98, 0.1]];
      quorum.forEach((position, index) => sphere(three, group, 0.31, position, index === 1 ? signal : high));
      connect(three, group, quorum[0], quorum[1], signalDark, 0.035);
      connect(three, group, quorum[1], quorum[2], signalDark, 0.035);
      connect(three, group, quorum[2], quorum[0], signalDark, 0.035);
      [-0.66, 0.66].forEach((x) => box(three, group, [1.02, 0.5, 0.82], [x, -0.24, 0], metal));
      box(three, group, [2.62, 0.13, 1.14], [0, -0.94, 0.16], signal);
      connect(three, group, [0, 0.66, -0.1], [0, -0.86, 0.16], signalDark, 0.04);
      break;
    }
    case 'infraestructura:entrega': {
      const chain: Position[] = [[-1.55, -0.82, 0.32], [-0.52, -0.3, 0.16], [0.5, 0.22, 0], [1.5, 0.74, -0.16]];
      chain.forEach((position, index) => {
        const size = 0.46 - index * 0.02;
        box(three, group, [size, size, size], position, index === 3 ? signal : index === 2 ? signalDark : high, [0, 0.2, 0]);
        if (index > 0) connect(three, group, chain[index - 1], position, signal, 0.038);
      });
      torus(three, group, 0.62, 0.075, chain[3], signal, [0.42, 0.5, 0]);
      break;
    }
    case 'infraestructura:secretos-y-acceso': {
      box(three, group, [1.85, 1.85, 1.15], [-0.5, 0, 0], metal);
      box(three, group, [1.5, 1.5, 0.1], [-0.5, 0, 0.6], high);
      torus(three, group, 0.44, 0.1, [-0.5, 0, 0.68], signal);
      cylinder(three, group, 0.12, 0.26, [-0.5, 0, 0.78], ink, [Math.PI / 2, 0, 0]);
      cylinder(three, group, 0.2, 1.55, [1.22, -0.62, 0.1], high, [0, 0, Math.PI / 2], 18);
      torus(three, group, 0.2, 0.06, [0.46, -0.62, 0.1], signal, [0, Math.PI / 2, 0]);
      break;
    }
    case 'infraestructura:datos': {
      [-0.92, 0.62].forEach((x, stack) => {
        [-0.62, -0.24, 0.14].forEach((y) => cylinder(three, group, 0.54, 0.2, [x, y, 0], stack === 0 ? high : metal, [0, 0, 0], 30));
      });
      connect(three, group, [-0.92, 0.5, 0], [0.62, 0.5, 0], signal, 0.05);
      box(three, group, [0.44, 0.44, 0.44], [1.75, -0.95, 0.3], signalDark, [0.2, 0.3, 0]);
      connect(three, group, [0.62, -0.62, 0], [1.75, -0.95, 0.3], signalDark, 0.03);
      break;
    }
    case 'infraestructura:observabilidad': {
      const wire = new three.MeshStandardMaterial({ color: palette.muted, wireframe: true, roughness: 0.4, metalness: 0.6 });
      box(three, group, [1.55, 1.55, 1.55], [-1.02, -0.12, 0], wire);
      box(three, group, [1.5, 1.35, 0.12], [1.02, 0.25, 0.1], high, [0, -0.22, 0]);
      [0.34, 0.68, 0.44, 0.92].forEach((height, index) => {
        box(three, group, [0.2, height, 0.06], [0.53 + index * 0.33, -0.28 + height / 2, 0.22], index === 3 ? signal : ink, [0, -0.22, 0]);
      });
      connect(three, group, [-0.32, 0.1, 0.2], [0.5, 0.4, 0.2], signal, 0.032);
      break;
    }
    case 'portal:asistencia': {
      cylinder(three, group, 1.12, 0.3, [-0.25, 0.05, 0], high, [Math.PI / 2, 0, 0]);
      torus(three, group, 1.12, 0.09, [-0.25, 0.05, 0.17], signal, [0, 0, 0]);
      box(three, group, [0.08, 0.72, 0.08], [-0.25, 0.34, 0.35], ink, [0, 0, -0.38]);
      box(three, group, [0.08, 0.5, 0.08], [-0.08, -0.1, 0.37], light, [0, 0, 1.02]);
      sphere(three, group, 0.3, [1.2, -0.62, 0.28], signal);
      const pin = new three.Mesh(new three.ConeGeometry(0.28, 0.62, 24), signalDark);
      pin.position.set(1.2, -1.02, 0.28);
      pin.rotation.z = Math.PI;
      group.add(pin);
      break;
    }
    case 'portal:estudio': {
      box(three, group, [2.8, 0.58, 1.16], [0, -0.34, 0], signalDark);
      box(three, group, [1.52, 0.62, 0.96], [0.18, 0.24, -0.02], high, [0, 0, -0.05]);
      box(three, group, [0.86, 0.05, 1.22], [0.82, -0.02, 0], light, [0, 0, -0.12]);
      for (const x of [-0.9, 0.9]) {
        for (const z of [-0.64, 0.64]) cylinder(three, group, 0.36, 0.24, [x, -0.7, z], metal, [Math.PI / 2, 0, 0]);
      }
      break;
    }
    case 'portal:control-servicios': {
      [-0.7, 0, 0.7].forEach((y, index) => {
        box(three, group, [2.45, 0.46, 0.32], [0, y, index * -0.16], index === 1 ? high : metal);
        box(three, group, [0.22, 0.22, 0.08], [-0.88, y, 0.22 - index * 0.16], index < 2 ? signal : signalDark);
        box(three, group, [0.92, 0.08, 0.06], [0.18, y, 0.23 - index * 0.16], ink);
      });
      break;
    }
    case 'portal:revision-vehiculos': {
      const wire = new three.MeshStandardMaterial({ color: palette.muted, wireframe: true, roughness: 0.4, metalness: 0.6 });
      box(three, group, [2.55, 0.64, 1.18], [0, -0.28, 0], wire);
      box(three, group, [1.35, 0.6, 0.94], [0.12, 0.3, 0], wire);
      box(three, group, [3.0, 0.05, 1.48], [0, 0.12, 0], light, [0, 0, 0.04]);
      for (const x of [-0.82, 0.82]) cylinder(three, group, 0.34, 1.4, [x, -0.62, 0], metal, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:inventario-ppf': {
      cylinder(three, group, 1.02, 1.72, [-0.25, 0, 0], high, [0, 0, Math.PI / 2], 36);
      cylinder(three, group, 0.42, 1.82, [-0.25, 0, 0], metal, [0, 0, Math.PI / 2], 36);
      torus(three, group, 1.02, 0.08, [-1.13, 0, 0], signal, [0, Math.PI / 2, 0]);
      box(three, group, [1.55, 0.06, 1.32], [1.0, -0.82, 0], signalDark, [0, 0, -0.1]);
      break;
    }
    case 'portal:ventas': {
      box(three, group, [1.58, 2.15, 0.16], [-0.38, 0.08, 0], ink, [0, -0.16, -0.06]);
      [0.58, 0.18, -0.22].forEach((y, index) => box(three, group, [0.9 - index * 0.13, 0.08, 0.06], [-0.42, y, 0.16], index === 0 ? signalDark : metal));
      for (let index = 0; index < 3; index += 1) cylinder(three, group, 0.38, 0.12, [0.82 + index * 0.25, -0.72 + index * 0.17, 0.26], index === 2 ? signal : high, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:finanzas': {
      [0.72, 1.18, 1.72, 2.25].forEach((height, index) => {
        box(three, group, [0.42, height, 0.48], [-1.05 + index * 0.7, -0.9 + height / 2, 0], index === 3 ? signal : high);
      });
      torus(three, group, 0.58, 0.13, [0.95, 0.8, 0.28], signalDark, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:cotizador-ppf': {
      [-0.44, 0, 0.44].forEach((y, index) => box(three, group, [2.45 - index * 0.18, 0.34, 1.2], [-0.2, y, -index * 0.12], index === 2 ? signal : high));
      box(three, group, [0.9, 0.9, 0.16], [1.12, -0.38, 0.58], ink, [0.08, -0.18, -0.08]);
      torus(three, group, 0.25, 0.06, [1.12, -0.38, 0.7], signalDark);
      break;
    }
    case 'portal:notificaciones': {
      const bell = new three.Mesh(new three.ConeGeometry(1.0, 1.7, 32, 1, true), signalDark);
      bell.position.y = 0.05;
      group.add(bell);
      torus(three, group, 0.98, 0.11, [0, -0.8, 0], signal);
      sphere(three, group, 0.2, [0, -1.05, 0], signal);
      sphere(three, group, 0.22, [0, 0.98, 0], high);
      torus(three, group, 1.42, 0.035, [0, 0, -0.35], ink, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:infraestructura-ha': {
      [-0.75, 0.75].forEach((x, rackIndex) => {
        box(three, group, [1.08, 2.65, 0.92], [x, 0, 0], metal);
        for (let index = 0; index < 5; index += 1) {
          box(three, group, [0.86, 0.26, 0.08], [x, 0.78 - index * 0.42, 0.51], high);
          box(three, group, [0.1, 0.05, 0.04], [x + 0.3, 0.78 - index * 0.42, 0.58], index === rackIndex ? signal : signalDark);
        }
      });
      connect(three, group, [-0.75, 1.55, 0], [0.75, 1.55, 0], signal, 0.055);
      break;
    }
    case '2free:web': {
      box(three, group, [2.8, 1.8, 0.18], [0, 0, 0], high, [0.08, -0.24, 0]);
      box(three, group, [2.52, 0.18, 0.06], [0, 0.68, 0.18], signalDark, [0.08, -0.24, 0]);
      [0.45, 0.8, 1.14].forEach((height, index) => box(three, group, [0.28, height, 0.08], [-0.78 + index * 0.48, -0.55 + height / 2, 0.3], index === 2 ? signal : ink));
      break;
    }
    case '2free:landing': {
      const core = new three.Mesh(new three.OctahedronGeometry(0.92, 0), signal);
      group.add(core);
      torus(three, group, 1.5, 0.055, [0, 0, 0], ink, [Math.PI / 2.8, 0.2, 0.35]);
      torus(three, group, 1.15, 0.07, [0, 0, 0], signalDark, [0.3, Math.PI / 2, 0]);
      sphere(three, group, 0.19, [1.2, 0.55, 0.2], high);
      break;
    }
    case '2free:desktop': {
      box(three, group, [2.55, 1.55, 0.16], [0, 0.34, 0], high, [-0.08, -0.2, 0]);
      box(three, group, [2.1, 1.12, 0.06], [0, 0.34, 0.13], signalDark, [-0.08, -0.2, 0]);
      box(three, group, [2.9, 0.14, 1.25], [0, -0.82, 0.35], metal, [0.15, -0.2, 0]);
      box(three, group, [0.72, 0.03, 0.42], [0, -0.72, 0.82], signal, [0.15, -0.2, 0]);
      break;
    }
    case '2free:mobile': {
      box(three, group, [1.25, 2.5, 0.28], [0, 0, 0], high, [0, -0.22, -0.04]);
      box(three, group, [1.02, 2.08, 0.06], [0, 0, 0.19], metal, [0, -0.22, -0.04]);
      box(three, group, [0.72, 0.45, 0.05], [0, 0.48, 0.27], signal, [0, -0.22, -0.04]);
      [-0.22, -0.52].forEach((y) => box(three, group, [0.68, 0.09, 0.04], [0, y, 0.27], ink, [0, -0.22, -0.04]));
      break;
    }
    case '2free:api': {
      const nodes: Position[] = [[0, 0.88, 0], [-1.25, -0.55, 0.2], [1.25, -0.55, 0.2], [0, -0.8, -0.85]];
      nodes.forEach((position, index) => sphere(three, group, index === 0 ? 0.42 : 0.32, position, index === 0 ? signal : high));
      nodes.slice(1).forEach((position) => connect(three, group, nodes[0], position, signalDark));
      break;
    }
    case '2free:arquitectura': {
      [-0.62, 0, 0.62].forEach((y, index) => cylinder(three, group, 1.18 - index * 0.12, 0.28, [0, y, 0], index === 2 ? signal : high, [0, 0, 0], 6));
      const core = new three.Mesh(new three.OctahedronGeometry(0.45, 0), ink);
      core.position.y = 1.08;
      group.add(core);
      break;
    }
    case 'pokedex:catalogo': {
      cylinder(three, group, 1.02, 0.16, [0.35, -0.1, -0.9], metal, [Math.PI / 2.6, 0, 0.2], 30);
      torus(three, group, 1.02, 0.06, [0.35, -0.1, -0.86], signalDark, [Math.PI / 2.6, 0, 0.2]);
      [-0.72, 0, 0.72].forEach((y, row) => {
        [-0.72, 0, 0.72].forEach((x, column) => {
          box(three, group, [0.58, 0.58, 0.1], [x - 0.25, y + 0.05, 0.45], row === 1 && column === 2 ? signal : high, [0, -0.2, 0]);
        });
      });
      break;
    }
    case 'pokedex:coleccion': {
      const shell = new three.MeshStandardMaterial({ color: palette.muted, wireframe: true, roughness: 0.4, metalness: 0.6 });
      box(three, group, [2.35, 2.05, 1.5], [0, 0, 0], shell);
      sphere(three, group, 0.32, [-0.55, 0.28, 0.12], high);
      sphere(three, group, 0.28, [0.3, -0.35, -0.1], high);
      sphere(three, group, 0.3, [0.62, 0.44, 0.25], signal);
      box(three, group, [2.55, 0.12, 0.12], [0, -1.16, 0.4], signal);
      break;
    }
    case 'pokedex:mcp': {
      cylinder(three, group, 1.0, 0.2, [0, -0.05, 0], high, [Math.PI / 2, 0, 0], 6);
      cylinder(three, group, 0.27, 0.5, [0, 0.18, 0], signal, [Math.PI / 2, 0, 0], 6);
      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * Math.PI * 2;
        const position: Position = [Math.cos(angle) * 1.42, 0, Math.sin(angle) * 1.42];
        box(three, group, [0.3, 0.3, 0.3], position, signalDark, [0, -angle, 0]);
        connect(three, group, [0, 0, 0], position, signal, 0.03);
      }
      break;
    }
    case 'pokedex:asistente': {
      box(three, group, [0.14, 2.0, 1.55], [0, 0, 0], high);
      torus(three, group, 0.42, 0.08, [0.05, -0.05, 0], signal, [0, Math.PI / 2, 0]);
      sphere(three, group, 0.36, [-1.45, 0.72, 0.15], ink);
      box(three, group, [0.52, 0.52, 0.52], [-1.45, -0.72, 0.15], metal, [0, 0.3, 0]);
      box(three, group, [0.6, 1.5, 0.6], [1.45, -0.05, 0], signalDark, [0, 0.28, 0]);
      connect(three, group, [-1.45, 0.72, 0.15], [1.45, 0.35, 0], signal, 0.035);
      connect(three, group, [-1.45, -0.72, 0.15], [1.45, -0.45, 0], signal, 0.035);
      break;
    }
    case 'pokedex:reconocimiento': {
      box(three, group, [1.3, 1.82, 0.09], [-0.62, -0.3, 0], ink, [0.06, -0.24, -0.16]);
      box(three, group, [0.92, 0.72, 0.05], [-0.66, 0.06, 0.09], signalDark, [0.06, -0.24, -0.16]);
      cylinder(three, group, 0.52, 0.05, [0.5, 0.3, 0.55], high, [Math.PI / 2.4, 0, 0.2], 30);
      torus(three, group, 0.52, 0.09, [0.5, 0.3, 0.55], signal, [Math.PI / 2.4, 0, 0.2]);
      box(three, group, [0.34, 0.11, 0.11], [0.62, -0.92, 0.5], signal, [0, 0, -0.9]);
      box(three, group, [0.66, 0.11, 0.11], [1.0, -0.72, 0.5], signal, [0, 0, 0.72]);
      break;
    }
    case 'pokedex:operacion': {
      [0, 1, 2].forEach((index) => {
        box(three, group, [1.05, 0.5, 0.95], [-0.85 + index * 0.62, -0.85 + index * 0.5, index * -0.18], index === 2 ? high : metal);
      });
      torus(three, group, 1.15, 0.07, [0.1, 0.28, 0.1], signal, [0.15, 0, 0.35]);
      box(three, group, [0.13, 0.13, 0.13], [1.24, 0.28, 0.1], signal);
      break;
    }
    case 'ferren-landing:catalogo': {
      box(three, group, [0.78, 0.78, 0.78], [-1.42, -0.1, 0], signal, [0, 0.32, 0]);
      [0, 1, 2, 3, 4, 5].forEach((index) => {
        box(three, group, [1.5, 0.08, 0.98], [0.42, -0.95 + index * 0.38, 0], index === 5 ? signalDark : high, [0, 0, -0.16 + index * 0.045]);
      });
      connect(three, group, [-1.42, -0.1, 0], [0.42, -0.95, 0], signalDark, 0.032);
      connect(three, group, [-1.42, -0.1, 0], [0.42, 0.95, 0], signalDark, 0.032);
      break;
    }
    case 'ferren-landing:precios': {
      cylinder(three, group, 0.16, 1.5, [0, -0.75, 0], metal, [0, 0, 0], 18);
      box(three, group, [2.85, 0.13, 0.32], [0, 0.08, 0], high, [0, 0, 0.13]);
      box(three, group, [0.95, 0.09, 0.72], [-1.28, -0.28, 0], signal);
      connect(three, group, [-1.28, -0.1, 0], [-1.28, -0.24, 0], signalDark, 0.03);
      torus(three, group, 0.42, 0.08, [1.28, 0.05, 0], signalDark, [Math.PI / 2, 0, 0]);
      connect(three, group, [1.28, 0.27, 0], [1.28, 0.05, 0], signalDark, 0.03);
      break;
    }
    case 'ferren-landing:conversion': {
      box(three, group, [2.05, 1.25, 0.18], [-0.35, 0.32, 0], high, [0, -0.18, 0]);
      box(three, group, [0.42, 0.42, 0.18], [-1.02, -0.42, 0.05], high, [0, -0.18, 0.78]);
      box(three, group, [1.25, 0.11, 0.06], [-0.5, 0.55, 0.12], ink, [0, -0.18, 0]);
      box(three, group, [0.78, 0.11, 0.06], [-0.72, 0.2, 0.12], signal, [0, -0.18, 0]);
      connect(three, group, [0.72, 0.05, 0.1], [1.62, -0.5, 0.1], signal, 0.04);
      const head = new three.Mesh(new three.ConeGeometry(0.19, 0.42, 20), signal);
      head.position.set(1.72, -0.56, 0.1);
      head.rotation.z = -2.1;
      group.add(head);
      break;
    }
    case 'ferren-landing:navegacion': {
      box(three, group, [1.7, 1.95, 0.1], [0.95, -0.16, -0.62], metal, [0, -0.34, 0.05]);
      box(three, group, [1.7, 1.95, 0.1], [0.2, 0.02, -0.1], high, [0, -0.3, 0.02]);
      box(three, group, [1.55, 1.0, 0.14], [-0.68, 0.2, 0.62], signal, [0, -0.26, 0]);
      const play = new three.Mesh(new three.ConeGeometry(0.22, 0.36, 3), signalDark);
      play.position.set(-0.68, 0.2, 0.74);
      play.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
      group.add(play);
      break;
    }
    default:
      box(three, group, [1.8, 1.8, 1.8], [0, 0, 0], high, [0.2, 0.3, 0]);
  }

  scene.add(new three.AmbientLight(0xeaf3e8, 2.2));
  const keyLight = new three.DirectionalLight(palette.signal, 4.2);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);
  const fillLight = new three.DirectionalLight(palette.ink, 1.4);
  fillLight.position.set(-4, 1, 3);
  scene.add(fillLight);

  return { host, canvas, context, scene, camera, group, phase };
}

function disposeScene(three: ThreeApi, scene: Scene) {
  const geometries = new Set<{ dispose: () => void }>();
  const materials = new Set<Material>();
  scene.traverse((object) => {
    if (!(object instanceof three.Mesh)) return;
    geometries.add(object.geometry);
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

/**
 * Builds every artifact on the page and returns its teardown, or `null` when
 * WebGL is unavailable. One renderer serves all hosts and blits into their 2D
 * canvases, so a page costs a single WebGL context rather than one per module.
 */
async function createArtifacts(hosts: HTMLElement[]): Promise<(() => void) | null> {
  // Destructured rather than kept as a namespace object: Rollup can only
  // tree-shake three.js when the named exports it needs are statically visible.
  const {
    AmbientLight, BoxGeometry, ConeGeometry, CylinderGeometry, DirectionalLight,
    Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, OctahedronGeometry,
    PerspectiveCamera, Scene, SphereGeometry, TorusGeometry, Vector3, WebGLRenderer,
  } = await import('three');
  const three: ThreeApi = {
    AmbientLight, BoxGeometry, ConeGeometry, CylinderGeometry, DirectionalLight,
    Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, OctahedronGeometry,
    PerspectiveCamera, Scene, SphereGeometry, TorusGeometry, Vector3,
  };

  let renderer: InstanceType<typeof WebGLRenderer>;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  const pixelRatio = Math.min(window.devicePixelRatio, 1.35);
  const scenes = hosts.flatMap((host, index) => {
    const canvas = host.querySelector<HTMLCanvasElement>('[data-module-artifact-canvas]');
    const context = canvas?.getContext('2d');
    const key = host.dataset.moduleArtifact;
    return canvas && context && key ? [makeScene(three, host, canvas, context, key, index * 0.73)] : [];
  });
  if (scenes.length === 0) {
    renderer.dispose();
    renderer.forceContextLoss();
    return null;
  }

  const visibleScenes = new Set<ArtifactScene>();
  let active = true;
  let frameId = 0;
  let running = false;

  const paint = (artifact: ArtifactScene, time: number) => {
    const { width: cssWidth, height: cssHeight } = artifact.host.getBoundingClientRect();
    const width = Math.max(2, Math.round(cssWidth * pixelRatio));
    const height = Math.max(2, Math.round(cssHeight * pixelRatio));
    if (artifact.canvas.width !== width || artifact.canvas.height !== height) {
      artifact.canvas.width = width;
      artifact.canvas.height = height;
    }
    renderer.setSize(width, height, false);
    artifact.camera.aspect = width / height;
    artifact.camera.updateProjectionMatrix();
    artifact.group.rotation.y = -0.36 + Math.sin(time * 0.00042 + artifact.phase) * 0.16;
    artifact.group.position.y = Math.sin(time * 0.00055 + artifact.phase) * 0.045;
    renderer.clear();
    renderer.render(artifact.scene, artifact.camera);
    artifact.context.globalCompositeOperation = 'copy';
    artifact.context.drawImage(renderer.domElement, 0, 0, width, height);
    artifact.canvas.dataset.threeReady = 'true';
    artifact.host.classList.add('is-three-ready');
  };

  const render = (time: number) => {
    if (!active || document.hidden || visibleScenes.size === 0) {
      running = false;
      return;
    }
    visibleScenes.forEach((artifact) => paint(artifact, time));
    frameId = requestAnimationFrame(render);
  };

  const ensureLoop = () => {
    if (running || !active || document.hidden || visibleScenes.size === 0) return;
    running = true;
    frameId = requestAnimationFrame(render);
  };

  scenes.forEach((artifact) => paint(artifact, 0));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const artifact = scenes.find((candidate) => candidate.host === entry.target);
      if (!artifact) return;
      if (entry.isIntersecting) visibleScenes.add(artifact);
      else visibleScenes.delete(artifact);
    });
    ensureLoop();
  }, { rootMargin: '120px 0px' });
  scenes.forEach((artifact) => observer.observe(artifact.host));
  const handleVisibility = () => ensureLoop();
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    active = false;
    cancelAnimationFrame(frameId);
    observer.disconnect();
    document.removeEventListener('visibilitychange', handleVisibility);
    scenes.forEach((artifact) => {
      artifact.host.classList.remove('is-three-ready');
      delete artifact.canvas.dataset.threeReady;
      artifact.context.clearRect(0, 0, artifact.canvas.width, artifact.canvas.height);
      disposeScene(three, artifact.scene);
    });
    renderer.dispose();
    // Browsers cap a document at roughly 16 live WebGL contexts. Astro view
    // transitions reuse the document across navigations, so releasing the
    // context here is what stops project routes from exhausting that budget.
    renderer.forceContextLoss();
  };
}

export function initializeModuleArtifacts() {
  window.__moduleArtifactsCleanup?.();
  const hosts = [...document.querySelectorAll<HTMLElement>('[data-module-artifact]')];
  if (hosts.length === 0) return;

  // The CSS fallback in ModuleArtifact.astro is a designed isometric stack, not
  // a placeholder, so reduced motion keeps it and skips WebGL entirely — the
  // same contract HomeBento uses for the server-rack scene.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let cancelled = false;
  let started = false;
  let teardown: (() => void) | null = null;
  let gate: IntersectionObserver | undefined;
  let idleHandle = 0;

  const supportsIdle = typeof window.requestIdleCallback === 'function';
  const cancelIdle = () => {
    if (!idleHandle) return;
    if (supportsIdle) window.cancelIdleCallback(idleHandle);
    else window.clearTimeout(idleHandle);
    idleHandle = 0;
  };

  const start = () => {
    if (started || cancelled) return;
    started = true;
    cancelIdle();
    gate?.disconnect();
    void createArtifacts(hosts)
      .then((cleanup) => {
        if (!cleanup) return;
        // The navigation may have completed while `three` was still in flight;
        // tear the renderer down immediately rather than stranding a context.
        if (cancelled) cleanup();
        else teardown = cleanup;
      })
      .catch(() => {});
  };

  // The first artifact sits ~1300px below the fold on desktop and ~1800px on
  // mobile, so the viewport gate alone would leave them blank for a reader who
  // never scrolls — and `scripts/audit-site.mjs:16` asserts every artifact is
  // ready without scrolling. Idle time is the floor and the viewport is the
  // accelerator: either way three.js stays out of the blocking module graph.
  if ('IntersectionObserver' in window) {
    gate = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) start();
    }, { rootMargin: '600px 0px' });
    hosts.forEach((host) => gate?.observe(host));
  }
  idleHandle = supportsIdle
    ? window.requestIdleCallback(start, { timeout: 2000 })
    : window.setTimeout(start, 1200);

  const cleanup = () => {
    cancelled = true;
    cancelIdle();
    gate?.disconnect();
    teardown?.();
    teardown = null;
    if (window.__moduleArtifactsCleanup === cleanup) delete window.__moduleArtifactsCleanup;
  };
  window.__moduleArtifactsCleanup = cleanup;
}

document.addEventListener('astro:page-load', initializeModuleArtifacts);
document.addEventListener('astro:before-swap', () => window.__moduleArtifactsCleanup?.());
