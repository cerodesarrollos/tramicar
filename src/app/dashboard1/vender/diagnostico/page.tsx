'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Shield, CheckCircle2, XCircle, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CheckItem {
  id: string
  label: string
  description: string
  status: 'pending' | 'checking' | 'ok' | 'warning' | 'error'
  detail?: string
}

const initialChecks: CheckItem[] = [
  { id: 'titularidad', label: 'Titularidad', description: 'Verificando que seas el titular registrado', status: 'pending' },
  { id: 'patentes', label: 'Deudas de patentes', description: 'Consultando deudas municipales', status: 'pending' },
  { id: 'multas', label: 'Multas de tránsito', description: 'Verificando infracciones pendientes', status: 'pending' },
  { id: 'prendas', label: 'Prendas', description: 'Consultando gravámenes prendarios', status: 'pending' },
  { id: 'inhibiciones', label: 'Inhibiciones', description: 'Verificando inhibiciones del titular', status: 'pending' },
  { id: 'embargos', label: 'Embargos', description: 'Consultando embargos sobre el vehículo', status: 'pending' },
]

// Mock results
const mockResults: Record<string, { status: 'ok' | 'warning' | 'error'; detail: string }> = {
  titularidad: { status: 'ok', detail: 'Titular: Juan Pérez (DNI 30.123.456)' },
  patentes: { status: 'ok', detail: 'Sin deudas de patentes' },
  multas: { status: 'warning', detail: '1 multa pendiente — $45.000 (CABA)' },
  prendas: { status: 'ok', detail: 'Sin prendas registradas' },
  inhibiciones: { status: 'ok', detail: 'Sin inhibiciones' },
  embargos: { status: 'ok', detail: 'Sin embargos' },
}

export default function DiagnosticoPage() {
  const router = useRouter()
  const [checks, setChecks] = useState<CheckItem[]>(initialChecks)
  const [currentCheck, setCurrentCheck] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    if (currentCheck >= checks.length) {
      setCompleted(true)
      return
    }

    // Start checking current item
    const timer1 = setTimeout(() => {
      setChecks(prev => prev.map((c, i) =>
        i === currentCheck ? { ...c, status: 'checking' } : c
      ))
    }, 300)

    // Complete current item
    const timer2 = setTimeout(() => {
      const result = mockResults[checks[currentCheck].id]
      setChecks(prev => prev.map((c, i) =>
        i === currentCheck ? { ...c, status: result.status, detail: result.detail } : c
      ))
      setCurrentCheck(prev => prev + 1)
    }, 1200 + Math.random() * 800)

    return () => { clearTimeout(timer1); clearTimeout(timer2) }
  }, [currentCheck])

  const okCount = checks.filter(c => c.status === 'ok').length
  const warningCount = checks.filter(c => c.status === 'warning').length
  const errorCount = checks.filter(c => c.status === 'error').length
  const canTransfer = errorCount === 0

  const handleApprove = () => {
    setApproved(true)
    setTimeout(() => router.push('/dashboard1/vender/invitar'), 500)
  }

  const statusIcon = (status: CheckItem['status']) => {
    switch (status) {
      case 'pending': return <div className="w-6 h-6 rounded-full border-2 border-border" />
      case 'checking': return <Loader2 size={24} className="text-primary animate-spin" />
      case 'ok': return <CheckCircle2 size={24} className="text-green" />
      case 'warning': return <AlertTriangle size={24} className="text-amber" />
      case 'error': return <XCircle size={24} className="text-red" />
    }
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <Link href="/dashboard1/vender" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Pre-diagnóstico</h1>
          <p className="text-xs text-white/60">Toyota Corolla XEI 2020 — AB 123 CD</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 py-4">
        <div className="flex gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
          <div className="flex-1 h-1.5 rounded-full bg-surface3" />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-primary font-medium">Vehículo ✓</span>
          <span className="text-[10px] text-primary font-medium">Diagnóstico</span>
          <span className="text-[10px] text-gray2">Invitar</span>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Shield header */}
        {!completed && (
          <div className="bg-primary-light border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
            <Shield size={24} className="text-primary animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-primary">Verificando tu vehículo...</p>
              <p className="text-xs text-text2">Consultamos bases oficiales para asegurar que todo esté en orden</p>
            </div>
          </div>
        )}

        {/* Checks list */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {checks.map((check, i) => (
            <div
              key={check.id}
              className={`p-4 flex items-start gap-3 transition-all duration-300 ${
                i < checks.length - 1 ? 'border-b border-border' : ''
              } ${check.status === 'checking' ? 'bg-primary-light/30' : ''}`}
            >
              <div className="mt-0.5 shrink-0">{statusIcon(check.status)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${
                  check.status === 'ok' ? 'text-text' :
                  check.status === 'warning' ? 'text-amber' :
                  check.status === 'error' ? 'text-red' :
                  check.status === 'checking' ? 'text-primary' : 'text-gray2'
                }`}>
                  {check.label}
                </p>
                <p className="text-xs text-gray mt-0.5">
                  {check.detail || check.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Results summary */}
        {completed && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className={`rounded-2xl p-5 border ${
              canTransfer ? 'bg-green-light border-green/20' : 'bg-red-light border-red/20'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {canTransfer ? (
                  <CheckCircle2 size={28} className="text-green" />
                ) : (
                  <XCircle size={28} className="text-red" />
                )}
                <h2 className="font-display font-bold text-lg text-text">
                  {canTransfer ? '¡Tu auto se puede transferir!' : 'Hay problemas que resolver'}
                </h2>
              </div>
              <div className="flex gap-4 text-sm mt-2">
                <span className="text-green font-medium">{okCount} OK</span>
                {warningCount > 0 && <span className="text-amber font-medium">{warningCount} advertencia{warningCount > 1 ? 's' : ''}</span>}
                {errorCount > 0 && <span className="text-red font-medium">{errorCount} bloqueante{errorCount > 1 ? 's' : ''}</span>}
              </div>
            </div>

            {warningCount > 0 && (
              <div className="bg-amber-light border border-amber/20 rounded-2xl p-4">
                <p className="text-xs text-amber font-medium mb-1">⚠️ Advertencias</p>
                <p className="text-sm text-text">Tenés una multa pendiente de $45.000. No bloquea la transferencia pero el comprador la va a ver.</p>
              </div>
            )}

            {canTransfer && (
              <button
                onClick={handleApprove}
                disabled={approved}
                className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {approved ? 'Continuando...' : <>Continuar — Invitar comprador <ChevronRight size={18} /></>}
              </button>
            )}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
