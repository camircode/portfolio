import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const portalDemos = [
  { slug: 'asistencia', title: 'Asistencia' },
  { slug: 'estudio', title: 'Operación de estudio' },
  { slug: 'control-servicios', title: 'Control de servicios' },
  { slug: 'revision-vehiculos', title: 'Revisión vehicular' },
  { slug: 'inventario-ppf', title: 'Inventario PPF' },
  { slug: 'ventas', title: 'Ventas' },
  { slug: 'finanzas', title: 'Finanzas' },
  { slug: 'cotizador-ppf', title: 'Cotizador PPF' },
  { slug: 'notificaciones', title: 'Notificaciones' },
  { slug: 'infraestructura-ha', title: 'Infraestructura HA' },
] as const;

type DemoDefinition = (typeof portalDemos)[number];
type DemoSlug = DemoDefinition['slug'];

const colors = {
  canvas: '#e9ebef',
  background: '#f7f7f8',
  surface: '#ffffff',
  surfaceMuted: '#f1f2f4',
  border: '#dfe2e7',
  borderStrong: '#c8ccd3',
  text: '#17191c',
  muted: '#69707c',
  red: '#d02027',
  redDark: '#a9161b',
  black: '#16181b',
  green: '#168744',
  greenSoft: '#e9f8ef',
  blue: '#2563eb',
  blueSoft: '#eaf1ff',
  amber: '#b7791f',
  amberSoft: '#fff7df',
  purple: '#7c3aed',
} as const;

const panel: CSSProperties = {
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  background: colors.surface,
  boxShadow: '0 8px 24px rgba(20, 24, 32, 0.06)',
};

const Panel = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ ...panel, ...style }}>{children}</div>
);

const Badge = ({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'red' | 'green' | 'blue' | 'amber' | 'purple' }) => {
  const tones = {
    neutral: { background: colors.surfaceMuted, color: colors.muted },
    red: { background: '#fdebec', color: colors.redDark },
    green: { background: colors.greenSoft, color: colors.green },
    blue: { background: colors.blueSoft, color: colors.blue },
    amber: { background: colors.amberSoft, color: colors.amber },
    purple: { background: '#f2ebff', color: colors.purple },
  } as const;
  return <span style={{ ...tones[tone], display: 'inline-flex', alignItems: 'center', minHeight: 25, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{children}</span>;
};

const Button = ({ children, tone = 'black', active = false, style }: { children: ReactNode; tone?: 'black' | 'red' | 'green' | 'blue' | 'outline'; active?: boolean; style?: CSSProperties }) => {
  const tones = {
    black: { background: colors.black, color: '#fff', border: `1px solid ${colors.black}` },
    red: { background: colors.red, color: '#fff', border: `1px solid ${colors.red}` },
    green: { background: colors.green, color: '#fff', border: `1px solid ${colors.green}` },
    blue: { background: colors.blue, color: '#fff', border: `1px solid ${colors.blue}` },
    outline: { background: colors.surface, color: colors.text, border: `1px solid ${colors.borderStrong}` },
  } as const;
  return (
    <div style={{ ...tones[tone], display: 'inline-flex', minHeight: 38, alignItems: 'center', justifyContent: 'center', padding: '8px 15px', borderRadius: 9, fontSize: 13, fontWeight: 700, boxShadow: active ? '0 0 0 4px rgba(208, 32, 39, 0.18)' : 'none', transform: active ? 'scale(0.97)' : 'scale(1)', ...style }}>
      {children}
    </div>
  );
};

const Field = ({ label, value, placeholder, tone = 'default', style }: { label: string; value?: string; placeholder?: string; tone?: 'default' | 'selected'; style?: CSSProperties }) => (
  <div style={{ minWidth: 0, ...style }}>
    <div style={{ marginBottom: 5, color: colors.muted, fontSize: 11, fontWeight: 700 }}>{label}</div>
    <div style={{ display: 'flex', minHeight: 38, alignItems: 'center', overflow: 'hidden', padding: '0 11px', border: `1px solid ${tone === 'selected' ? colors.red : colors.borderStrong}`, borderRadius: 8, background: colors.surface, color: value ? colors.text : colors.muted, fontSize: 13, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      {value ?? placeholder ?? ''}
    </div>
  </div>
);

const PageHeader = ({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 16 }}>
    <div>
      <h1 style={{ margin: 0, color: colors.text, fontSize: 25, lineHeight: 1.08 }}>{title}</h1>
      <p style={{ margin: '5px 0 0', color: colors.muted, fontSize: 13 }}>{subtitle}</p>
    </div>
    {action}
  </div>
);

const Metric = ({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'green' | 'red' | 'blue' | 'black' }) => {
  const backgrounds = { neutral: colors.surface, green: colors.green, red: colors.red, blue: colors.blue, black: colors.black } as const;
  const inverse = tone !== 'neutral';
  return (
    <Panel style={{ flex: 1, minWidth: 0, padding: 14, background: backgrounds[tone], color: inverse ? '#fff' : colors.text }}>
      <div style={{ color: inverse ? 'rgba(255,255,255,.72)' : colors.muted, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
      <strong style={{ display: 'block', marginTop: 6, fontSize: 23, lineHeight: 1 }}>{value}</strong>
    </Panel>
  );
};

const Toast = ({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'blue' | 'black' }) => {
  const backgrounds = { green: colors.green, blue: colors.blue, black: colors.black } as const;
  return <div style={{ position: 'absolute', right: 28, bottom: 62, zIndex: 12, padding: '11px 16px', borderRadius: 10, background: backgrounds[tone], color: '#fff', boxShadow: '0 12px 30px rgba(0,0,0,.2)', fontSize: 13, fontWeight: 700 }}>{children}</div>;
};

const Cursor = ({ frame, x, y, clickAt = 48 }: { frame: number; x: number; y: number; clickAt?: number }) => {
  const distance = Math.abs(frame - clickAt);
  const click = interpolate(distance, [0, 7], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 30, pointerEvents: 'none', transform: `translate(-4px, -4px) scale(${1 - click * 0.12})` }}>
      <div style={{ position: 'absolute', left: -13, top: -13, width: 40, height: 40, border: `3px solid rgba(208,32,39,${click * 0.75})`, borderRadius: '50%', transform: `scale(${0.55 + click * 0.65})` }} />
      <svg width="28" height="34" viewBox="0 0 28 34" aria-hidden="true">
        <path d="M3 2L24 20H14L19 31L13 33L8 22L2 28Z" fill="#17191c" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Scene = ({ children, localFrame }: { children: ReactNode; localFrame: number }) => {
  const enter = interpolate(localFrame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ height: '100%', opacity: enter, transform: `translateY(${(1 - enter) * 10}px)` }}>{children}</div>;
};

const PortalFrame = ({ children, module, frame }: { children: ReactNode; module: string; frame: number }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const mount = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const fade = interpolate(frame, [0, 8, durationInFrames - 10, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#111315', color: colors.text, fontFamily: 'Arial, Helvetica, sans-serif', opacity: fade }}>
      <div style={{ position: 'absolute', inset: 15, overflow: 'hidden', borderRadius: 22, background: colors.background, boxShadow: '0 25px 70px rgba(0,0,0,.45)', opacity: mount, transform: `scale(${0.985 + mount * 0.015})` }}>
        <header style={{ position: 'absolute', inset: '0 0 auto', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: `1px solid ${colors.border}`, background: 'rgba(255,255,255,.96)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <strong style={{ color: colors.red, fontSize: 20, letterSpacing: '-0.03em' }}>FER&REN</strong>
            <span style={{ width: 1, height: 24, background: colors.border }} />
            <span style={{ color: colors.muted, fontSize: 13, fontWeight: 700 }}>{module}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge tone="red">DATOS FICTICIOS</Badge>
            <div style={{ display: 'grid', width: 32, height: 32, placeItems: 'center', borderRadius: '50%', background: colors.red, color: '#fff', fontSize: 12, fontWeight: 800 }}>DM</div>
          </div>
        </header>
        <main style={{ position: 'absolute', inset: '78px 24px 62px', overflow: 'hidden' }}>{children}</main>
        <nav style={{ position: 'absolute', inset: 'auto 0 0', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 42, borderTop: `1px solid ${colors.border}`, background: colors.surface, color: colors.muted, fontSize: 11, fontWeight: 700 }}>
          <span>Inicio</span><span style={{ color: colors.red }}>{module}</span><span>Cuenta</span>
        </nav>
      </div>
    </AbsoluteFill>
  );
};

const AttendanceDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  const registered = phase === 2;
  return (
    <PortalFrame module="Asistencia" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="Asistencia" subtitle="Registro de jornada con validación de horario y GPS" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 430px', gap: 18, height: 420 }}>
          <Panel style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 17, borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ display: 'grid', width: 48, height: 48, placeItems: 'center', borderRadius: '50%', background: colors.red, color: '#fff', fontWeight: 800 }}>DM</div>
              <div><strong style={{ fontSize: 16 }}>Daniela Morales</strong><div style={{ marginTop: 4, color: colors.muted, fontSize: 13 }}>Entrada: 08:00 · Salida: 17:00</div></div>
            </div>
            <div style={{ marginTop: 18, color: colors.muted, fontSize: 12, fontWeight: 700 }}>REGISTROS DE HOY</div>
            {registered ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 13, padding: 14, borderRadius: 10, background: colors.greenSoft, color: colors.green, fontSize: 14, fontWeight: 700 }}><span>✓</span> Entrada: 08:02 · Ubicación válida</div>
            ) : (
              <div style={{ marginTop: 13, padding: 18, border: `2px dashed ${colors.borderStrong}`, borderRadius: 12, color: colors.muted, fontSize: 13 }}>Aún no hay eventos registrados hoy.</div>
            )}
            <div style={{ marginTop: 18, color: colors.muted, fontSize: 12 }}>⌖ Toca para registrar con GPS</div>
          </Panel>
          <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
            {phase === 1 && <Panel style={{ padding: 16, borderColor: '#9fc5ff', background: colors.blueSoft }}><strong style={{ color: colors.blue }}>Validando ubicación GPS</strong><div style={{ height: 5, marginTop: 12, overflow: 'hidden', borderRadius: 5, background: '#cbdcff' }}><div style={{ width: `${interpolate(local, [0, 52], [15, 100], { extrapolateRight: 'clamp' })}%`, height: '100%', background: colors.blue }} /></div><p style={{ margin: '9px 0 0', color: colors.muted, fontSize: 12 }}>Comprobando zona permitida y horario asignado.</p></Panel>}
            <Button tone={registered ? 'green' : 'red'} active={phase === 0 && local > 42} style={{ minHeight: 58 }}>{registered ? '✓ Entrada registrada' : phase === 1 ? 'Registrando entrada...' : 'Registrar Entrada'}</Button>
            <Button tone="outline" style={{ minHeight: 58, opacity: registered ? 1 : 0.45 }}>Salida a Comer</Button>
            <Button tone="outline" style={{ minHeight: 58, opacity: 0.45 }}>Regreso de Comida</Button>
            <Button tone="red" style={{ minHeight: 58, opacity: 0.45 }}>Registrar Salida</Button>
          </div>
        </div>
      </Scene>
      {registered && <Toast>Entrada registrada con ubicación válida</Toast>}
      {phase === 0 && <Cursor frame={local} x={1065} y={202} />}
    </PortalFrame>
  );
};

const StudioDemo = ({ frame }: { frame: number }) => {
  const labels = ['Cliente', 'Vehículo', 'Recepción', 'Servicios', 'Apartado', 'Resumen'];
  const step = Math.min(5, Math.floor(frame / 36));
  const local = frame - step * 36;
  const success = step === 5 && local > 21;
  const screens: ReactNode[] = [
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><Field label="Fecha de ingreso *" value="29/07/2026" /><Field label="Nombre *" value="Cliente demostración" /><Field label="Teléfono *" value="55 0000 0000" /><Field label="Correo electrónico" value="demo@ejemplo.com" /></div>,
    <div><div style={{ display: 'flex', gap: 12, marginBottom: 15 }}><Badge tone="red">● Nuevo vehículo</Badge><Badge>Buscar existente</Badge></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}><Field label="Marca *" value="Marca demo" /><Field label="Submarca *" value="Sedán" /><Field label="Modelo *" value="2026" /><Field label="Año *" value="2026" /><Field label="Color *" value="Grafito" /><Field label="Tipo *" value="Sedán" /></div></div>,
    <div style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 16 }}><div><Field label="Kilometraje" value="12,480 km" /><Panel style={{ marginTop: 12, padding: 16, background: colors.surfaceMuted }}><div style={{ color: colors.muted, fontSize: 11, fontWeight: 700 }}>NIVEL DE GASOLINA</div><strong style={{ display: 'block', marginTop: 10, fontSize: 27 }}>1/2 · 50%</strong><div style={{ height: 7, marginTop: 13, borderRadius: 7, background: '#d7d9dd' }}><div style={{ width: '50%', height: '100%', borderRadius: 7, background: colors.red }} /></div></Panel></div><div style={{ display: 'grid', gap: 12 }}><Panel style={{ padding: 16 }}><strong>Observaciones del vehículo</strong><p style={{ color: colors.muted, fontSize: 12 }}>Rayón superficial en defensa trasera.</p><Button tone="black">+ Observación</Button></Panel><Panel style={{ padding: 16 }}><strong>Inventario dentro del auto</strong><p style={{ color: colors.muted, fontSize: 12 }}>Cargador USB · Tapetes · Llave secundaria</p></Panel></div></div>,
    <div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}><Field label="Tipo de servicio" value="PPF" /><Field label="Servicio *" value="Full Front" /><Field label="Costo del servicio *" value="$18,900.00" /></div><Panel style={{ marginTop: 15, padding: 16, background: colors.surfaceMuted }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><strong>PPF Full Front</strong><div style={{ marginTop: 4, color: colors.muted, fontSize: 12 }}>Duración: 5 años · Película demo</div></div><strong>$18,900.00</strong></div></Panel><div style={{ marginTop: 14, textAlign: 'right', fontWeight: 800 }}>Total servicios: $18,900.00</div></div>,
    <div style={{ maxWidth: 680 }}><Field label="Monto total del apartado" value="$5,000.00" /><div style={{ marginTop: 16, color: colors.muted, fontSize: 11, fontWeight: 700 }}>MÉTODOS DE PAGO</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}><Field label="Método" value="Transferencia" /><Field label="Monto" value="$5,000.00" /></div><Button tone="outline" style={{ marginTop: 12 }}>+ Agregar método</Button></div>,
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Panel style={{ padding: 15 }}><div style={{ color: colors.muted, fontSize: 11 }}>CLIENTE</div><strong style={{ display: 'block', marginTop: 5 }}>Cliente demostración</strong></Panel><Panel style={{ padding: 15 }}><div style={{ color: colors.muted, fontSize: 11 }}>VEHÍCULO</div><strong style={{ display: 'block', marginTop: 5 }}>Marca demo Sedán 2026</strong></Panel><Panel style={{ padding: 15 }}><div style={{ color: colors.muted, fontSize: 11 }}>SERVICIOS</div><strong style={{ display: 'block', marginTop: 5 }}>PPF Full Front · $18,900</strong></Panel><Panel style={{ padding: 15 }}><div style={{ color: colors.muted, fontSize: 11 }}>APARTADO</div><strong style={{ display: 'block', marginTop: 5 }}>$5,000 · Transferencia</strong></Panel></div>,
  ];
  return (
    <PortalFrame module="Estudio" frame={frame}>
      <PageHeader title="Nuevo ingreso" subtitle="Registra un nuevo servicio de detailing" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 15 }}>
        {labels.map((label, index) => <div key={label} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 7 }}><span style={{ display: 'grid', width: 27, height: 27, placeItems: 'center', borderRadius: '50%', background: index <= step ? colors.red : colors.surfaceMuted, color: index <= step ? '#fff' : colors.muted, fontSize: 11, fontWeight: 800 }}>{index + 1}</span><span style={{ color: index === step ? colors.text : colors.muted, fontSize: 11, fontWeight: 700 }}>{label}</span></div>)}
      </div>
      <Scene localFrame={local}>
        <Panel style={{ minHeight: 315, padding: 20 }}>
          {success ? <div style={{ display: 'grid', height: 275, placeItems: 'center', textAlign: 'center' }}><div><div style={{ display: 'grid', width: 62, height: 62, margin: '0 auto 13px', placeItems: 'center', borderRadius: '50%', background: colors.greenSoft, color: colors.green, fontSize: 30 }}>✓</div><h2 style={{ margin: 0 }}>Ingreso registrado</h2><p style={{ color: colors.muted }}>Folio ficticio EST-DEMO-021</p></div></div> : <><h2 style={{ margin: '0 0 15px', fontSize: 18 }}>{step === 0 ? 'Información del cliente' : step === 1 ? 'Datos del vehículo' : step === 2 ? 'Recepción del vehículo' : step === 3 ? 'Servicios' : step === 4 ? 'Apartado (reserva)' : 'Resumen'}</h2>{screens[step]}</>}
        </Panel>
      </Scene>
      {!success && <div style={{ position: 'absolute', right: 0, bottom: 0 }}><Button tone={step === 5 ? 'green' : 'red'} active={local > 22}>{step === 5 ? 'Confirmar y guardar' : 'Siguiente'}</Button></div>}
      {!success && <Cursor frame={local} x={1180} y={506} clickAt={27} />}
    </PortalFrame>
  );
};

const ServiceControlDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  return (
    <PortalFrame module="Control de servicios" frame={frame}>
      <Scene localFrame={local}>
        {phase === 0 ? <>
          <PageHeader title="Control de servicios asignados" subtitle="Checklist operativo del Estudio para PPF, Wrap y Clear" />
          <Panel style={{ padding: 20 }}><h2 style={{ margin: '0 0 15px', fontSize: 18 }}>Nueva orden</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}><Field label="Fecha" value="29/07/2026" /><Field label="Hora" value="09:30" /><Field label="Asignar a" value="Instalador demo" /><Field label="Marca" value="Marca demo" /><Field label="Submarca" value="SUV" /><Field label="Versión" value="Sport" /><Field label="Fecha de entrega" value="31/07/2026" /><Field label="Responsable de ventas" value="Ventas demo" /><Field label="Jefe de operaciones" value="Jefe demo" /></div><Button tone="red" active={local > 45} style={{ marginTop: 16 }}>Crear orden</Button></Panel>
        </> : <>
          <PageHeader title="CS-DEMO-118" subtitle="Marca demo SUV · Sport" action={<Badge tone={phase === 2 ? 'green' : 'blue'}>{phase === 2 ? 'Pendiente de administración' : 'En proceso'}</Badge>} />
          <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 16 }}>
            <Panel style={{ padding: 17 }}><div style={{ color: colors.muted, fontSize: 11, fontWeight: 800 }}>ASIGNACIÓN</div><strong style={{ display: 'block', marginTop: 7 }}>Instalador demo</strong><p style={{ color: colors.muted, fontSize: 12 }}>Entrega: 31/07/2026</p><div style={{ marginTop: 16, color: colors.muted, fontSize: 11, fontWeight: 800 }}>RESPONSABLES</div><p style={{ fontSize: 13 }}>Ventas demo<br />Jefe de Operaciones demo</p></Panel>
            <Panel style={{ padding: 18 }}><h2 style={{ margin: '0 0 13px', color: colors.red, fontSize: 17 }}>PPF</h2><div style={{ padding: 14, border: `1px solid ${colors.border}`, borderRadius: 12 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ display: 'grid', width: 23, height: 23, placeItems: 'center', borderRadius: 5, background: colors.green, color: '#fff' }}>✓</span><strong>Preparación y descontaminado</strong></div><Badge tone={phase === 2 ? 'purple' : 'blue'}>{phase === 2 ? 'Pendiente admin' : 'Operativo'}</Badge></div><div style={{ display: 'flex', gap: 9, marginTop: 13 }}><Button tone="outline">Guardar nota</Button><Button tone="outline">Subir evidencia</Button><Button tone="red" active={phase === 1 && local > 43}>Enviar este servicio al jefe de piso</Button></div>{phase === 2 && <div style={{ marginTop: 13, padding: 11, borderRadius: 9, background: '#f2ebff', color: colors.purple, fontSize: 12, fontWeight: 700 }}>Jefe de piso aprobó la etapa. Espera revisión administrativa.</div>}</div></Panel>
          </div>
        </>}
      </Scene>
      {phase === 2 && <Toast>Servicio enviado a administración</Toast>}
      {phase === 0 && <Cursor frame={local} x={157} y={479} />}
      {phase === 1 && <Cursor frame={local} x={1055} y={348} />}
    </PortalFrame>
  );
};

const VehicleRevisionDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  return (
    <PortalFrame module="Revisión vehicular" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="REV-DEMO-042" subtitle="Cliente demostración · Marca demo Sedán" action={<Button tone={phase === 2 ? 'green' : 'red'} active={phase === 1 && local > 43}>{phase === 2 ? '✓ Checklist completo' : 'Cerrar checklist'}</Button>} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 13 }}><Metric label="Asignación" value="Detallador demo" /><Metric label="Flujo de cierre" value={phase === 2 ? '1 / 3' : '0 / 3'} tone={phase === 2 ? 'green' : 'neutral'} /><Metric label="PPF adicional" value="Full Front" tone="black" /></div>
        <Panel style={{ padding: 17 }}><h2 style={{ margin: '0 0 12px', color: colors.red, fontSize: 17 }}>Exterior</h2><div style={{ display: 'grid', gap: 9 }}>{['Defensa delantera', 'Cofre', 'Espejos laterales'].map((zone, index) => <div key={zone} style={{ display: 'grid', gridTemplateColumns: '1fr 170px 1fr 80px', alignItems: 'end', gap: 10, padding: 10, border: `1px solid ${colors.border}`, borderRadius: 10 }}><strong style={{ alignSelf: 'center', fontSize: 13 }}>{zone}</strong><Field label="Estado" value={phase === 0 && index > 0 ? 'Pendiente' : 'Completado'} /><Field label="Comentario opcional" value={index === 0 ? 'Sin daño visible' : ''} /><Button tone="outline">Guardar</Button></div>)}</div></Panel>
        {phase >= 1 && <Panel style={{ position: 'absolute', right: 0, bottom: 0, width: 420, padding: 14, borderColor: phase === 2 ? '#9dd9b5' : colors.border }}><strong>Firma requerida por PPF · Cliente</strong><div style={{ height: 48, marginTop: 9, overflow: 'hidden', border: `1px solid ${colors.border}`, borderRadius: 8, background: '#fff' }}><svg width="100%" height="48" viewBox="0 0 380 48"><path d="M18 34 C65 5, 76 43, 126 18 S190 42, 242 14 S310 31, 360 12" fill="none" stroke={phase === 2 ? colors.text : colors.borderStrong} strokeWidth="3" strokeLinecap="round" /></svg></div><div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}><Button tone={phase === 2 ? 'green' : 'red'}>{phase === 2 ? 'Firma guardada' : 'Guardar firma'}</Button></div></Panel>}
      </Scene>
      {phase === 1 && <Cursor frame={local} x={1160} y={105} />}
    </PortalFrame>
  );
};

const InventoryDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  return (
    <PortalFrame module="Inventario" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="Inventario PPF" subtitle={phase === 2 ? 'Metros disponibles en estudio' : 'Rollos de película protectora'} action={<Button tone={phase === 2 ? 'blue' : 'red'}>{phase === 2 ? 'Agregar Metros' : 'Agregar Rollo'}</Button>} />
        <div style={{ display: 'flex', gap: 7, marginBottom: 13 }}><Button tone={phase === 2 ? 'outline' : 'black'}>Rollos</Button><Button tone={phase === 2 ? 'blue' : 'outline'}>Metros</Button></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 13 }}>{phase === 2 ? <><Metric label="Lotes de metros" value="4" tone="blue" /><Metric label="Metros disponibles" value="46.0 m" tone="blue" /><Metric label="Ubicación" value="Estudio" tone="black" /></> : <><Metric label="Total rollos" value="8" tone="black" /><Metric label="Disponibles" value="6" tone="green" /><Metric label="En transferencia" value="1" /><Metric label="Metros en rollos" value="184.5 m" tone="red" /></>}</div>
        <Panel style={{ overflow: 'hidden' }}><div style={{ display: 'grid', gridTemplateColumns: '1.3fr .8fr .8fr .8fr 1fr', padding: '11px 15px', background: colors.surfaceMuted, color: colors.muted, fontSize: 11, fontWeight: 800 }}><span>TIPO PPF</span><span>EXISTENCIA</span><span>UBICACIÓN</span><span>ESTADO</span><span>ACCIÓN</span></div><div style={{ display: 'grid', gridTemplateColumns: '1.3fr .8fr .8fr .8fr 1fr', alignItems: 'center', padding: 15, fontSize: 13 }}><strong>Película demo · 5 años</strong><span>{phase === 2 ? '15.5 m' : 'Rollo 15.5 m'}</span><span>Estudio</span><Badge tone={phase === 2 ? 'blue' : 'green'}>{phase === 2 ? 'Disponible' : 'En rollo'}</Badge><Button tone={phase === 2 ? 'black' : 'blue'} active={phase === 0 && local > 43}>{phase === 2 ? 'Vender metros' : 'Pasar a metros'}</Button></div></Panel>
        {phase === 1 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(17,19,21,.35)' }}><Panel style={{ width: 430, padding: 23 }}><h2 style={{ margin: 0, fontSize: 19 }}>Pasar rollo a metros</h2><p style={{ color: colors.muted, fontSize: 14 }}>¿Convertir este rollo en metros individuales?</p><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}><Button tone="outline">Cancelar</Button><Button tone="blue" active={local > 43}>Confirmar</Button></div></Panel></div>}
      </Scene>
      {phase === 2 && <Toast tone="blue">Rollo convertido: 15.5 m disponibles</Toast>}
      {phase === 0 && <Cursor frame={local} x={1100} y={381} />}
      {phase === 1 && <Cursor frame={local} x={795} y={373} />}
    </PortalFrame>
  );
};

const SalesDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  if (phase === 2) return <PortalFrame module="Ventas" frame={frame}><Scene localFrame={local}><div style={{ display: 'grid', height: '100%', placeItems: 'center' }}><Panel style={{ width: 580, padding: 45, borderColor: '#9dd9b5', background: colors.greenSoft, textAlign: 'center' }}><div style={{ display: 'grid', width: 68, height: 68, margin: '0 auto 15px', placeItems: 'center', borderRadius: '50%', background: colors.green, color: '#fff', fontSize: 32 }}>✓</div><h1 style={{ margin: 0, color: colors.green }}>Venta registrada</h1><p style={{ color: colors.muted }}>La venta DEMO-307 se registró correctamente.</p><div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}><Button tone="black">Nueva venta</Button><Button tone="outline">Ver ventas</Button></div></Panel></div></Scene></PortalFrame>;
  return (
    <PortalFrame module="Ventas" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="Nueva Venta" subtitle="Registra una nueva venta con productos" />
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 15 }}>
          <Panel style={{ padding: 17 }}><h2 style={{ margin: '0 0 12px', fontSize: 17 }}>Datos de la venta</h2><div style={{ display: 'grid', gap: 10 }}><Field label="Fecha" value="29/07/2026" /><Field label="Cliente" value="Cliente demostración" /><Field label="Contacto (opcional)" value="55 0000 0000" /><Field label="Forma de pago" value="Transferencia" /></div></Panel>
          <div style={{ display: 'grid', gap: 12 }}><Panel style={{ padding: 17 }}><h2 style={{ margin: '0 0 12px', fontSize: 17 }}>Agregar productos</h2><div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px auto', gap: 9, alignItems: 'end' }}><Field label="Producto" value="PPF Full Front · DEMO-PPF" /><Field label="Cantidad" value="1" /><Field label="Desc. %" value="10" /><Button tone="black" active={phase === 0 && local > 43}>+ Agregar</Button></div></Panel><Panel style={{ overflow: 'hidden' }}><div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 110px 90px 110px', padding: 11, background: colors.surfaceMuted, color: colors.muted, fontSize: 11, fontWeight: 800 }}><span>PRODUCTO</span><span>CANT.</span><span>P. UNIT.</span><span>DESC.</span><span>TOTAL</span></div>{phase === 0 ? <div style={{ padding: 25, color: colors.muted, textAlign: 'center', fontSize: 13 }}>Agrega productos a la venta</div> : <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 110px 90px 110px', padding: 14, fontSize: 13 }}><strong>PPF Full Front</strong><span>1</span><span>$18,900</span><span>10%</span><strong>$17,010</strong></div>}</Panel><Panel style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}><div><span style={{ color: colors.muted, fontSize: 13 }}>Total: </span><strong style={{ fontSize: 20 }}>{phase === 0 ? '$0.00' : '$17,010.00'}</strong></div><Button tone="red" active={phase === 1 && local > 43} style={{ opacity: phase === 0 ? 0.45 : 1 }}>Registrar venta</Button></Panel></div>
        </div>
      </Scene>
      {phase === 0 && <Cursor frame={local} x={1100} y={207} />}
      {phase === 1 && <Cursor frame={local} x={1100} y={492} />}
    </PortalFrame>
  );
};

const FinanceDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  return (
    <PortalFrame module="Finanzas" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="Ingresos y Egresos" subtitle="Flujo de caja general" action={<div style={{ display: 'flex', gap: 8 }}><Button tone="red" active={phase === 0 && local > 43}>+ Nueva transacción</Button><Button tone="black">Análisis</Button><Button tone="black">Parámetros</Button></div>} />
        <div style={{ display: 'flex', gap: 11, marginBottom: 14 }}><Metric label="Ingresos" value={phase === 2 ? '$42,850' : '$30,370'} tone="green" /><Metric label="Egresos" value="$11,920" tone="red" /><Metric label="Balance" value={phase === 2 ? '$30,930' : '$18,450'} tone="green" /></div>
        <Panel style={{ overflow: 'hidden' }}><div style={{ display: 'grid', gridTemplateColumns: '70px 110px 1fr 120px 130px 120px', padding: 11, background: colors.surfaceMuted, color: colors.muted, fontSize: 11, fontWeight: 800 }}><span>FOLIO</span><span>TIPO</span><span>CONCEPTO</span><span>UNIDAD</span><span>MÉTODO</span><span>MONTO</span></div>{phase === 2 && <div style={{ display: 'grid', gridTemplateColumns: '70px 110px 1fr 120px 130px 120px', padding: 14, fontSize: 13 }}><strong>052</strong><Badge tone="green">↑ Ingreso</Badge><span>Servicio PPF demo</span><span>Estudio</span><span>Transferencia</span><strong style={{ color: colors.green }}>$12,480</strong></div>}</Panel>
        {phase === 1 && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(17,19,21,.38)' }}><Panel style={{ width: 560, padding: 21 }}><h2 style={{ margin: '0 0 14px', fontSize: 19 }}>Nueva transacción</h2><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><Field label="Tipo *" value="Ingreso" /><Field label="Fecha *" value="29/07/2026" /><Field label="Monto *" value="12,480.00" /><Field label="Descripción *" value="Servicio PPF demo" /><Field label="Unidad de negocio" value="Estudio" /><Field label="Método de pago" value="Transferencia" /><Field label="Cuenta financiera" value="Cuenta demo" /><Field label="Responsable" value="Responsable demo" /></div><div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}><Button tone="outline">Cancelar</Button><Button tone="red" active={local > 43}>Guardar</Button></div></Panel></div>}
      </Scene>
      {phase === 2 && <Toast>Transacción guardada · Folio 052</Toast>}
      {phase === 0 && <Cursor frame={local} x={906} y={105} />}
      {phase === 1 && <Cursor frame={local} x={850} y={495} />}
    </PortalFrame>
  );
};

const QuoteDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  const configured = phase >= 1;
  return (
    <PortalFrame module="Cotizador PPF" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="Cotizador PPF" subtitle="Configura vehículo, producto y cobertura" />
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 15 }}>
          <Panel style={{ padding: 18 }}><h2 style={{ margin: '0 0 13px', fontSize: 17 }}>Configurar cotización</h2><div style={{ display: 'grid', gap: 10 }}><Field label="Vehículo" value={configured ? 'Sedán demo 2026' : undefined} placeholder="Ej. Audi A4 2022" /><Field label="Marca" value={configured ? 'Marca demo' : undefined} placeholder="Seleccionar marca..." /><Field label="Producto" value={configured ? 'Película demo' : undefined} placeholder="Seleccionar producto..." /><Field label="Tipo de cobertura" value={configured ? 'Full Front' : 'Full Body'} /><Field label="Metros de PPF" value={configured ? '6.5' : undefined} placeholder="Auto (metros base)" /></div></Panel>
          <Panel style={{ padding: 19 }}>{configured ? <><div><div style={{ color: colors.muted, fontSize: 10, fontWeight: 800 }}>COTIZACIÓN</div><h2 style={{ margin: '5px 0 3px', fontSize: 21 }}>Marca demo · Película demo</h2><p style={{ margin: 0, color: colors.muted, fontSize: 12 }}>Full Front · 6.5 metros · Sedán demo 2026</p></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 15 }}>{[['Material PPF', '$5,200'], ['Mano de obra', '$3,100'], ['Pulido y detallado', '$1,450'], ['Materiales detallado', '$680']].map(([label, value]) => <div key={label} style={{ padding: 11, borderRadius: 9, background: colors.surfaceMuted }}><span style={{ color: colors.muted, fontSize: 10 }}>{label}</span><strong style={{ display: 'block', marginTop: 5 }}>{value}</strong></div>)}</div><div style={{ marginTop: 14, padding: 14, borderRadius: 13, background: colors.red, color: '#fff' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ color: 'rgba(255,255,255,.72)', fontSize: 12 }}>Precio a ofrecer (×1.43)</div><strong style={{ display: 'block', marginTop: 4, fontSize: 28 }}>$18,920.00</strong></div><div style={{ display: 'flex', gap: 8 }}><Button tone="outline" active={phase === 2 && local > 43}>Compartir texto</Button><Button tone="outline">Compartir imagen</Button></div></div></div></> : <div style={{ display: 'grid', height: 350, placeItems: 'center', color: colors.muted, fontSize: 14 }}>Selecciona marca, producto y cobertura para ver la cotización</div>}</Panel>
        </div>
      </Scene>
      {phase === 2 && <Toast tone="black">Cotización copiada para compartir</Toast>}
      {phase === 0 && <Cursor frame={local} x={198} y={278} />}
      {phase === 2 && <Cursor frame={local} x={1010} y={430} />}
    </PortalFrame>
  );
};

const NotificationsDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  return (
    <PortalFrame module="Notificaciones" frame={frame}>
      <Scene localFrame={local}>
        <div style={{ display: 'grid', height: '100%', placeItems: 'center' }}>
          <Panel style={{ width: 650, padding: 28 }}>
            <div style={{ color: colors.red, fontSize: 11, fontWeight: 800 }}>CONFIGURACIÓN OBLIGATORIA</div>
            <h1 style={{ margin: '8px 0 0', fontSize: 28 }}>{phase === 2 ? 'Notificaciones activadas' : 'Activa las notificaciones'}</h1>
            <p style={{ color: colors.muted, fontSize: 14, lineHeight: 1.5 }}>Las asignaciones y avisos operativos se configuran por navegador y dispositivo.</p>
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: phase === 2 ? colors.greenSoft : colors.surfaceMuted }}>
              <strong style={{ color: phase === 2 ? colors.green : colors.text }}>{phase === 0 ? 'Debes permitir las notificaciones operativas en este dispositivo para usar el portal.' : phase === 1 ? 'Activando dispositivo y guardando suscripción...' : 'Dispositivo confirmado. Recibirás avisos aun con la aplicación cerrada.'}</strong>
              {phase === 1 && <div style={{ height: 6, marginTop: 13, overflow: 'hidden', borderRadius: 6, background: '#d8dce2' }}><div style={{ width: `${interpolate(local, [0, 55], [12, 100], { extrapolateRight: 'clamp' })}%`, height: '100%', background: colors.red }} /></div>}
            </div>
            {phase === 2 ? <div style={{ marginTop: 18 }}><div style={{ color: colors.green, fontSize: 13, fontWeight: 800 }}>RECORDATORIOS ACTIVOS</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 10 }}>{['10 y 5 minutos antes de entrada', 'Hora exacta de entrada', 'Regreso de comida', '5 minutos antes de salida'].map((item) => <div key={item} style={{ padding: 11, border: `1px solid #bce4ca`, borderRadius: 9, color: colors.green, fontSize: 12 }}>✓ {item}</div>)}</div></div> : <Button tone="red" active={phase === 0 && local > 43} style={{ width: '100%', marginTop: 18, minHeight: 46 }}>{phase === 1 ? 'Activando...' : 'Permitir notificaciones y continuar'}</Button>}
          </Panel>
        </div>
      </Scene>
      {phase === 2 && <Toast>Dispositivo confirmado</Toast>}
      {phase === 0 && <Cursor frame={local} x={640} y={438} />}
    </PortalFrame>
  );
};

const InfrastructureDemo = ({ frame }: { frame: number }) => {
  const phase = Math.min(2, Math.floor(frame / 72));
  const local = frame - phase * 72;
  return (
    <PortalFrame module="Infraestructura" frame={frame}>
      <Scene localFrame={local}>
        <PageHeader title="Infraestructura HA" subtitle="Estado de Directus, Patroni, etcd y failover público" action={<div style={{ display: 'flex', gap: 8 }}><Button tone="black" active={phase === 0 && local > 43}>{phase === 1 ? 'Reconciliando...' : 'Reconciliar'}</Button><Button tone="red">Regresar al VPS</Button></div>} />
        <div style={{ padding: 12, border: `1px solid ${phase === 1 ? '#efd28a' : '#9dd9b5'}`, borderRadius: 12, background: phase === 1 ? colors.amberSoft : colors.greenSoft, color: phase === 1 ? colors.amber : colors.green, fontSize: 13, fontWeight: 700 }}>Estado HA: {phase === 1 ? 'Verificando salud y liderazgo...' : phase === 2 ? 'Reconciliado · tráfico sin cambios' : 'Estable'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 13, marginTop: 13 }}>{['NODO DEMO A', 'NODO DEMO B'].map((node, index) => <Panel key={node} style={{ padding: 16 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><strong>{node}</strong><div style={{ display: 'flex', gap: 6 }}><Badge tone={index === 0 ? 'green' : 'neutral'}>{index === 0 ? 'Activo' : 'En espera'}</Badge><Badge tone="green">Salud OK</Badge></div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 13 }}>{[['Directus', 'Read OK · Write OK'], ['Patroni / Postgres', index === 0 ? 'Rol: leader' : 'Rol: replica'], ['etcd', index === 0 ? 'Leader local: Sí' : 'Tiene líder: Sí']].map(([label, value]) => <div key={label} style={{ padding: 10, border: `1px solid ${colors.border}`, borderRadius: 9 }}><div style={{ color: colors.muted, fontSize: 9, fontWeight: 800 }}>{label.toUpperCase()}</div><div style={{ marginTop: 6, fontSize: 11 }}>{value}</div></div>)}</div></Panel>)}</div>
        <Panel style={{ marginTop: 13, overflow: 'hidden' }}><div style={{ padding: 11, borderBottom: `1px solid ${colors.border}`, fontSize: 13, fontWeight: 800 }}>Bitácora operativa</div><div style={{ display: 'grid', gridTemplateColumns: '100px 140px 120px 1fr', padding: 10, background: colors.surfaceMuted, color: colors.muted, fontSize: 10, fontWeight: 800 }}><span>HORA</span><span>NODO</span><span>TIPO</span><span>MENSAJE</span></div><div style={{ display: 'grid', gridTemplateColumns: '100px 140px 120px 1fr', padding: 11, fontSize: 12 }}><span>09:42:18</span><span>orquestador</span><span>{phase === 2 ? 'reconcile' : 'health'}</span><span>{phase === 2 ? 'Reconciliación completada; no se requirió failover.' : 'Todos los servicios responden correctamente.'}</span></div></Panel>
      </Scene>
      {phase === 2 && <Toast>Reconciliación completada y registrada</Toast>}
      {phase === 0 && <Cursor frame={local} x={1025} y={105} />}
    </PortalFrame>
  );
};

const demoComponents: Record<DemoSlug, (props: { frame: number }) => ReactNode> = {
  asistencia: AttendanceDemo,
  estudio: StudioDemo,
  'control-servicios': ServiceControlDemo,
  'revision-vehiculos': VehicleRevisionDemo,
  'inventario-ppf': InventoryDemo,
  ventas: SalesDemo,
  finanzas: FinanceDemo,
  'cotizador-ppf': QuoteDemo,
  notificaciones: NotificationsDemo,
  'infraestructura-ha': InfrastructureDemo,
};

export const PortalDemo = ({ demo }: { demo: DemoDefinition }) => {
  const frame = useCurrentFrame();
  const DemoComponent = demoComponents[demo.slug];
  return <DemoComponent frame={frame} />;
};
