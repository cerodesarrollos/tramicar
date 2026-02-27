'use client'
import { useState } from 'react'
import { Check, Shield, ArrowRight, Clock } from 'lucide-react'

export default function Step1Sena() {
  const [stage, setStage] = useState<'input' | 'processing' | 'done'>('input')
  const [amount, setAmount] = useState('1500000')

  const handleDeposit = () => {
    setStage('processing')
    setTimeout(() => setStage('done'), 2000)
  }

  if (stage === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-green-light border border-green/20 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={28} className="text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-text">Seña depositada</h3>
          <p className="text-sm text-gray mt-1">El dinero está seguro en escrow</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h4 className="font-display font-semibold text-sm mb-3 text-text">Detalle del depósito</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray">Monto</span><span className="font-bold text-text">$1.500.000</span></div>
            <div className="flex justify-between"><span className="text-gray">Estado</span><span className="text-green font-semibold">🔒 Retenido en escrow</span></div>
            <div className="flex justify-between"><span className="text-gray">ID Transacción</span><span className="font-mono text-xs text-gray">#TRC-2026-00847</span></div>
            <div className="flex justify-between"><span className="text-gray">Fecha</span><span className="text-text">25/02/2026 23:15</span></div>
          </div>
          <div className="mt-4 bg-blue-light rounded-xl p-3 flex gap-2">
            <Shield size={16} className="text-blue shrink-0 mt-0.5" />
            <p className="text-xs text-text2">El dinero se libera automáticamente cuando los informes confirmen que el auto está limpio. Si hay problemas, se devuelve al comprador.</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-light rounded-full flex items-center justify-center">
              <Clock size={14} className="text-amber" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text">Esperando al vendedor</p>
              <p className="text-[11px] text-gray">vendedor@email.com — Notificación enviada</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'processing') {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Shield size={28} className="text-primary" />
        </div>
        <h3 className="font-display font-bold text-text mb-2">Procesando depósito...</h3>
        <p className="text-sm text-gray">Verificando cuenta y reteniendo fondos</p>
        <div className="mt-4 h-2 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[grow_2s_ease-in-out]" style={{ animation: 'grow 2s ease-in-out forwards' }} />
        </div>
        <style>{`@keyframes grow { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold text-sm mb-1 text-text">Depositar seña</h3>
        <p className="text-xs text-gray mb-4">El monto queda retenido hasta que los informes estén OK</p>
        
        <label className="text-xs font-medium text-text2 mb-1 block">Monto de la seña</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray font-semibold">$</span>
          <input
            type="text"
            value={Number(amount).toLocaleString('es-AR')}
            onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
            className="w-full pl-8 pr-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-lg font-bold placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <p className="text-[11px] text-gray mt-2">Recomendado: 5-10% del valor del auto ($925.000 - $1.850.000)</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm mb-3 text-text">Método de pago</h4>
        <div className="space-y-2">
          {[
            { name: 'Transferencia bancaria', detail: 'CBU/CVU', selected: true },
            { name: 'MercadoPago', detail: 'Saldo o tarjeta', selected: false },
          ].map(m => (
            <div key={m.name} className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer ${m.selected ? 'border-primary bg-primary-light' : 'border-border'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${m.selected ? 'border-primary' : 'border-gray2'}`}>
                {m.selected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
              <div>
                <p className="text-sm font-medium text-text">{m.name}</p>
                <p className="text-[11px] text-gray">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleDeposit} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
        Depositar seña <ArrowRight size={16} />
      </button>
    </div>
  )
}
