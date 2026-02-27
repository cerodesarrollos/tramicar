# Tramicar — Plan Técnico de Desarrollo

## Resumen
Plataforma mobile-first (PWA → nativa futura) para automatizar transferencias vehiculares entre particulares en Argentina. 6 pasos: seña escrow → informes DNRPA → multas/patentes → VPA → turno registro → pago+transferencia.

---

## Arquitectura

```
Next.js (App Router) + Supabase
├── Auth (email/password + magic link)
├── DB (PostgreSQL via Supabase)
├── Storage (documentos, fotos títulos)
├── Realtime (notificaciones, estado operación)
├── Edge Functions (scraping, OCR, integraciones)
└── PWA → React Native (fase 2)
```

---

## Fases de Desarrollo

### FASE 1 — MVP Funcional (2-3 semanas)
**Objetivo:** App usable con flujo manual asistido

| Tarea | Complejidad | Estimación |
|-------|-------------|------------|
| Auth real (Supabase Auth + profiles) | Baja | 1 día |
| CRUD operaciones (crear, listar, detalle) | Baja | 1 día |
| Steps con estado real (DB + optimistic UI) | Media | 2 días |
| Upload documentos (Supabase Storage) | Baja | 1 día |
| Invitación vendedor (email + link) | Media | 1 día |
| Vista vendedor (read-only + acciones limitadas) | Media | 2 días |
| Notificaciones in-app (Supabase Realtime) | Media | 1 día |
| Push notifications (web push) | Media | 1 día |
| Deploy Vercel + dominio | Baja | 0.5 días |

**Total fase 1: ~10 días de dev**

---

### FASE 2 — Integraciones Core (3-4 semanas)
**Objetivo:** Automatizar lo que se pueda sin romper nada legal

#### 2.1 Escrow / Seña Segura
**Dificultad: 🔴 ALTA**

**Problema:** Retener dinero de un tercero requiere cumplir regulaciones BCRA. No podés ser un "banco" sin licencia.

**Soluciones posibles:**
1. **MercadoPago Split Payment** — MP retiene y libera. Ellos manejan el compliance. Comisión ~3-5%. Más viable a corto plazo.
2. **Cuenta escrow real** — Requiere acuerdo con banco/fintech (Ualá Business, Bind, etc). Más complejo pero más profesional.
3. **Contrato + transferencia directa** — Sin retención real, solo registro de la transferencia como "seña" con contrato digital. Menos seguro pero sin regulación.

**Recomendación:** Arrancar con opción 3 (contrato digital) y migrar a MercadoPago Split cuando haya volumen. Evita problemas legales iniciales.

**Estimación:** 3-5 días (opción 3) | 2-3 semanas (MP Split)

#### 2.2 Informes DNRPA
**Dificultad: 🔴 ALTA**

**Problema:** La web de DNRPA (dnrpa.gov.ar) tiene:
- CAPTCHA en cada request
- Pago obligatorio via BEP (Boleta Electrónica de Pago)
- No hay API pública
- Scraping de sitios .gov.ar es zona gris legal

**Soluciones posibles:**
1. **Scraping + anti-CAPTCHA** — Puppeteer/Playwright + servicio como 2Captcha/Anti-Captcha (~$2-3 por CAPTCHA). Funciona pero frágil (si cambian la web, se rompe).
2. **Proveedor intermedio** — Hay empresas que ya venden informes DNRPA via API (InfoAuto, Nosis). Costo ~$1500-3000 por informe. Más estable.
3. **Manual asistido** — La app guía al usuario paso a paso para hacer el trámite en la web de DNRPA. El usuario sube el PDF. La app parsea el PDF con IA (GPT-4o).
4. **Gestoría automatizada** — Convenio con gestoría que pida informes en bulk. Tramicar pide, gestoría ejecuta, resultado vuelve.

**Recomendación:** Arrancar con opción 3 (guía + parseo PDF con IA). En paralelo evaluar proveedores intermedios. El scraping directo es riesgoso legalmente y técnicamente frágil.

**Estimación:** 3 días (opción 3) | 1-2 semanas (proveedor API)

#### 2.3 Multas y Patentes
**Dificultad: 🟡 MEDIA**

**Problema:** Cada jurisdicción tiene su propio sistema:
- CABA: AGIP (agip.gob.ar)
- Buenos Aires: ARBA (arba.gob.ar)
- Resto: cada municipio tiene su web

**Soluciones posibles:**
1. **Scraping multi-jurisdicción** — Un scraper por jurisdicción. Mantenimiento alto.
2. **API de InfoAuto/Nosis** — Algunos proveedores incluyen consulta de deuda. Costo por consulta.
3. **Manual + parseo** — El usuario consulta en la web correspondiente (le damos link directo según radicación), saca screenshot, la IA extrae los datos.

**Recomendación:** Opción 3 para arrancar. Detectamos radicación del informe DNRPA y le damos el link exacto al usuario.

**Estimación:** 2 días (opción 3) | 1-2 semanas (scraping)

#### 2.4 Verificación Policial (VPA)
**Dificultad: 🟡 MEDIA**

**Problema:** El turno de VPA se saca online en cada planta. Necesitás datos del vehículo que están en el título.

**Soluciones:**
1. **OCR del título** — Foto del título → GPT-4o Vision extrae marca, modelo, motor, chasis. Precisión ~95%+. Ya demostrado en Star.
2. **Turno automático** — Scraping del sistema de turnos de VPA. Varía por jurisdicción. CABA usa un sistema, PBA otro.
3. **Manual asistido** — OCR autocompleta datos, el usuario saca el turno con link directo.

**Recomendación:** OCR ya (fácil, rápido, alto valor percibido). Turnos automáticos después según jurisdicción.

**Estimación:** 2 días (OCR) | 1-2 semanas (turnos automáticos por jurisdicción)

#### 2.5 Turno en Registro Seccional
**Dificultad: 🔴 ALTA**

**Problema:** Los registros seccionales de DNRPA tienen sistema de turnos online pero:
- Cada registro puede tener su propio sistema
- Requiere datos específicos de la operación
- CAPTCHA, tokens de sesión

**Soluciones:**
1. **Link directo + guía** — Detectar registro por radicación, dar link + instrucciones. El usuario saca el turno.
2. **Scraping** — Automatizar la carga. Alto mantenimiento.
3. **Convenio con registro** — Imposible a escala chica.

**Recomendación:** Opción 1. Valor real está en saber QUÉ registro le corresponde y QUÉ documentos llevar.

**Estimación:** 1 día

#### 2.6 Chat entre partes
**Dificultad: 🟢 BAJA**

**Solución:** Supabase Realtime + tabla messages. Ya tenemos experiencia de Star.

**Estimación:** 2 días

---

### FASE 3 — Automatización Avanzada (1-2 meses)
**Objetivo:** Diferenciarse de un "checklist glorificado"

| Feature | Dificultad | Estimación |
|---------|------------|------------|
| OCR título con GPT-4o Vision | 🟢 | 2 días |
| Parseo automático de PDFs DNRPA | 🟡 | 3 días |
| Integración MercadoPago (escrow) | 🔴 | 2 semanas |
| Notificaciones push (Firebase) | 🟡 | 2 días |
| Generación de contrato digital (PDF) | 🟡 | 2 días |
| Cálculo automático de costos (aranceles registro, sellados) | 🟡 | 3 días |
| WhatsApp notifications (via API) | 🟡 | 1 día |

---

### FASE 4 — Escala (3+ meses)
| Feature | Notas |
|---------|-------|
| React Native (app nativa) | Performance + push + cámara nativa |
| Firma digital (cuando habiliten) | Game changer absoluto |
| Integración real DNRPA (si sale API) | Monitorear novedades regulatorias |
| Marketplace de gestores | Red de gestores que ejecutan trámites |
| B2B: agencias y concesionarias | Versión para profesionales |
| Scoring de vehículos | IA que analiza historial y da "nota" al auto |

---

## Puntos Críticos y Riesgos

### 🔴 Legal — Escrow
No podés retener plata de terceros sin licencia. Solución: usar MercadoPago como intermediario o arrancar solo con contrato digital.

### 🔴 Legal — Scraping gov.ar
Zona gris. Si scrapeas DNRPA y te detectan, pueden bloquear IPs. Solución: no scrapear, usar proveedores intermedios o asistir manualmente.

### 🔴 Técnico — Fragilidad del scraping
Cada vez que DNRPA/AGIP/ARBA cambia su web, se rompe. Mantenimiento constante. Solución: enfoque manual-asistido + IA es más robusto.

### 🟡 Producto — Diferenciación
Sin automatización real, es un checklist bonito. La magia está en: OCR, parseo de informes con IA, recomendaciones inteligentes, y chat coordinado. Eso es lo que nadie tiene.

### 🟡 Mercado — Competencia
No hay competencia directa en Argentina para este nicho. Existen gestorías online pero ninguna con enfoque tech/app. Ventana de oportunidad abierta.

---

## Estimación Total

| Fase | Tiempo | Costo infra (mensual) |
|------|--------|-----------------------|
| Fase 1 — MVP | 2-3 semanas | $0 (Supabase free + Vercel free) |
| Fase 2 — Integraciones | 3-4 semanas | ~$50 (Supabase Pro + APIs) |
| Fase 3 — Automatización | 1-2 meses | ~$150 (APIs + GPT-4o + MP) |
| Fase 4 — Escala | 3+ meses | Variable |

**Timeline realista para producto lanzable:** 6-8 semanas desde hoy.

---

## Stack Final

- **Frontend:** Next.js 16 + Tailwind + TypeScript
- **Backend:** Supabase (Auth, DB, Storage, Realtime, Edge Functions)
- **IA:** GPT-4o Vision (OCR), GPT-4o-mini (parseo PDFs)
- **Pagos:** MercadoPago (fase 2-3)
- **Notificaciones:** Web Push + WhatsApp API
- **Deploy:** Vercel (frontend) + Supabase (backend)
- **Futuro:** React Native para app nativa

---

*Generado por Pulso — 25/02/2026*
