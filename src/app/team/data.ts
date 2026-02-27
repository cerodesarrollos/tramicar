// Team Dashboard — Mock Data & Types

export type Role = 'CEO/CTO' | 'Comercial' | 'Advisor'

export interface TeamUser {
  id: string
  name: string
  role: Role
  password: string
  avatar: string
  color: string
}

export const TEAM_USERS: TeamUser[] = [
  { id: 'matias', name: 'Matias', role: 'CEO/CTO', password: 'ceo123', avatar: '🧠', color: '#818cf8' },
  { id: 'jony', name: 'Jony', role: 'Comercial', password: 'com123', avatar: '🤝', color: '#34d399' },
  { id: 'diego', name: 'Diego', role: 'Advisor', password: 'adv123', avatar: '🎯', color: '#f59e0b' },
]

// Diego Cassinera — Perfil
// Ex OLX, Letgo, MercadoLibre, Oracle. Board of Advisors en Alpha Capital (Alec Oxenford).
// Trabajó bajo Vinton Cerf. Patente en sincronización móvil-DB. 4x V100 corriendo LLMs locales.
// Vecino de Jony. Validó la idea de Tramicar al instante.

export interface RoadmapPhase {
  id: string
  name: string
  period: string
  status: 'done' | 'active' | 'upcoming'
  milestones: { text: string; done: boolean }[]
}

export const INITIAL_ROADMAP: RoadmapPhase[] = [
  {
    id: 'mvp', name: 'MVP', period: 'Feb — Mar 2026', status: 'active',
    milestones: [
      { text: 'Landing page + auth', done: true },
      { text: 'Flujo vendedor completo', done: true },
      { text: 'Flujo comprador completo', done: true },
      { text: 'Informes y diagnóstico', done: true },
      { text: 'Firma biométrica 08D', done: true },
      { text: 'Dashboard interno equipo', done: false },
      { text: 'Simulación demo realista', done: false },
    ]
  },
  {
    id: 'convenio', name: 'Convenio DNRPA', period: 'Abr — Jun 2026', status: 'upcoming',
    milestones: [
      { text: 'Documento propuesta DNRPA', done: true },
      { text: 'Contacto vía senadores', done: false },
      { text: 'Reunión DNRPA formal', done: false },
      { text: 'API RENAPER (Nosis/VU Security)', done: false },
      { text: 'Piloto con 1 registro automotor', done: false },
    ]
  },
  {
    id: 'beta', name: 'Beta Cerrada', period: 'Jul 2026', status: 'upcoming',
    milestones: [
      { text: '50 transferencias reales', done: false },
      { text: 'Onboard 3 registros automotores', done: false },
      { text: 'Escrow bancario integrado', done: false },
      { text: 'Métricas y analytics', done: false },
    ]
  },
  {
    id: 'scale', name: 'Scale', period: 'Ago 2026+', status: 'upcoming',
    milestones: [
      { text: 'API para concesionarias', done: false },
      { text: 'Integración MercadoLibre', done: false },
      { text: 'App mobile nativa', done: false },
      { text: 'Expansión nacional', done: false },
    ]
  },
]

export interface Meeting {
  id: string
  date: string
  title: string
  attendees: string[]
  notes: string
  actionItems: { text: string; assignee: string; done: boolean }[]
}

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'm1', date: '2026-02-27', title: 'Sprint MVP — Día 2',
    attendees: ['matias'],
    notes: 'Matias solo, ejecutando. Dashboard1 completo con 6 páginas: flujo vendedor (11 pasos secuenciales), flujo comprador (progreso real-time), informes expandibles, firma biométrica 08D completa (DNI + selfie + RENAPER + firma). Dashboard interno del equipo creado con 9 secciones (Overview, Roadmap, Decisiones, Riesgos, Reuniones, Ideas, Trabas, Recursos, Actividad). Deploy en tramicar.aidaptive.com.ar.',
    actionItems: [
      { text: 'Dashboard interno del equipo', assignee: 'matias', done: true },
      { text: 'Decision Log + Risk Register', assignee: 'matias', done: true },
      { text: 'Simulación demo realista vendedor↔comprador', assignee: 'matias', done: false },
      { text: 'Badges AES-256 en pasos de DNI/selfie', assignee: 'matias', done: false },
      { text: 'Crear grupo WhatsApp del equipo', assignee: 'jony', done: false },
    ]
  },
  {
    id: 'm2', date: '2026-02-26', title: 'Reunión fundacional — Matias + Jony + Diego',
    attendees: ['matias', 'jony', 'diego'],
    notes: 'Primera reunión presencial los tres. Diego validó todo lo que Matias presentó (Datacar API, estrategia, análisis). Diego planteó visión macro: marketplace de autos como primer paso → cross-posting en ML/Kavak → Tramicar como servicio dentro del marketplace → financiamiento con bancos. Jony piensa micro (el trámite), Diego piensa macro (el ecosistema), Matias es el puente. Diego no habló de equity — no le interesa meterse por participación chica. Matias quedó muy bien parado. Diego tiene amigo con inmobiliaria grande en San Isidro (potencial cliente Star). Se acordó: Tramicar funcional primero (20 días), marketplace después como capa arriba. Reunión de seguimiento en ~10 días con app funcional + sorpresa (prototipo marketplace).',
    actionItems: [
      { text: 'App funcional para próxima reunión (~10 días)', assignee: 'matias', done: false },
      { text: 'Prototipo marketplace como sorpresa', assignee: 'matias', done: false },
      { text: 'Dashboard de métricas (autos más patentados, marcas, precios)', assignee: 'matias', done: false },
      { text: 'Crear grupo WhatsApp para mostrar avances', assignee: 'jony', done: false },
      { text: 'Confirmar préstamo 10k USD', assignee: 'jony', done: false },
      { text: 'Contactar amigo inmobiliaria San Isidro (para Star)', assignee: 'diego', done: false },
    ]
  },
  {
    id: 'm3', date: '2026-02-25', title: 'Primer contacto — Jony presenta la idea',
    attendees: ['matias', 'jony'],
    notes: 'Jony contacta a Matias por audio de WhatsApp. Presenta la idea de Tramicar: una app que automatice todo el proceso de compraventa de autos entre particulares (seña en escrow, informes DNRPA, verificación policial, turno en registro, coordinación de pago). Jony tiene la experiencia real ("hice 700 mil transferencias") y el dolor claro: gente que no compra autos por miedo a los trámites, multas que aparecen después de pagar, procesos confusos. Ya se lo mostró a Diego (su vecino, ex OLX/Letgo/ML) quien dijo "esto es espectacular". Matias acepta, arranca a construir el MVP el mismo día.',
    actionItems: [
      { text: 'Construir MVP Next.js + Supabase', assignee: 'matias', done: true },
      { text: 'Armar propuesta DNRPA', assignee: 'matias', done: true },
      { text: 'Investigar Datacar API para informes', assignee: 'matias', done: true },
      { text: 'Coordinar reunión presencial con Diego', assignee: 'jony', done: true },
    ]
  },
]

export interface Idea {
  id: string
  title: string
  description: string
  status: 'nueva' | 'evaluando' | 'aprobada' | 'descartada'
  author: string
  createdAt: string
}

export const INITIAL_IDEAS: Idea[] = [
  { id: 'i1', title: 'Marketplace de autos (tipo OLX)', description: 'Capa de marketplace arriba de Tramicar. Publicar autos y que la transferencia sea nativa. Genera tráfico y valuación. Idea de Diego.', status: 'aprobada', author: 'diego', createdAt: '2026-02-26' },
  { id: 'i2', title: 'Cross-posting ML/Kavak/OLX', description: 'Publicar en marketplace Tramicar y replicar automáticamente en MercadoLibre, Kavak, etc. Un solo click, múltiples plataformas.', status: 'evaluando', author: 'diego', createdAt: '2026-02-26' },
  { id: 'i3', title: 'Financiamiento con bancos', description: 'Integrar financiamiento bancario en el proceso de compra. Ser parte del proceso completo, no solo el trámite. Idea de Diego.', status: 'nueva', author: 'diego', createdAt: '2026-02-26' },
  { id: 'i4', title: 'Patentamientos 0km para concesionarias', description: 'Suscripción mensual para concesionarias que hacen patentamientos en volumen. Ingreso recurrente.', status: 'aprobada', author: 'matias', createdAt: '2026-02-26' },
  { id: 'i5', title: 'Data analytics como producto', description: 'Vender datos agregados a concesionarias/aseguradoras/bancos: autos más patentados, marcas más vendidas, precios promedio por zona.', status: 'evaluando', author: 'matias', createdAt: '2026-02-26' },
  { id: 'i6', title: 'Sistema de referidos', description: 'Programa de referidos para que compradores/vendedores recomienden Tramicar. Growth orgánico.', status: 'aprobada', author: 'matias', createdAt: '2026-02-26' },
  { id: 'i7', title: 'App mobile nativa', description: 'PWA funciona bien pero una app nativa daría más confianza para firma biométrica y fotos de documentos. Post-MVP.', status: 'nueva', author: 'matias', createdAt: '2026-02-27' },
  { id: 'i8', title: 'Blockchain para trazabilidad', description: 'Registro inmutable de cada paso. Descartado como core: genera ruido con reguladores argentinos. Queda como feature futura de trazabilidad.', status: 'descartada', author: 'matias', createdAt: '2026-02-25' },
]

export interface Blocker {
  id: string
  title: string
  description: string
  priority: 'alta' | 'media' | 'baja'
  assignee: string
  status: 'abierta' | 'en-progreso' | 'resuelta'
  createdAt: string
}

export const INITIAL_BLOCKERS: Blocker[] = [
  { id: 'b1', title: 'Acceso API RENAPER', description: 'Necesitamos convenio o intermediario (Nosis ID, VU Security) para verificación biométrica real. Sin esto la firma 08D es solo visual.', priority: 'alta', assignee: 'diego', status: 'abierta', createdAt: '2026-02-27' },
  { id: 'b2', title: 'Definir escrow bancario', description: 'Evaluar Bind, Ualá Business o MercadoPago como escrow para las transferencias. Smart contracts descartados.', priority: 'alta', assignee: 'jony', status: 'abierta', createdAt: '2026-02-26' },
  { id: 'b3', title: 'Contacto con DNRPA', description: 'Matias tiene contactos con senadores pero falta activar. Diego puede abrir puertas vía Oxenford.', priority: 'media', assignee: 'matias', status: 'abierta', createdAt: '2026-02-25' },
  { id: 'b4', title: 'Inversión inicial 10k USD', description: 'Jony 2 aún no confirmó el préstamo ni la devolución de Diego. Necesario para hosting, API costs, y primeros meses.', priority: 'media', assignee: 'jony', status: 'en-progreso', createdAt: '2026-02-25' },
]

export interface Resource {
  id: string
  title: string
  url: string
  type: 'repo' | 'doc' | 'link' | 'tool'
  addedBy: string
  addedAt: string
}

export const INITIAL_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Repo Tramicar (GitHub)', url: 'https://github.com/aidaptivecom-pixel/Tramicar', type: 'repo', addedBy: 'matias', addedAt: '2026-02-25' },
  { id: 'r2', title: 'Propuesta DNRPA (PDF)', url: '#', type: 'doc', addedBy: 'matias', addedAt: '2026-02-25' },
  { id: 'r3', title: 'Acuerdo de socios (PDF)', url: '#', type: 'doc', addedBy: 'matias', addedAt: '2026-02-25' },
  { id: 'r4', title: 'Plan técnico Tramicar', url: '#', type: 'doc', addedBy: 'matias', addedAt: '2026-02-25' },
  { id: 'r5', title: 'Supabase — Star CRM (referencia)', url: 'https://wuoptaejdobinsmmkmoq.supabase.co', type: 'tool', addedBy: 'matias', addedAt: '2026-02-26' },
  { id: 'r6', title: 'Deploy Vercel', url: 'https://tramicar.vercel.app', type: 'link', addedBy: 'matias', addedAt: '2026-02-26' },
]

export interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
}

export const INITIAL_ACTIVITIES: Activity[] = [
  // 27 Feb
  { id: 'a01', user: 'matias', action: 'creó', target: 'Decision Log + Risk Register', timestamp: '2026-02-27T14:30:00' },
  { id: 'a02', user: 'matias', action: 'creó', target: 'Dashboard interno del equipo (9 secciones)', timestamp: '2026-02-27T14:00:00' },
  { id: 'a03', user: 'matias', action: 'completó', target: 'Firma biométrica 08D (DNI + selfie + RENAPER)', timestamp: '2026-02-27T13:00:00' },
  { id: 'a04', user: 'matias', action: 'completó', target: 'Flujo comprador con progreso real-time', timestamp: '2026-02-27T12:30:00' },
  { id: 'a05', user: 'matias', action: 'completó', target: 'Página de informes expandibles', timestamp: '2026-02-27T11:30:00' },
  { id: 'a06', user: 'matias', action: 'completó', target: 'Step tracker vendedor (11 pasos secuenciales)', timestamp: '2026-02-27T10:00:00' },
  // 26 Feb
  { id: 'a07', user: 'diego', action: 'propuso', target: 'Marketplace de autos + cross-posting + financiamiento', timestamp: '2026-02-26T17:00:00' },
  { id: 'a08', user: 'diego', action: 'validó', target: 'Análisis de Matias (Datacar API, estrategia)', timestamp: '2026-02-26T16:30:00' },
  { id: 'a09', user: 'matias', action: 'presentó', target: 'MVP y estrategia en reunión fundacional', timestamp: '2026-02-26T16:00:00' },
  { id: 'a10', user: 'jony', action: 'coordinó', target: 'Reunión presencial con Diego', timestamp: '2026-02-26T15:00:00' },
  { id: 'a11', user: 'matias', action: 'completó', target: 'Flujo vendedor completo (carga vehículo + pre-diagnóstico)', timestamp: '2026-02-26T12:00:00' },
  // 25 Feb
  { id: 'a12', user: 'matias', action: 'desplegó', target: 'MVP en Vercel (landing + auth + dashboard)', timestamp: '2026-02-25T18:00:00' },
  { id: 'a13', user: 'matias', action: 'creó', target: 'Propuesta DNRPA + Acuerdo de socios + Plan técnico', timestamp: '2026-02-25T16:00:00' },
  { id: 'a14', user: 'matias', action: 'investigó', target: 'Datacar API (solo identificación, no informes legales)', timestamp: '2026-02-25T14:00:00' },
  { id: 'a15', user: 'matias', action: 'inició', target: 'Construcción MVP (Next.js + Supabase)', timestamp: '2026-02-25T12:00:00' },
  { id: 'a16', user: 'jony', action: 'presentó', target: 'Idea de Tramicar (audios WhatsApp)', timestamp: '2026-02-25T10:00:00' },
  { id: 'a17', user: 'diego', action: 'se unió como', target: 'Advisor (validó la idea como "espectacular")', timestamp: '2026-02-25T10:00:00' },
]

// === NEW: Decision Log ===

export interface Decision {
  id: string
  date: string
  title: string
  context: string
  decision: string
  alternatives: string[]
  rationale: string
  decidedBy: string[]
  impact: 'alta' | 'media' | 'baja'
  category: 'tech' | 'negocio' | 'legal' | 'producto'
}

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'd1', date: '2026-02-27', title: 'Escrow bancario tradicional, NO smart contracts',
    context: 'Para garantizar el dinero de la transferencia vehicular necesitamos un mecanismo de escrow.',
    decision: 'Usar escrow bancario tradicional (Bind, Ualá Business, MercadoPago)',
    alternatives: ['Smart contracts en blockchain', 'Pago directo entre partes', 'Escrow notarial'],
    rationale: 'Smart contracts generan ruido con reguladores argentinos (BCRA, CNV). No hay marco legal claro. Escrow bancario es conocido, regulado, y genera confianza inmediata. Blockchain queda como trazabilidad futura, no como core.',
    decidedBy: ['matias', 'diego'],
    impact: 'alta',
    category: 'negocio',
  },
  {
    id: 'd2', date: '2026-02-27', title: 'AES-256 como badge visual, no requisito técnico',
    context: 'Se evaluó si cifrado AES-256 es requerido por RENAPER/DNRPA para el manejo de datos personales.',
    decision: 'No es requisito formal pero se agrega como badge visual de confianza en pasos de DNI/selfie/firma',
    alternatives: ['No mencionarlo', 'Implementar cifrado end-to-end completo', 'Certificación ISO 27001'],
    rationale: 'Diego (y cualquier inversor) va a valorar que mostremos seguridad. No necesitamos certificación formal para el MVP, pero el badge genera percepción de seriedad. En Beta sí implementar cifrado real.',
    decidedBy: ['matias'],
    impact: 'media',
    category: 'tech',
  },
  {
    id: 'd3', date: '2026-02-27', title: 'Estrategia Diego: no pedir, mostrar',
    context: 'Diego tiene conexión directa con Alec Oxenford (Despegar, OLX). Podría abrir puertas con DNRPA/RENAPER.',
    decision: 'No pedirle nada todavía. Mostrar avances constantes. Que él proponga involucrarse.',
    alternatives: ['Pedirle introducción a Oxenford ahora', 'Ofrecerle equity a cambio de contactos', 'Esperar al Beta'],
    rationale: 'Diego viene de un mundo donde le piden cosas todo el tiempo. Si ve tracción real y ejecución rápida, él solo va a querer meterse más. Es más poderoso que venga de él. "Esto es como dialéctica — en el medio nace la síntesis".',
    decidedBy: ['matias', 'jony'],
    impact: 'alta',
    category: 'negocio',
  },
  {
    id: 'd4', date: '2026-02-26', title: 'Tramicar primero, marketplace después',
    context: 'Diego propuso visión macro (marketplace de autos tipo OLX como primer paso). Había riesgo de cambiar el scope del MVP.',
    decision: 'Mantener plan original: Tramicar funcional primero (20 días), marketplace como capa arriba después',
    alternatives: ['Arrancar directo con marketplace', 'Hacer ambos en paralelo', 'Pivotar a marketplace puro'],
    rationale: 'El trámite vehicular es el diferencial real. El marketplace es commoditizado (ML, Kavak, OLX ya existen). Primero resolver el dolor (trámite), después capturar tráfico (marketplace). Sin trámite resuelto, no hay ventaja competitiva.',
    decidedBy: ['matias'],
    impact: 'alta',
    category: 'producto',
  },
  {
    id: 'd6', date: '2026-02-26', title: 'Sociedad: definir después, no ahora',
    context: 'Jony planteó sociedad de 3 en la reunión. Diego no habló de porcentajes.',
    decision: 'No definir equity todavía. Esperar devolución de Diego vía Jony. Negociar desde mejor posición con producto funcionando.',
    alternatives: ['Definir 33/33/33 ahora', '60/40 Matias/Jony sin Diego', 'Ofrecer equity a Diego por contactos'],
    rationale: 'Diego no le interesa meterse por equity chico. Mejor mostrar tracción y que él proponga involucrarse. Matias queda en mejor posición negociadora con producto hecho.',
    decidedBy: ['matias'],
    impact: 'alta',
    category: 'negocio',
  },
  {
    id: 'd5', date: '2026-02-25', title: 'Stack: Next.js + Supabase + Vercel',
    context: 'Elección de stack técnico para el MVP.',
    decision: 'Next.js 16 (App Router) + Supabase (PostgreSQL + Auth + Storage) + Vercel (deploy)',
    alternatives: ['React + Express + AWS', 'Flutter (mobile-first)', 'WordPress + plugins'],
    rationale: 'Velocidad de desarrollo máxima. Matias ya domina el stack. Supabase da auth, DB, y storage gratis en free tier. Vercel deploy automático. Mobile-first con PWA, app nativa después.',
    decidedBy: ['matias'],
    impact: 'media',
    category: 'tech',
  },
]

// === NEW: Risk Register ===

export interface Risk {
  id: string
  title: string
  description: string
  probability: 'alta' | 'media' | 'baja'
  impact: 'crítico' | 'alto' | 'medio' | 'bajo'
  mitigation: string
  owner: string
  status: 'activo' | 'mitigado' | 'materializado'
  category: 'regulatorio' | 'tech' | 'mercado' | 'financiero' | 'operativo'
  createdAt: string
}

export const INITIAL_RISKS: Risk[] = [
  {
    id: 'rk1', title: 'DNRPA rechaza convenio',
    description: 'Que la DNRPA no apruebe la integración digital de transferencias o demore años en hacerlo.',
    probability: 'media', impact: 'crítico',
    mitigation: 'Fase 1 funciona SIN convenio (pre-llena formularios, el trámite se hace en registro). Convenio es para Fase 2+. Contactos políticos (senadores) como plan B.',
    owner: 'matias', status: 'activo', category: 'regulatorio', createdAt: '2026-02-27',
  },
  {
    id: 'rk2', title: 'RENAPER no da acceso a verificación biométrica',
    description: 'Sin acceso a API RENAPER, la firma biométrica no puede verificar identidad real.',
    probability: 'media', impact: 'alto',
    mitigation: 'Intermediarios: Nosis ID o VU Security tienen acceso a RENAPER y venden como servicio. Más caro pero viable.',
    owner: 'diego', status: 'activo', category: 'regulatorio', createdAt: '2026-02-27',
  },
  {
    id: 'rk3', title: 'MercadoLibre o Kavak lanzan algo similar',
    description: 'Competidores grandes construyen transferencia digital integrada.',
    probability: 'baja', impact: 'crítico',
    mitigation: 'ML no tiene incentivo (cobra por publicación, no por trámite). Kavak está en retracción en LATAM. Nuestro diferencial es el convenio DNRPA que ellos no tienen. Si copian → acquisition target.',
    owner: 'diego', status: 'activo', category: 'mercado', createdAt: '2026-02-27',
  },
  {
    id: 'rk4', title: 'Falta de capital para operar',
    description: 'Sin los 10k USD iniciales, no se puede pagar hosting, APIs, y operación primeros 3 meses.',
    probability: 'media', impact: 'alto',
    mitigation: 'Free tier de Supabase y Vercel cubren MVP. APIs de RENAPER solo se pagan cuando hay volumen. Lean operation hasta primera facturación.',
    owner: 'jony', status: 'activo', category: 'financiero', createdAt: '2026-02-25',
  },
  {
    id: 'rk5', title: 'Registros automotores no adoptan',
    description: 'Los registros automotores prefieren seguir con el proceso manual/presencial.',
    probability: 'media', impact: 'alto',
    mitigation: 'Empezar con 1 registro friendly (piloto). Demostrar ahorro de tiempo y reducción de errores. Los registros cobran por trámite → más trámites = más ingresos para ellos.',
    owner: 'jony', status: 'activo', category: 'mercado', createdAt: '2026-02-26',
  },
]
