'use client'
import { useState } from 'react'
import { Search, Check, X, FileText, AlertTriangle } from 'lucide-react'

export default function Step2Informes() {
  const [stage, setStage] = useState<'input' | 'searching' | 'done'>('input')
  const [domain, setDomain] = useState('AB 123 CD')

  const handleSearch = () => {
    setStage('searching')
    setTimeout(() => setStage('done'), 3000)
  }

  if (stage === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-green-light border border-green/20 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={28} className="text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-text">Auto limpio</h3>
          <p className="text-sm text-gray mt-1">Sin inhibiciones, embargos ni prendas</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-primary" />
            <h4 className="font-display font-semibold text-sm text-text">Informe de Dominio — DNRPA</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-gray">Dominio</span>
              <span className="font-mono font-bold text-text">AB 123 CD</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-gray">Titular</span>
              <span className="text-sm font-medium text-text">GONZÁLEZ, CARLOS A.</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-gray">Vehículo</span>
              <span className="text-sm text-text">TOYOTA COROLLA XEI 2020</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-gray">Motor</span>
              <span className="font-mono text-xs text-text">2NR-FE 4892751</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-gray">Chasis</span>
              <span className="font-mono text-xs text-text">MHKA5FC3200124587</span>
            </div>

            {/* Verification items */}
            <div className="mt-2 space-y-2">
              {[
                { label: 'Inhibiciones', ok: true },
                { label: 'Embargos', ok: true },
                { label: 'Prendas', ok: true },
                { label: 'Robado/Secuestrado', ok: true },
                { label: 'Radicación', ok: true, detail: 'Capital Federal' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-surface2 rounded-lg p-3">
                  <span className="text-sm text-text">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.detail && <span className="text-xs text-gray">{item.detail}</span>}
                    {item.ok ? (
                      <div className="w-6 h-6 bg-green rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red rounded-full flex items-center justify-center">
                        <X size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-[11px] text-gray flex items-center gap-1">
            <FileText size={12} /> Informe generado el 25/02/2026 — Ref: DNRPA-2026-458712
          </div>
        </div>

        <div className="bg-primary-light border border-primary/10 rounded-xl p-3 flex gap-2">
          <Check size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text2">La seña de $1.500.000 se mantiene retenida. Todo en orden para avanzar al siguiente paso.</p>
        </div>
      </div>
    )
  }

  if (stage === 'searching') {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Search size={28} className="text-primary" />
        </div>
        <h3 className="font-display font-bold text-text mb-2">Consultando DNRPA...</h3>
        <div className="space-y-3 mt-6 text-left max-w-xs mx-auto">
          {[
            { label: 'Conectando con DNRPA', done: true },
            { label: 'Verificando dominio AB 123 CD', done: true },
            { label: 'Consultando inhibiciones', done: true },
            { label: 'Consultando embargos y prendas', done: false },
            { label: 'Generando informe', done: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {s.done ? (
                <div className="w-5 h-5 bg-green rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray2/30 rounded-full animate-pulse" />
              )}
              <span className={`text-sm ${s.done ? 'text-text' : 'text-gray'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold text-sm mb-1 text-text">Consultar informes DNRPA</h3>
        <p className="text-xs text-gray mb-4">Verificamos automáticamente que el auto esté libre de problemas</p>

        <label className="text-xs font-medium text-text2 mb-1 block">Dominio del vehículo</label>
        <input
          type="text" value={domain}
          onChange={e => setDomain(e.target.value.toUpperCase())}
          className="w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-lg font-mono font-bold tracking-wider text-center placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          placeholder="AA 000 BB"
        />

        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-text2">Se van a verificar:</p>
          {['Inhibiciones del titular', 'Embargos sobre el dominio', 'Prendas registradas', 'Estado de robo/secuestro', 'Radicación del vehículo'].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-light border border-amber/10 rounded-xl p-3 flex gap-2">
        <AlertTriangle size={16} className="text-amber shrink-0 mt-0.5" />
        <p className="text-xs text-text2">El informe tiene un costo de $3.500 que se incluye en el servicio de Tramicar.</p>
      </div>

      <button onClick={handleSearch} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
        <Search size={16} /> Consultar informes
      </button>
    </div>
  )
}
