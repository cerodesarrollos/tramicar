'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowLeft, FileText, Download, Eye, CheckCircle2, AlertTriangle, Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Informe {
  id: string
  title: string
  source: string
  status: 'ok' | 'warning' | 'error'
  date: string
  summary: string
  details: string[]
  downloadable: boolean
}

const mockInformes: Informe[] = [
  {
    id: 'titularidad',
    title: 'Informe de Titularidad',
    source: 'DNRPA',
    status: 'ok',
    date: '27/02/2026 10:32',
    summary: 'Titular: Juan Pérez (DNI 30.123.456)',
    details: [
      'Dominio: AB 123 CD',
      'Titular registral: PÉREZ, JUAN CARLOS',
      'DNI: 30.123.456',
      'Tipo: Automotor',
      'Inscripción original: 15/03/2020',
      'Registro seccional: San Isidro Nº 2',
    ],
    downloadable: true,
  },
  {
    id: 'deudas',
    title: 'Libre Deuda de Patentes',
    source: 'ARBA / AGIP',
    status: 'ok',
    date: '27/02/2026 10:33',
    summary: 'Sin deudas de patentes',
    details: [
      'Jurisdicción: Buenos Aires',
      'Períodos verificados: 2020-2026',
      'Estado: Al día',
      'Último pago: Cuota 1/2026 — $125.000',
    ],
    downloadable: true,
  },
  {
    id: 'multas',
    title: 'Informe de Multas',
    source: 'Juzgado de Faltas / CABA',
    status: 'warning',
    date: '27/02/2026 10:33',
    summary: '1 multa pendiente — $45.000',
    details: [
      'Multa #2025-48291',
      'Fecha: 12/11/2025',
      'Infracción: Estacionamiento prohibido (Art. 6.1.63)',
      'Lugar: Av. Libertador 4200, CABA',
      'Monto: $45.000',
      'Estado: Pendiente de pago',
      'Vencimiento: 12/03/2026',
    ],
    downloadable: true,
  },
  {
    id: 'prendas',
    title: 'Informe de Gravámenes',
    source: 'DNRPA — Registro Prendario',
    status: 'ok',
    date: '27/02/2026 10:34',
    summary: 'Sin prendas registradas',
    details: [
      'Gravámenes prendarios: NO REGISTRA',
      'Contratos de leasing: NO REGISTRA',
      'Verificación al: 27/02/2026',
    ],
    downloadable: true,
  },
  {
    id: 'inhibiciones',
    title: 'Informe de Inhibiciones',
    source: 'Registro de la Propiedad Inmueble',
    status: 'ok',
    date: '27/02/2026 10:34',
    summary: 'Sin inhibiciones sobre el titular',
    details: [
      'Titular verificado: PÉREZ, JUAN CARLOS',
      'DNI: 30.123.456',
      'Inhibiciones generales: NO REGISTRA',
      'Verificación al: 27/02/2026',
    ],
    downloadable: false,
  },
  {
    id: 'embargos',
    title: 'Informe de Embargos',
    source: 'DNRPA',
    status: 'ok',
    date: '27/02/2026 10:35',
    summary: 'Sin embargos sobre el vehículo',
    details: [
      'Dominio: AB 123 CD',
      'Embargos judiciales: NO REGISTRA',
      'Medidas cautelares: NO REGISTRA',
      'Verificación al: 27/02/2026',
    ],
    downloadable: true,
  },
]

export default function InformesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

  const statusIcon = (status: Informe['status']) => {
    switch (status) {
      case 'ok': return <CheckCircle2 size={20} className="text-green" />
      case 'warning': return <AlertTriangle size={20} className="text-amber" />
      case 'error': return <span className="w-5 h-5 bg-red rounded-full flex items-center justify-center text-white text-xs font-bold">✕</span>
    }
  }

  const statusBg = (status: Informe['status']) => {
    switch (status) {
      case 'ok': return 'border-green/10'
      case 'warning': return 'border-amber/20 bg-amber-light/20'
      case 'error': return 'border-red/20 bg-red-light/20'
    }
  }

  const okCount = mockInformes.filter(i => i.status === 'ok').length
  const warnCount = mockInformes.filter(i => i.status === 'warning').length

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <Link href="/dashboard1/vender/invitar" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Informes del vehículo</h1>
          <p className="text-xs text-white/60">Toyota Corolla XEI 2020 — AB 123 CD</p>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-4">
        {/* Summary bar */}
        <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
          <Shield size={24} className="text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-text">Diagnóstico completo</p>
            <p className="text-xs text-gray">Consultado el 27/02/2026</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-green-light text-green font-medium px-2 py-1 rounded-lg">{okCount} OK</span>
            {warnCount > 0 && <span className="text-xs bg-amber-light text-amber font-medium px-2 py-1 rounded-lg">{warnCount} adv.</span>}
          </div>
        </div>

        {/* Informes list */}
        {mockInformes.map(informe => (
          <div key={informe.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${statusBg(informe.status)}`}>
            {/* Header row */}
            <button
              onClick={() => toggle(informe.id)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              {statusIcon(informe.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{informe.title}</p>
                <p className="text-xs text-gray mt-0.5">{informe.summary}</p>
              </div>
              {expanded === informe.id ? (
                <ChevronUp size={18} className="text-gray2 shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-gray2 shrink-0" />
              )}
            </button>

            {/* Expanded details */}
            {expanded === informe.id && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="mt-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-gray2 uppercase tracking-wider">Fuente: {informe.source}</span>
                    <span className="text-[10px] text-gray2">•</span>
                    <span className="text-[10px] text-gray2">{informe.date}</span>
                  </div>
                  <div className="bg-surface2 rounded-xl p-3 space-y-1.5">
                    {informe.details.map((detail, i) => (
                      <p key={i} className="text-xs text-text2">{detail}</p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {informe.downloadable && (
                    <button className="flex-1 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary2 transition-all">
                      <Download size={14} /> Descargar PDF
                    </button>
                  )}
                  <button className="flex-1 py-2.5 border border-border bg-white text-text text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:border-primary transition-all">
                    <Eye size={14} /> Ver completo
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Download all */}
        <button className="w-full py-3.5 border border-primary text-primary font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-primary-light transition-all">
          <Download size={18} /> Descargar todos los informes
        </button>
      </div>

      <Navbar />
    </div>
  )
}
