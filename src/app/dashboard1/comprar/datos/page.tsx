'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowLeft, User, CheckCircle2, Car, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function DatosCompradorPage() {
  const [form, setForm] = useState({ dni: '', name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const inputClass = "w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <Link href="/dashboard1/comprar" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Tus datos</h1>
          <p className="text-xs text-white/60">Toyota Corolla XEI 2020 — AB 123 CD</p>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">
        {!submitted ? (
          <>
            {/* Form */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-light border border-primary/10 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-text">Datos personales</h2>
                  <p className="text-xs text-gray">Para generar la documentación</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">DNI</label>
                  <input type="text" placeholder="30.123.456" value={form.dni} onChange={e => updateForm('dni', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">Nombre completo</label>
                  <input type="text" placeholder="María García" value={form.name} onChange={e => updateForm('name', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">Teléfono</label>
                  <input type="tel" placeholder="+54 11 1234-5678" value={form.phone} onChange={e => updateForm('phone', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">Email</label>
                  <input type="email" placeholder="maria@email.com" value={form.email} onChange={e => updateForm('email', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray2 text-center">
              Próximamente: verificación automática con Mi Argentina
            </p>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
            >
              Confirmar datos <ChevronRight size={18} />
            </button>
          </>
        ) : (
          <div className="animate-slide-up flex flex-col gap-4">
            {/* Success */}
            <div className="bg-green-light border border-green/20 rounded-2xl p-6 text-center">
              <CheckCircle2 size={48} className="text-green mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl text-text">¡Operación iniciada!</h2>
              <p className="text-sm text-gray mt-2">Ambas partes están confirmadas</p>
            </div>

            {/* Summary */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="font-display font-semibold text-text mb-3">Resumen de la operación</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <Car size={16} className="text-gray" />
                  <span className="text-gray">Vehículo:</span>
                  <span className="font-medium text-text">Toyota Corolla XEI 2020</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray" />
                  <span className="text-gray">Vendedor:</span>
                  <span className="font-medium text-text">Juan Pérez</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray" />
                  <span className="text-gray">Comprador:</span>
                  <span className="font-medium text-text">{form.name || 'María García'}</span>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-primary-light border border-primary/10 rounded-2xl p-5">
              <h3 className="font-display font-semibold text-primary mb-3">Próximos pasos</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-sm font-medium text-text">Verificación policial</p>
                    <p className="text-xs text-gray">Agendar turno en planta verificadora</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/60 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-sm font-medium text-text">Firma del 08D</p>
                    <p className="text-xs text-gray">Firma biométrica digital</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/30 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm font-medium text-text">Inscripción en registro</p>
                    <p className="text-xs text-gray">Elegí el registro más cercano</p>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/dashboard1">
              <button className="w-full py-3.5 border border-border bg-white text-text font-semibold rounded-full hover:border-primary transition-all flex items-center justify-center gap-2">
                <FileText size={18} /> Ver mis operaciones
              </button>
            </Link>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
