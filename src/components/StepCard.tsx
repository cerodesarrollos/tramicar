'use client'
import { STEPS, StepStatus } from '@/lib/constants'
import { Check, ChevronRight, Clock, Lock } from 'lucide-react'

interface StepCardProps {
  stepNumber: number
  status: StepStatus
  notes?: string | null
  onClick?: () => void
  delay?: number
}

const statusConfig: Record<StepStatus, { bg: string; border: string; icon: React.ReactNode; label: string }> = {
  completed: {
    bg: 'bg-green-light',
    border: 'border-green/20',
    icon: <div className="w-7 h-7 bg-green rounded-full flex items-center justify-center"><Check size={14} className="text-white" /></div>,
    label: 'Completado',
  },
  in_progress: {
    bg: 'bg-primary-light',
    border: 'border-primary/20',
    icon: <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center"><Clock size={14} className="text-white" /></div>,
    label: 'En progreso',
  },
  pending: {
    bg: 'bg-white',
    border: 'border-border',
    icon: <div className="w-7 h-7 rounded-full border-2 border-gray2/30" />,
    label: 'Pendiente',
  },
  blocked: {
    bg: 'bg-red-light',
    border: 'border-red/20',
    icon: <div className="w-7 h-7 bg-red rounded-full flex items-center justify-center"><Lock size={14} className="text-white" /></div>,
    label: 'Bloqueado',
  },
}

export default function StepCard({ stepNumber, status, notes, onClick, delay = 0 }: StepCardProps) {
  const step = STEPS[stepNumber - 1]
  const config = statusConfig[status]

  return (
    <div
      onClick={onClick}
      className={`animate-slide-up ${config.bg} border ${config.border} rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md active:scale-[0.99] ${status === 'in_progress' ? 'animate-pulse-glow' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Step number + icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 bg-primary-light border border-primary/10">
        {step.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-text">{step.title}</span>
          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${step.tag === 'Automático' ? 'bg-green-light text-green border border-green/20' : 'bg-amber-light text-amber border border-amber/20'}`}>
            {step.tag}
          </span>
        </div>
        <p className="text-xs text-gray mt-0.5 truncate">{notes || step.subtitle}</p>
      </div>

      {/* Status + Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        {config.icon}
        <ChevronRight size={16} className="text-gray2" />
      </div>
    </div>
  )
}
