'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import {
  ArrowLeft, Search, Link as LinkIcon, Car, CheckCircle2, Shield,
  ChevronRight, Lock, Clock, Eye, AlertTriangle, User, Bell
} from 'lucide-react'
import Link from 'next/link'

type StepStatus = 'completed' | 'active' | 'waiting' | 'locked'

interface BuyerStep {
  id: string
  title: string
  subtitle: string
  status: StepStatus
  owner: 'vendedor' | 'comprador' | 'ambos'
}

export default function ComprarPage() {
  const router = useRouter()
  const [method, setMethod] = useState<'link' | 'plate' | null>(null)
  const [plate, setPlate] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [operationFound, setOperationFound] = useState(false)

  const mockVehicle = {
    brand: 'Toyota', model: 'Corolla XEI', year: 2020,
    plate: 'AB 123 CD', seller: 'Juan P.',
  }

  const handleSearch = () => {
    if (method === 'plate' && !plate.trim()) return
    if (method === 'link' && !inviteCode.trim()) return
    setLoading(true)
    setTimeout(() => { setOperationFound(true); setLoading(false) }, 1500)
  }

  // Simulated seller progress — in production comes from DB
  const sellerSteps: BuyerStep[] = [
    { id: 'identificar', title: 'Vehículo identificado', subtitle: 'Toyota Corolla XEI 2020 — AB 123 CD', status: 'completed', owner: 'vendedor' },
    { id: 'diagnostico', title: 'Pre-diagnóstico', subtitle: '5 verificaciones OK, 1 advertencia', status: 'completed', owner: 'vendedor' },
    { id: 'pendientes', title: 'Resolver pendientes', subtitle: 'Multa de $45.000 — pagando...', status: 'active', owner: 'vendedor' },
    { id: 'titulo', title: 'Título del auto', subtitle: 'Esperando que el vendedor lo suba', status: 'waiting', owner: 'vendedor' },
    { id: 'cedula', title: 'Cédula verde', subtitle: 'Esperando que el vendedor la suba', status: 'waiting', owner: 'vendedor' },
    { id: 'verificacion', title: 'Verificación policial', subtitle: 'Pendiente del vendedor', status: 'waiting', owner: 'vendedor' },
  ]

  const buyerSteps: BuyerStep[] = [
    { id: 'datos', title: 'Completar tus datos', subtitle: 'DNI, nombre, domicilio', status: 'active', owner: 'comprador' },
    { id: 'turno', title: 'Agendar turno en registro', subtitle: 'Se habilita cuando ambos tengan todo', status: 'locked', owner: 'ambos' },
    { id: 'firma', title: 'Firma del 08D', subtitle: 'Firma biométrica digital', status: 'locked', owner: 'ambos' },
    { id: 'pago', title: 'Pago de aranceles', subtitle: 'Sellados + inscripción', status: 'locked', owner: 'ambos' },
    { id: 'inscripcion', title: '¡Título a tu nombre!', subtitle: 'Transferencia completada', status: 'locked', owner: 'ambos' },
  ]

  const sellerCompleted = sellerSteps.filter(s => s.status === 'completed').length
  const totalSteps = sellerSteps.length + buyerSteps.length

  const inputClass = "w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

  const statusIcon = (status: StepStatus, owner: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={22} className="text-green" />
      case 'active': return (
        <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center ${owner === 'vendedor' ? 'bg-amber animate-pulse' : 'bg-primary animate-pulse-glow'}`}>
          <Clock size={12} className="text-white" />
        </div>
      )
      case 'waiting': return <Clock size={22} className="text-gray2" />
      case 'locked': return <Lock size={18} className="text-gray2" />
    }
  }

  // --- SEARCH SCREEN ---
  if (!operationFound) {
    return (
      <div className="min-h-screen bg-bg pb-24">
        <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
          <Link href="/dashboard1" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Comprar un auto</h1>
            <p className="text-xs text-white/60">Verificá el vehículo antes de comprar</p>
          </div>
        </div>

        <div className="px-5 pt-6 flex flex-col gap-4">
          <p className="text-sm text-text2 font-medium">¿Cómo querés buscar el auto?</p>

          <button onClick={() => setMethod('link')} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${method === 'link' ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/30'}`}>
            <div className="w-12 h-12 bg-primary-light border border-primary/10 rounded-xl flex items-center justify-center shrink-0"><LinkIcon size={22} className="text-primary" /></div>
            <div><p className="font-semibold text-sm text-text">Tengo un link de invitación</p><p className="text-xs text-gray mt-0.5">El vendedor me compartió un link</p></div>
          </button>

          <button onClick={() => setMethod('plate')} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${method === 'plate' ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/30'}`}>
            <div className="w-12 h-12 bg-blue-light border border-blue/10 rounded-xl flex items-center justify-center shrink-0"><Search size={22} className="text-blue" /></div>
            <div><p className="font-semibold text-sm text-text">Buscar por patente</p><p className="text-xs text-gray mt-0.5">Ingresá la patente del auto que querés comprar</p></div>
          </button>

          {method === 'link' && (
            <div className="bg-white border border-border rounded-2xl p-5 animate-slide-up">
              <label className="text-xs font-medium text-text2 mb-2 block">Código o link de invitación</label>
              <input type="text" placeholder="https://tramicar.app/op/abc123" value={inviteCode} onChange={e => setInviteCode(e.target.value)} className={inputClass} />
              <button onClick={handleSearch} disabled={!inviteCode.trim() || loading} className="w-full mt-3 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Buscar operación <ChevronRight size={18} /></>}
              </button>
            </div>
          )}

          {method === 'plate' && (
            <div className="bg-white border border-border rounded-2xl p-5 animate-slide-up">
              <label className="text-xs font-medium text-text2 mb-2 block">Patente del vehículo</label>
              <div className="flex gap-2">
                <input type="text" placeholder="AB 123 CD" value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} className={`${inputClass} flex-1 text-center font-display text-lg tracking-wider`} maxLength={10} />
                <button onClick={handleSearch} disabled={!plate.trim() || loading} className="px-5 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary2 transition-all disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>
        <Navbar />
      </div>
    )
  }

  // --- OPERATION FOUND: Progress tracker ---
  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard1" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-white">{mockVehicle.brand} {mockVehicle.model} {mockVehicle.year}</h1>
            <p className="text-xs text-white/60">Vendedor: {mockVehicle.seller} — {mockVehicle.plate}</p>
          </div>
          <Link href="/dashboard1/informes" className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white font-medium flex items-center gap-1">
            <Eye size={12} /> Informes
          </Link>
        </div>

        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
          <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(sellerCompleted / totalSteps) * 100}%` }} />
        </div>
        <p className="text-xs text-white/60 mt-1.5">{sellerCompleted} de {totalSteps} pasos completados</p>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-3">
        {/* Notification preference */}
        <div className="bg-primary-light border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
          <Bell size={20} className="text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-text">Te avisamos por WhatsApp</p>
            <p className="text-xs text-gray">Cada vez que haya un avance en la operación</p>
          </div>
        </div>

        {/* Seller progress */}
        <div className="flex items-center gap-2 mt-2">
          <User size={14} className="text-amber" />
          <span className="text-xs font-bold text-amber uppercase tracking-wider">Progreso del vendedor</span>
        </div>

        {sellerSteps.map(step => (
          <div key={step.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-3 transition-all ${
            step.status === 'completed' ? 'border-green/10' :
            step.status === 'active' ? 'border-amber/30 bg-amber-light/10' :
            'border-border opacity-50'
          }`}>
            {statusIcon(step.status, step.owner)}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${
                step.status === 'completed' ? 'text-text' :
                step.status === 'active' ? 'text-amber' : 'text-gray2'
              }`}>{step.title}</p>
              <p className="text-xs text-gray mt-0.5">{step.subtitle}</p>
            </div>
            {step.status === 'completed' && step.id === 'diagnostico' && (
              <Link href="/dashboard1/informes" className="text-[10px] text-green font-medium">Ver →</Link>
            )}
          </div>
        ))}

        {/* Buyer steps */}
        <div className="flex items-center gap-2 mt-4">
          <User size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Tus pasos</span>
        </div>

        {buyerSteps.map(step => (
          <div key={step.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-3 transition-all ${
            step.status === 'active' ? 'border-primary ring-2 ring-primary/10 shadow-sm' :
            step.status === 'completed' ? 'border-green/10' :
            'border-border opacity-60'
          }`}>
            {statusIcon(step.status, step.owner)}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${
                step.status === 'active' ? 'text-primary' :
                step.status === 'completed' ? 'text-text' : 'text-gray2'
              }`}>{step.title}</p>
              <p className="text-xs text-gray mt-0.5">{step.subtitle}</p>
            </div>
            {step.status === 'active' && (
              <button
                onClick={() => router.push('/dashboard1/comprar/datos')}
                className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary2 transition-all"
              >
                Completar
              </button>
            )}
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  )
}
