'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import StepCard from '@/components/StepCard'
import ProgressBar from '@/components/ProgressBar'
import { MOCK_OPERATIONS, MOCK_STEPS } from '@/lib/mock-data'
import { ArrowLeft, Car, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function OperacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const operation = MOCK_OPERATIONS.find(o => o.id === id) || MOCK_OPERATIONS[0]
  const steps = MOCK_STEPS[operation.id] || MOCK_STEPS['op-001']

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ArrowLeft size={18} className="text-white" />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold text-white">{operation.vehicle_brand} {operation.vehicle_model}</h1>
              <p className="text-xs text-white/60">{operation.vehicle_year} · {operation.vehicle_plate}</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Share2 size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Vehicle info card */}
      <div className="px-5 pt-4 mb-4">
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-light border border-primary/10 rounded-xl flex items-center justify-center">
                <Car size={18} className="text-primary" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-text">${operation.vehicle_price.toLocaleString('es-AR')}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  <span className="text-[11px] text-gray">Operación en curso</span>
                </div>
              </div>
            </div>
          </div>
          <ProgressBar currentStep={operation.current_step} />
        </div>
      </div>

      {/* Steps */}
      <div className="px-5">
        <h2 className="font-display font-semibold text-sm text-gray mb-3">Pasos de la transferencia</h2>
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              stepNumber={step.step_number}
              status={step.status}
              notes={step.notes}
              delay={i * 80}
              onClick={() => router.push(`/operacion/${operation.id}/paso/${step.step_number}`)}
            />
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  )
}
