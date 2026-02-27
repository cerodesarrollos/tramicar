'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import {
  ArrowLeft, Search, Camera, FileText, Car, ChevronRight, Shield,
  CheckCircle2, Lock, Upload, AlertTriangle, Users, Clock, Eye,
  MessageCircle, Bell, ClipboardCheck
} from 'lucide-react'
import Link from 'next/link'

type StepStatus = 'completed' | 'active' | 'locked' | 'warning'

interface Step {
  id: string
  number: number
  title: string
  subtitle: string
  status: StepStatus
  phase: 'verificacion' | 'preparacion' | 'cierre'
  required?: boolean
  action?: string
}

export default function VenderPage() {
  const router = useRouter()
  const [plate, setPlate] = useState('')
  const [method, setMethod] = useState<'plate' | 'photo' | 'pdf' | null>(null)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [loading, setLoading] = useState(false)

  // Simulated state — in production this comes from DB
  const [operationStarted, setOperationStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const mockVehicle = {
    brand: 'Toyota', model: 'Corolla XEI', year: 2020,
    plate: 'AB 123 CD', color: 'Blanco', fuel: 'Nafta',
  }

  const handleSearch = () => {
    if (!plate.trim()) return
    setLoading(true)
    setTimeout(() => { setVehicleFound(true); setLoading(false) }, 1500)
  }

  const handleStartOperation = () => {
    setOperationStarted(true)
    setCurrentStep(2)
  }

  // Simulate advancing steps
  const advanceStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 12))
  }

  const getStepStatus = (stepNum: number): StepStatus => {
    if (stepNum < currentStep) return 'completed'
    if (stepNum === currentStep) return 'active'
    return 'locked'
  }

  const steps: Step[] = [
    { id: 'identificar', number: 1, title: 'Identificar vehículo', subtitle: 'Cargá la patente del auto', status: getStepStatus(1), phase: 'verificacion', required: true },
    { id: 'diagnostico', number: 2, title: 'Pre-diagnóstico', subtitle: 'Verificamos DNRPA, deudas, multas, prendas', status: getStepStatus(2), phase: 'verificacion', required: true, action: '/dashboard1/vender/diagnostico' },
    { id: 'pendientes', number: 3, title: 'Resolver pendientes', subtitle: currentStep > 3 ? 'Multa pagada ✓' : '1 multa pendiente — $45.000', status: currentStep === 3 ? 'warning' : getStepStatus(3), phase: 'verificacion' },
    { id: 'titulo', number: 4, title: 'Subir título del auto', subtitle: 'Foto del título o PDF digital — Obligatorio', status: getStepStatus(4), phase: 'verificacion', required: true },
    { id: 'cedula', number: 5, title: 'Subir cédula verde', subtitle: 'Foto frente y dorso — Obligatorio', status: getStepStatus(5), phase: 'verificacion', required: true },
    { id: 'verificacion', number: 6, title: 'Verificación policial', subtitle: 'Agendamos turno en planta verificadora', status: getStepStatus(6), phase: 'preparacion', required: true },
    { id: 'comprador', number: 7, title: 'Comprador confirma datos', subtitle: 'Esperando que complete su parte', status: getStepStatus(7), phase: 'preparacion' },
    { id: 'turno', number: 8, title: 'Agendar turno en registro', subtitle: 'Se habilita cuando ambos tengan todo listo', status: getStepStatus(8), phase: 'cierre', required: true },
    { id: 'firma', number: 9, title: 'Firma del 08D', subtitle: 'Firma biométrica digital', status: getStepStatus(9), phase: 'cierre', required: true },
    { id: 'pago', number: 10, title: 'Pago de aranceles', subtitle: 'Sellados + inscripción', status: getStepStatus(10), phase: 'cierre', required: true },
    { id: 'inscripcion', number: 11, title: 'Inscripción', subtitle: '¡Título nuevo a nombre del comprador!', status: getStepStatus(11), phase: 'cierre', required: true },
  ]

  const inputClass = "w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

  const completedCount = steps.filter(s => s.status === 'completed').length

  // --- INITIAL STATE: Vehicle identification ---
  if (!operationStarted) {
    return (
      <div className="min-h-screen bg-bg pb-24">
        <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
          <Link href="/dashboard1" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Vender mi auto</h1>
            <p className="text-xs text-white/60">Paso 1: Identificar el vehículo</p>
          </div>
        </div>

        <div className="px-5 pt-6 flex flex-col gap-4">
          {!vehicleFound ? (
            <>
              <p className="text-sm text-text2 font-medium">¿Cómo querés cargar los datos?</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => setMethod('plate')} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${method === 'plate' ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/30'}`}>
                  <div className="w-12 h-12 bg-primary-light border border-primary/10 rounded-xl flex items-center justify-center shrink-0"><Search size={22} className="text-primary" /></div>
                  <div><p className="font-semibold text-sm text-text">Ingresar patente</p><p className="text-xs text-gray mt-0.5">Buscamos los datos automáticamente</p></div>
                </button>
                <button onClick={() => setMethod('photo')} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${method === 'photo' ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/30'}`}>
                  <div className="w-12 h-12 bg-amber-light border border-amber/10 rounded-xl flex items-center justify-center shrink-0"><Camera size={22} className="text-amber" /></div>
                  <div><p className="font-semibold text-sm text-text">Foto del título</p><p className="text-xs text-gray mt-0.5">Sacale una foto y extraemos los datos con IA</p></div>
                </button>
                <button onClick={() => setMethod('pdf')} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all text-left ${method === 'pdf' ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:border-primary/30'}`}>
                  <div className="w-12 h-12 bg-blue-light border border-blue/10 rounded-xl flex items-center justify-center shrink-0"><FileText size={22} className="text-blue" /></div>
                  <div><p className="font-semibold text-sm text-text">Subir título digital (PDF)</p><p className="text-xs text-gray mt-0.5">Si ya tenés el título digital, subilo acá</p></div>
                </button>
              </div>

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
              {method === 'photo' && (
                <div className="bg-white border border-border rounded-2xl p-5 animate-slide-up">
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 bg-primary-light/30">
                    <Camera size={32} className="text-primary" /><p className="text-sm font-medium text-primary">Tocar para abrir la cámara</p>
                  </div>
                </div>
              )}
              {method === 'pdf' && (
                <div className="bg-white border border-border rounded-2xl p-5 animate-slide-up">
                  <div className="border-2 border-dashed border-blue/30 rounded-xl p-8 flex flex-col items-center gap-3 bg-blue-light/30">
                    <FileText size={32} className="text-blue" /><p className="text-sm font-medium text-blue">Tocar para subir PDF</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="animate-slide-up flex flex-col gap-4">
              <div className="bg-white border border-green/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-light rounded-xl flex items-center justify-center"><Car size={20} className="text-green" /></div>
                  <div><h2 className="font-display font-bold text-text">Vehículo encontrado</h2><p className="text-xs text-green font-medium">Datos verificados ✓</p></div>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray">Marca / Modelo</span><span className="font-medium text-text">{mockVehicle.brand} {mockVehicle.model}</span></div>
                  <div className="flex justify-between"><span className="text-gray">Año</span><span className="font-medium text-text">{mockVehicle.year}</span></div>
                  <div className="flex justify-between"><span className="text-gray">Patente</span><span className="font-display font-bold text-text tracking-wider">{mockVehicle.plate}</span></div>
                  <div className="flex justify-between"><span className="text-gray">Color</span><span className="font-medium text-text">{mockVehicle.color}</span></div>
                </div>
              </div>

              {/* Invite buyer early */}
              <div className="bg-blue-light border border-blue/20 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={20} className="text-blue" />
                  <p className="text-sm font-semibold text-text">¿Ya tenés comprador?</p>
                </div>
                <p className="text-xs text-gray mb-3">Podés invitarlo ahora para que vaya viendo el progreso en tiempo real</p>
                <button onClick={() => router.push('/dashboard1/vender/invitar')} className="w-full py-2.5 border border-blue text-blue text-sm font-semibold rounded-xl hover:bg-blue/5 transition-all flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> Invitar por WhatsApp
                </button>
              </div>

              <button onClick={handleStartOperation} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                Iniciar operación <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
        <Navbar />
      </div>
    )
  }

  // --- OPERATION STARTED: Step tracker ---
  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard1" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-white">Mi operación</h1>
            <p className="text-xs text-white/60">Toyota Corolla XEI 2020 — AB 123 CD</p>
          </div>
          <Link href="/dashboard1/informes" className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white font-medium flex items-center gap-1">
            <Eye size={12} /> Informes
          </Link>
        </div>

        {/* Progress bar */}
        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
          <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / steps.length) * 100}%` }} />
        </div>
        <p className="text-xs text-white/60 mt-1.5">{completedCount} de {steps.length} pasos completados</p>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-3">
        {/* Invite buyer card (if not done yet) */}
        {currentStep < 7 && (
          <div className="bg-blue-light border border-blue/20 rounded-2xl p-4 flex items-center gap-3">
            <Users size={20} className="text-blue shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">Comprador invitado</p>
              <p className="text-xs text-gray">Puede ver el progreso en tiempo real</p>
            </div>
            <Link href="/dashboard1/vender/invitar" className="text-xs text-blue font-medium">Reenviar →</Link>
          </div>
        )}

        {/* Phase: Verificación */}
        <div className="flex items-center gap-2 mt-2">
          <Shield size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Fase 1 — Verificación</span>
        </div>
        {steps.filter(s => s.phase === 'verificacion').map(step => (
          <StepRow key={step.id} step={step} onAction={advanceStep} />
        ))}

        {/* Phase: Preparación */}
        <div className="flex items-center gap-2 mt-4">
          <ClipboardCheck size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Fase 2 — Preparación</span>
        </div>
        {steps.filter(s => s.phase === 'preparacion').map(step => (
          <StepRow key={step.id} step={step} onAction={advanceStep} />
        ))}

        {/* Phase: Cierre */}
        <div className="flex items-center gap-2 mt-4">
          <CheckCircle2 size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Fase 3 — Cierre</span>
        </div>
        {steps.filter(s => s.phase === 'cierre').map(step => (
          <StepRow key={step.id} step={step} onAction={advanceStep} />
        ))}
      </div>

      <Navbar />
    </div>
  )
}

function StepRow({ step, onAction }: { step: Step; onAction: () => void }) {
  const isActive = step.status === 'active'
  const isCompleted = step.status === 'completed'
  const isLocked = step.status === 'locked'
  const isWarning = step.status === 'warning'

  return (
    <div
      className={`bg-white border rounded-2xl p-4 flex items-center gap-3 transition-all ${
        isActive ? 'border-primary ring-2 ring-primary/10 shadow-sm' :
        isWarning ? 'border-amber/30 bg-amber-light/20' :
        isCompleted ? 'border-green/10' :
        'border-border opacity-60'
      }`}
    >
      {/* Status indicator */}
      <div className="shrink-0">
        {isCompleted && <CheckCircle2 size={24} className="text-green" />}
        {isActive && (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
            <span className="text-xs font-bold text-white">{step.number}</span>
          </div>
        )}
        {isWarning && <AlertTriangle size={24} className="text-amber" />}
        {isLocked && <Lock size={20} className="text-gray2" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${
          isCompleted ? 'text-text' : isActive ? 'text-primary' : isWarning ? 'text-amber' : 'text-gray2'
        }`}>
          {step.title}
          {step.required && isLocked && <span className="text-[10px] text-red ml-1">obligatorio</span>}
        </p>
        <p className="text-xs text-gray mt-0.5">{step.subtitle}</p>
      </div>

      {/* Action */}
      {isActive && (
        <button
          onClick={onAction}
          className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary2 transition-all"
        >
          Completar
        </button>
      )}
      {isWarning && (
        <button
          onClick={onAction}
          className="shrink-0 px-4 py-2 bg-amber text-white text-xs font-semibold rounded-xl hover:bg-amber/80 transition-all"
        >
          Resolver
        </button>
      )}
      {isCompleted && (
        <CheckCircle2 size={16} className="text-green/40 shrink-0" />
      )}
    </div>
  )
}
