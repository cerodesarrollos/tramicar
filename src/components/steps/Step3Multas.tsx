'use client'
import { useState } from 'react'
import { Search, Check, AlertTriangle, DollarSign } from 'lucide-react'

export default function Step3Multas() {
  const [stage, setStage] = useState<'scanning' | 'done'>('scanning')

  useState(() => {
    const timer = setTimeout(() => setStage('done'), 2500)
    return () => clearTimeout(timer)
  })

  if (stage === 'scanning') {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Search size={28} className="text-primary" />
        </div>
        <h3 className="font-display font-bold text-text mb-2">Verificando multas y patentes...</h3>
        <p className="text-sm text-gray">Consultando AGIP, ARBA y registros municipales</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-amber-light border border-amber/20 rounded-2xl p-5 text-center">
        <div className="w-14 h-14 bg-amber rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={28} className="text-white" />
        </div>
        <h3 className="font-display font-bold text-lg text-text">Deuda encontrada</h3>
        <p className="text-sm text-gray mt-1">Se detectaron multas y patentes pendientes</p>
      </div>

      {/* Multas */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm mb-3 text-text flex items-center gap-2">
          🚦 Multas de tránsito
        </h4>
        <div className="space-y-2">
          {[
            { date: '15/08/2025', desc: 'Exceso de velocidad - Panamericana Km 42', amount: 85000 },
            { date: '03/11/2025', desc: 'Estacionamiento prohibido - CABA', amount: 42000 },
          ].map((m, i) => (
            <div key={i} className="bg-surface2 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">{m.desc}</p>
                <p className="text-[11px] text-gray">{m.date}</p>
              </div>
              <span className="text-sm font-bold text-red">${m.amount.toLocaleString('es-AR')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Patentes */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm mb-3 text-text flex items-center gap-2">
          📋 Patentes
        </h4>
        <div className="space-y-2">
          {[
            { period: 'Cuota 5/2025', amount: 28500, status: 'vencida' },
            { period: 'Cuota 6/2025', amount: 28500, status: 'vencida' },
          ].map((p, i) => (
            <div key={i} className="bg-surface2 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">{p.period}</p>
                <span className="text-[10px] bg-red-light text-red px-2 py-0.5 rounded-full font-medium">{p.status}</span>
              </div>
              <span className="text-sm font-bold text-red">${p.amount.toLocaleString('es-AR')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-white border-2 border-primary rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-semibold text-text">Deuda total</h4>
          <span className="font-display text-xl font-bold text-red">$184.000</span>
        </div>
        <div className="bg-blue-light rounded-xl p-3">
          <p className="text-xs text-text2">
            <strong>Recomendación:</strong> Este monto se descuenta del precio final del auto. El vendedor debe saldar las deudas antes de la transferencia, o se descuentan de la seña.
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 py-3 bg-primary text-white font-semibold rounded-full text-sm">
            Descontar del precio
          </button>
          <button className="flex-1 py-3 border border-border text-text font-semibold rounded-full text-sm bg-white">
            Pide al vendedor
          </button>
        </div>
      </div>

      {/* Patentes al día */}
      <div className="bg-green-light border border-green/20 rounded-xl p-3 flex gap-2">
        <Check size={16} className="text-green shrink-0 mt-0.5" />
        <p className="text-xs text-text2">Patentes 2026 al día. Cuotas 1 y 2 pagadas.</p>
      </div>
    </div>
  )
}
