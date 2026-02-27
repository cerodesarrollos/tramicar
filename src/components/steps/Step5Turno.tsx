'use client'
import { useState } from 'react'
import { Check, MapPin, Calendar, Clock, FileText, Users } from 'lucide-react'

export default function Step5Turno() {
  const [stage, setStage] = useState<'searching' | 'done'>('searching')

  useState(() => {
    const timer = setTimeout(() => setStage('done'), 2000)
    return () => clearTimeout(timer)
  })

  if (stage === 'searching') {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Calendar size={28} className="text-primary" />
        </div>
        <h3 className="font-display font-bold text-text mb-2">Buscando turno...</h3>
        <p className="text-sm text-gray">Consultando disponibilidad en Registro Seccional Nº 47</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-green-light border border-green/20 rounded-2xl p-5 text-center">
        <div className="w-14 h-14 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
          <Check size={28} className="text-white" />
        </div>
        <h3 className="font-display font-bold text-lg text-text">Turno reservado</h3>
        <p className="text-sm text-gray mt-1">Registro Seccional de la Propiedad Automotor Nº 47</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-border">
            <Calendar size={16} className="text-primary" />
            <div>
              <p className="text-xs text-gray">Fecha</p>
              <p className="text-sm font-semibold text-text">Miércoles 05/03/2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-border">
            <Clock size={16} className="text-primary" />
            <div>
              <p className="text-xs text-gray">Hora</p>
              <p className="text-sm font-semibold text-text">11:00 hs</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-border">
            <MapPin size={16} className="text-primary" />
            <div>
              <p className="text-xs text-gray">Dirección</p>
              <p className="text-sm font-semibold text-text">Av. Callao 1234, Piso 2</p>
              <p className="text-xs text-gray">CABA — Registro Nº 47</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <Users size={16} className="text-primary" />
            <div>
              <p className="text-xs text-gray">Asistentes</p>
              <p className="text-sm text-text">Comprador + Vendedor (ambos deben asistir)</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-surface2 rounded-xl h-28 flex items-center justify-center border border-border">
          <div className="text-center">
            <MapPin size={20} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-gray">Av. Callao 1234, CABA</p>
            <button className="text-xs text-primary font-semibold mt-1">Abrir en Maps →</button>
          </div>
        </div>
      </div>

      {/* Checklist documentos */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-primary" />
          <h4 className="font-display font-semibold text-sm text-text">Documentos a llevar</h4>
        </div>
        <div className="space-y-2">
          {[
            { doc: 'DNI original (comprador y vendedor)', checked: true },
            { doc: 'Título del automotor original', checked: true },
            { doc: 'Formulario 08 (se firma en el registro)', checked: false },
            { doc: 'CETA (Certificado de Transferencia)', checked: false },
            { doc: 'Verificación policial aprobada', checked: true },
            { doc: 'Libre deuda de patentes', checked: true },
            { doc: 'Libre deuda de multas', checked: true },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface2 rounded-lg p-2.5">
              <div className={`w-5 h-5 rounded flex items-center justify-center ${d.checked ? 'bg-green' : 'border-2 border-gray2/30'}`}>
                {d.checked && <Check size={12} className="text-white" />}
              </div>
              <span className={`text-sm ${d.checked ? 'text-text' : 'text-gray'}`}>{d.doc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-light border border-blue/10 rounded-xl p-3">
        <p className="text-xs text-text2"><strong>Importante:</strong> El formulario 08 se completa y firma en el registro. El CETA se genera online — te guiamos en el siguiente paso.</p>
      </div>
    </div>
  )
}
