'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
}

export default function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  const progress = ((currentStep - 1) / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray">Progreso</span>
        <span className="text-xs font-medium text-primary">{currentStep - 1}/{totalSteps} pasos</span>
      </div>
      <div className="h-2 bg-surface2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-green rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
