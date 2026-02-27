'use client'
import Navbar from '@/components/Navbar'
import OperationCard from '@/components/OperationCard'
import { MOCK_OPERATIONS, MOCK_STEPS } from '@/lib/mock-data'
import { Plus, Bell } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs">Bienvenido 👋</p>
            <h1 className="font-display text-xl font-bold text-white">Mis operaciones</h1>
          </div>
          <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center relative">
            <Bell size={18} className="text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red rounded-full text-[9px] font-bold text-white flex items-center justify-center">2</div>
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <div className="font-display text-xl font-bold text-white">2</div>
            <div className="text-[10px] text-white/60">En curso</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <div className="font-display text-xl font-bold text-white">0</div>
            <div className="text-[10px] text-white/60">Completadas</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <div className="font-display text-xl font-bold text-white">$43.5M</div>
            <div className="text-[10px] text-white/60">Total</div>
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="px-5 pt-4 flex flex-col gap-4">
        {MOCK_OPERATIONS.map(op => (
          <OperationCard key={op.id} operation={op} steps={MOCK_STEPS[op.id] || []} />
        ))}

        <Link href="/operacion/nueva">
          <div className="bg-white border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary/30 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-primary-light border border-primary/10 rounded-xl flex items-center justify-center">
              <Plus size={24} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-sm text-text">Nueva operación</p>
              <p className="text-xs text-gray mt-1">Empezá una transferencia</p>
            </div>
          </div>
        </Link>
      </div>

      <Navbar />
    </div>
  )
}
