import {
  AmbientLight,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';

declare global {
  interface Window {
    __moduleArtifactsCleanup?: () => void;
  }
}

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

function box(group: Group, size: Position, position: Position, material: Material, rotation: Rotation = [0, 0, 0]) {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function cylinder(group: Group, radius: number, depth: number, position: Position, material: Material, rotation: Rotation = [0, 0, 0], segments = 28) {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, depth, segments), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function torus(group: Group, radius: number, tube: number, position: Position, material: Material, rotation: Rotation = [0, 0, 0]) {
  const mesh = new Mesh(new TorusGeometry(radius, tube, 12, 36), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function sphere(group: Group, radius: number, position: Position, material: Material) {
  const mesh = new Mesh(new SphereGeometry(radius, 24, 16), material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function connect(group: Group, start: Position, end: Position, material: Material, radius = 0.045) {
  const from = new Vector3(...start);
  const to = new Vector3(...end);
  const direction = to.clone().sub(from);
  const mesh = new Mesh(new CylinderGeometry(radius, radius, direction.length(), 10), material);
  mesh.position.copy(from.clone().add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize());
  group.add(mesh);
  return mesh;
}

function makeScene(host: HTMLElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, key: string, phase: number): ArtifactScene {
  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(4.1, 2.7, 6.4);
  camera.lookAt(0, 0, 0);
  const group = new Group();
  group.rotation.set(-0.08, -0.36, 0.02);
  scene.add(group);

  const metal = new MeshStandardMaterial({ color: palette.panel, roughness: 0.38, metalness: 0.72 });
  const high = new MeshStandardMaterial({ color: palette.panelHigh, roughness: 0.32, metalness: 0.64 });
  const signal = new MeshStandardMaterial({ color: palette.signal, roughness: 0.28, metalness: 0.2 });
  const signalDark = new MeshStandardMaterial({ color: palette.signalDark, roughness: 0.45, metalness: 0.28 });
  const ink = new MeshStandardMaterial({ color: palette.ink, roughness: 0.5, metalness: 0.1 });
  const light = new MeshBasicMaterial({ color: palette.signal });

  switch (key) {
    case 'portal:asistencia': {
      cylinder(group, 1.12, 0.3, [-0.25, 0.05, 0], high, [Math.PI / 2, 0, 0]);
      torus(group, 1.12, 0.09, [-0.25, 0.05, 0.17], signal, [0, 0, 0]);
      box(group, [0.08, 0.72, 0.08], [-0.25, 0.34, 0.35], ink, [0, 0, -0.38]);
      box(group, [0.08, 0.5, 0.08], [-0.08, -0.1, 0.37], light, [0, 0, 1.02]);
      sphere(group, 0.3, [1.2, -0.62, 0.28], signal);
      const pin = new Mesh(new ConeGeometry(0.28, 0.62, 24), signalDark);
      pin.position.set(1.2, -1.02, 0.28);
      pin.rotation.z = Math.PI;
      group.add(pin);
      break;
    }
    case 'portal:estudio': {
      box(group, [2.8, 0.58, 1.16], [0, -0.34, 0], signalDark);
      box(group, [1.52, 0.62, 0.96], [0.18, 0.24, -0.02], high, [0, 0, -0.05]);
      box(group, [0.86, 0.05, 1.22], [0.82, -0.02, 0], light, [0, 0, -0.12]);
      for (const x of [-0.9, 0.9]) {
        for (const z of [-0.64, 0.64]) cylinder(group, 0.36, 0.24, [x, -0.7, z], metal, [Math.PI / 2, 0, 0]);
      }
      break;
    }
    case 'portal:control-servicios': {
      [-0.7, 0, 0.7].forEach((y, index) => {
        box(group, [2.45, 0.46, 0.32], [0, y, index * -0.16], index === 1 ? high : metal);
        box(group, [0.22, 0.22, 0.08], [-0.88, y, 0.22 - index * 0.16], index < 2 ? signal : signalDark);
        box(group, [0.92, 0.08, 0.06], [0.18, y, 0.23 - index * 0.16], ink);
      });
      break;
    }
    case 'portal:revision-vehiculos': {
      const wire = new MeshStandardMaterial({ color: palette.muted, wireframe: true, roughness: 0.4, metalness: 0.6 });
      box(group, [2.55, 0.64, 1.18], [0, -0.28, 0], wire);
      box(group, [1.35, 0.6, 0.94], [0.12, 0.3, 0], wire);
      box(group, [3.0, 0.05, 1.48], [0, 0.12, 0], light, [0, 0, 0.04]);
      for (const x of [-0.82, 0.82]) cylinder(group, 0.34, 1.4, [x, -0.62, 0], metal, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:inventario-ppf': {
      cylinder(group, 1.02, 1.72, [-0.25, 0, 0], high, [0, 0, Math.PI / 2], 36);
      cylinder(group, 0.42, 1.82, [-0.25, 0, 0], metal, [0, 0, Math.PI / 2], 36);
      torus(group, 1.02, 0.08, [-1.13, 0, 0], signal, [0, Math.PI / 2, 0]);
      box(group, [1.55, 0.06, 1.32], [1.0, -0.82, 0], signalDark, [0, 0, -0.1]);
      break;
    }
    case 'portal:ventas': {
      box(group, [1.58, 2.15, 0.16], [-0.38, 0.08, 0], ink, [0, -0.16, -0.06]);
      [0.58, 0.18, -0.22].forEach((y, index) => box(group, [0.9 - index * 0.13, 0.08, 0.06], [-0.42, y, 0.16], index === 0 ? signalDark : metal));
      for (let index = 0; index < 3; index += 1) cylinder(group, 0.38, 0.12, [0.82 + index * 0.25, -0.72 + index * 0.17, 0.26], index === 2 ? signal : high, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:finanzas': {
      [0.72, 1.18, 1.72, 2.25].forEach((height, index) => {
        box(group, [0.42, height, 0.48], [-1.05 + index * 0.7, -0.9 + height / 2, 0], index === 3 ? signal : high);
      });
      torus(group, 0.58, 0.13, [0.95, 0.8, 0.28], signalDark, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:cotizador-ppf': {
      [-0.44, 0, 0.44].forEach((y, index) => box(group, [2.45 - index * 0.18, 0.34, 1.2], [-0.2, y, -index * 0.12], index === 2 ? signal : high));
      box(group, [0.9, 0.9, 0.16], [1.12, -0.38, 0.58], ink, [0.08, -0.18, -0.08]);
      torus(group, 0.25, 0.06, [1.12, -0.38, 0.7], signalDark);
      break;
    }
    case 'portal:notificaciones': {
      const bell = new Mesh(new ConeGeometry(1.0, 1.7, 32, 1, true), signalDark);
      bell.position.y = 0.05;
      group.add(bell);
      torus(group, 0.98, 0.11, [0, -0.8, 0], signal);
      sphere(group, 0.2, [0, -1.05, 0], signal);
      sphere(group, 0.22, [0, 0.98, 0], high);
      torus(group, 1.42, 0.035, [0, 0, -0.35], ink, [Math.PI / 2, 0, 0]);
      break;
    }
    case 'portal:infraestructura-ha': {
      [-0.75, 0.75].forEach((x, rackIndex) => {
        box(group, [1.08, 2.65, 0.92], [x, 0, 0], metal);
        for (let index = 0; index < 5; index += 1) {
          box(group, [0.86, 0.26, 0.08], [x, 0.78 - index * 0.42, 0.51], high);
          box(group, [0.1, 0.05, 0.04], [x + 0.3, 0.78 - index * 0.42, 0.58], index === rackIndex ? signal : signalDark);
        }
      });
      connect(group, [-0.75, 1.55, 0], [0.75, 1.55, 0], signal, 0.055);
      break;
    }
    case '2free:web': {
      box(group, [2.8, 1.8, 0.18], [0, 0, 0], high, [0.08, -0.24, 0]);
      box(group, [2.52, 0.18, 0.06], [0, 0.68, 0.18], signalDark, [0.08, -0.24, 0]);
      [0.45, 0.8, 1.14].forEach((height, index) => box(group, [0.28, height, 0.08], [-0.78 + index * 0.48, -0.55 + height / 2, 0.3], index === 2 ? signal : ink));
      break;
    }
    case '2free:landing': {
      const core = new Mesh(new OctahedronGeometry(0.92, 0), signal);
      group.add(core);
      torus(group, 1.5, 0.055, [0, 0, 0], ink, [Math.PI / 2.8, 0.2, 0.35]);
      torus(group, 1.15, 0.07, [0, 0, 0], signalDark, [0.3, Math.PI / 2, 0]);
      sphere(group, 0.19, [1.2, 0.55, 0.2], high);
      break;
    }
    case '2free:desktop': {
      box(group, [2.55, 1.55, 0.16], [0, 0.34, 0], high, [-0.08, -0.2, 0]);
      box(group, [2.1, 1.12, 0.06], [0, 0.34, 0.13], signalDark, [-0.08, -0.2, 0]);
      box(group, [2.9, 0.14, 1.25], [0, -0.82, 0.35], metal, [0.15, -0.2, 0]);
      box(group, [0.72, 0.03, 0.42], [0, -0.72, 0.82], signal, [0.15, -0.2, 0]);
      break;
    }
    case '2free:mobile': {
      box(group, [1.25, 2.5, 0.28], [0, 0, 0], high, [0, -0.22, -0.04]);
      box(group, [1.02, 2.08, 0.06], [0, 0, 0.19], metal, [0, -0.22, -0.04]);
      box(group, [0.72, 0.45, 0.05], [0, 0.48, 0.27], signal, [0, -0.22, -0.04]);
      [-0.22, -0.52].forEach((y) => box(group, [0.68, 0.09, 0.04], [0, y, 0.27], ink, [0, -0.22, -0.04]));
      break;
    }
    case '2free:api': {
      const nodes: Position[] = [[0, 0.88, 0], [-1.25, -0.55, 0.2], [1.25, -0.55, 0.2], [0, -0.8, -0.85]];
      nodes.forEach((position, index) => sphere(group, index === 0 ? 0.42 : 0.32, position, index === 0 ? signal : high));
      nodes.slice(1).forEach((position) => connect(group, nodes[0], position, signalDark));
      break;
    }
    case '2free:arquitectura': {
      [-0.62, 0, 0.62].forEach((y, index) => cylinder(group, 1.18 - index * 0.12, 0.28, [0, y, 0], index === 2 ? signal : high, [0, 0, 0], 6));
      const core = new Mesh(new OctahedronGeometry(0.45, 0), ink);
      core.position.y = 1.08;
      group.add(core);
      break;
    }
    default:
      box(group, [1.8, 1.8, 1.8], [0, 0, 0], high, [0.2, 0.3, 0]);
  }

  scene.add(new AmbientLight(0xeaf3e8, 2.2));
  const keyLight = new DirectionalLight(palette.signal, 4.2);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);
  const fillLight = new DirectionalLight(palette.ink, 1.4);
  fillLight.position.set(-4, 1, 3);
  scene.add(fillLight);

  return { host, canvas, context, scene, camera, group, phase };
}

function disposeScene(scene: Scene) {
  const geometries = new Set<BoxGeometry>();
  const materials = new Set<Material>();
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry as BoxGeometry);
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

export function initializeModuleArtifacts() {
  window.__moduleArtifactsCleanup?.();
  const hosts = [...document.querySelectorAll<HTMLElement>('[data-module-artifact]')];
  if (hosts.length === 0) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  } catch {
    return;
  }
  renderer.setClearColor(0x000000, 0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pixelRatio = Math.min(window.devicePixelRatio, 1.35);
  const scenes = hosts.flatMap((host, index) => {
    const canvas = host.querySelector<HTMLCanvasElement>('[data-module-artifact-canvas]');
    const context = canvas?.getContext('2d');
    const key = host.dataset.moduleArtifact;
    return canvas && context && key ? [makeScene(host, canvas, context, key, index * 0.73)] : [];
  });
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
    if (!reducedMotion) {
      artifact.group.rotation.y = -0.36 + Math.sin(time * 0.00042 + artifact.phase) * 0.16;
      artifact.group.position.y = Math.sin(time * 0.00055 + artifact.phase) * 0.045;
    }
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
    if (reducedMotion || running || !active || document.hidden || visibleScenes.size === 0) return;
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

  const cleanup = () => {
    active = false;
    cancelAnimationFrame(frameId);
    observer.disconnect();
    document.removeEventListener('visibilitychange', handleVisibility);
    scenes.forEach((artifact) => {
      artifact.host.classList.remove('is-three-ready');
      delete artifact.canvas.dataset.threeReady;
      artifact.context.clearRect(0, 0, artifact.canvas.width, artifact.canvas.height);
      disposeScene(artifact.scene);
    });
    renderer.dispose();
    renderer.forceContextLoss();
    if (window.__moduleArtifactsCleanup === cleanup) delete window.__moduleArtifactsCleanup;
  };
  window.__moduleArtifactsCleanup = cleanup;
}

document.addEventListener('astro:page-load', initializeModuleArtifacts);
document.addEventListener('astro:before-swap', () => window.__moduleArtifactsCleanup?.());
