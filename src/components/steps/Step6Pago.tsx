'use client'
import { useState } from 'react'
import { Check, DollarSign, MessageCircle, MapPin, Shield, PartyPopper, Calendar } from 'lucide-react'

export default function Step6Pago() {
  const [stage, setStage] = useState<'coordinate' | 'payment' | 'done'>('coordinate')

  if (stage === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-gradient-to-b from-primary to-primary2 rounded-2xl p-8 text-center text-white">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="font-display font-bold text-2xl mb-2">¡Felicitaciones!</h3>
          <p className="text-white/80 text-sm mb-2">La transferencia se completó exitosamente</p>
          <p className="text-white/60 text-xs">Toyota Corolla XEI 2020 — AB 123 CD</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h4 className="font-display font-semibold text-sm mb-3 text-text">Resumen de la operación</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-border"><span className="text-gray">Precio acordado</span><span className="text-text">$18.500.000</span></div>
            <div className="flex justify-between py-1.5 border-b border-border"><span className="text-gray">Seña</span><span className="text-green">-$1.500.000</span></div>
            <div className="flex justify-between py-1.5 border-b border-border"><span className="text-gray">Descuento multas</span><span className="text-green">-$184.000</span></div>
            <div className="flex justify-between py-1.5 border-b border-border"><span className="text-gray">Servicio Tramicar</span><span className="text-text">$35.000</span></div>
            <div className="flex justify-between py-2 font-bold"><span className="text-text">Total pagado</span><span className="text-text font-display text-lg">$16.851.000</span></div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h4 className="font-display font-semibold text-sm mb-3 text-text">Timeline completo</h4>
          <div className="space-y-3">
            {[
              { date: '25/02', label: 'Seña depositada', icon: '💰' },
              { date: '25/02', label: 'Informes DNRPA — Auto limpio', icon: '📋' },
              { date: '25/02', label: 'Multas verificadas — $184.000 deuda', icon: '🔍' },
              { date: '28/02', label: 'Verificación policial aprobada', icon: '🔒' },
              { date: '05/03', label: 'Turno en Registro Nº 47', icon: '📅' },
              { date: '05/03', label: 'Pago + firma — Transferencia completada', icon: '🎉' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-light rounded-lg flex items-center justify-center text-sm">{t.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-text">{t.label}</p>
                  <p className="text-[11px] text-gray">{t.date}/2026</p>
                </div>
                <div className="w-5 h-5 bg-green rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-light border border-primary/10 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-primary mb-1">¿Te fue útil Tramicar?</p>
          <p className="text-xs text-text2">Compartilo con alguien que esté por comprar o vender un auto</p>
          <button className="mt-3 px-6 py-2 bg-primary text-white text-sm font-semibold rounded-full">Compartir</button>
        </div>
      </div>
    )
  }

  if (stage === 'payment') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm mb-1 text-text">Confirmar pago</h3>
          <p className="text-xs text-gray mb-4">Registrá el pago del vehículo</p>

          <div className="bg-surface2 rounded-xl p-4 mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray">Precio acordado</span><span className="font-bold text-text">$18.500.000</span></div>
              <div className="flex justify-between"><span className="text-gray">Seña ya depositada</span><span className="text-green">-$1.500.000</span></div>
              <div className="flex justify-between"><span className="text-gray">Descuento multas</span><span className="text-green">-$184.000</span></div>
              <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="font-bold text-text">A pagar</span><span className="font-display font-bold text-lg text-text">$16.816.000</span></div>
            </div>
          </div>

          <label className="text-xs font-medium text-text2 mb-1 block">Método de pago utilizado</label>
          <div className="space-y-2 mb-4">
            {['Transferencia bancaria', 'Efectivo', 'Cheque'].map((m, i) => (
              <div key={m} className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer ${i === 0 ? 'border-primary bg-primary-light' : 'border-border'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-primary' : 'border-gray2'}`}>
                  {i === 0 && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                </div>
                <span className="text-sm text-text">{m}</span>
              </div>
            ))}
          </div>

          <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-2 bg-surface2 cursor-pointer">
            <DollarSign size={20} className="text-gray" />
            <p className="text-xs text-gray text-center">Subir comprobante de transferencia</p>
          </div>
        </div>

        <div className="bg-amber-light border border-amber/10 rounded-xl p-3 flex gap-2">
          <Shield size={16} className="text-amber shrink-0 mt-0.5" />
          <p className="text-xs text-text2"><strong>Seguridad:</strong> Nunca pagues en efectivo en la vía pública. Usá transferencia bancaria y conservá el comprobante.</p>
        </div>

        <button onClick={() => setStage('done')} className="w-full py-3.5 bg-green text-white font-semibold rounded-full shadow-md shadow-green/20 text-sm">
          ✅ Confirmar pago realizado
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold text-sm mb-1 text-text">Coordinar encuentro</h3>
        <p className="text-xs text-gray mb-4">Ponete de acuerdo con el vendedor para el día de la firma</p>

        <div className="bg-surface2 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar size={16} className="text-primary" />
            <div>
              <p className="text-xs text-gray">Turno en Registro</p>
              <p className="text-sm font-semibold text-text">Mié 05/03/2026 — 11:00 hs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-primary" />
            <div>
              <p className="text-xs text-gray">Lugar</p>
              <p className="text-sm text-text">Av. Callao 1234 — Registro Nº 47</p>
            </div>
          </div>
        </div>

        {/* Simulated chat */}
        <div className="bg-surface2 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} className="text-primary" />
            <span className="text-xs font-semibold text-text">Chat con vendedor</span>
          </div>
          <div className="flex justify-end">
            <div className="bg-primary text-white text-xs rounded-2xl rounded-br-md px-3 py-2 max-w-[80%]">
              Hola, nos vemos el miércoles 5 en el registro?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white border border-border text-xs rounded-2xl rounded-bl-md px-3 py-2 max-w-[80%] text-text">
              Dale, perfecto. Llevo todo. Nos vemos 10:30 así tenemos tiempo.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-primary text-white text-xs rounded-2xl rounded-br-md px-3 py-2 max-w-[80%]">
              Genial, te hago la transferencia ahí antes de entrar 👍
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setStage('payment')} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full shadow-md shadow-primary/20 text-sm">
        Continuar al pago →
      </button>
    </div>
  )
}
