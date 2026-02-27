'use client'
import { use } from 'react'
import Navbar from '@/components/Navbar'
import { STEPS } from '@/lib/constants'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Step1Sena from '@/components/steps/Step1Sena'
import Step2Informes from '@/components/steps/Step2Informes'
import Step3Multas from '@/components/steps/Step3Multas'
import Step4Verificacion from '@/components/steps/Step4Verificacion'
import Step5Turno from '@/components/steps/Step5Turno'
import Step6Pago from '@/components/steps/Step6Pago'

const stepComponents: Record<number, React.ComponentType> = {
  1: Step1Sena,
  2: Step2Informes,
  3: Step3Multas,
  4: Step4Verificacion,
  5: Step5Turno,
  6: Step6Pago,
}

export default function StepDetailPage({ params }: { params: Promise<{ id: string; step: string }> }) {
  const { id, step: stepStr } = use(params)
  const stepNum = parseInt(stepStr)
  const stepInfo = STEPS[stepNum - 1]

  if (!stepInfo) return null

  const StepComponent = stepComponents[stepNum]

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <Link href={`/operacion/${id}`} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{stepInfo.icon}</span>
              <h1 className="font-display text-xl font-bold text-white">{stepInfo.title}</h1>
            </div>
            <p className="text-xs text-white/60">Paso {stepNum} de 6 · {stepInfo.subtitle}</p>
          </div>
        </div>
        {/* Step indicators */}
        <div className="flex gap-1.5 mt-4">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className={`flex-1 h-1 rounded-full ${n < stepNum ? 'bg-white' : n === stepNum ? 'bg-white/80' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-4">
        {/* Step specific content */}
        {StepComponent && <StepComponent />}

        {/* Navigation */}
        <div className="flex gap-3 mt-2">
          {stepNum > 1 && (
            <Link href={`/operacion/${id}/paso/${stepNum - 1}`} className="flex-1 py-3.5 border border-border text-text font-semibold rounded-full text-center text-sm bg-white">
              ← Anterior
            </Link>
          )}
          {stepNum < 6 && (
            <Link href={`/operacion/${id}/paso/${stepNum + 1}`} className="flex-1 py-3.5 bg-primary text-white font-semibold rounded-full text-center text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-1">
              Siguiente paso <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  )
}
