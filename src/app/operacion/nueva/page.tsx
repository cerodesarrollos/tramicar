'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Car, Camera } from 'lucide-react'
import Link from 'next/link'

export default function NuevaOperacionPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    brand: '', model: '', year: '', plate: '', price: '', sellerEmail: '',
  })
  const [loading, setLoading] = useState(false)

  const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleCreate = () => {
    setLoading(true)
    setTimeout(() => router.push('/operacion/op-001'), 1000)
  }

  const inputClass = "w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <Link href="/dashboard" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Nueva operación</h1>
          <p className="text-xs text-white/60">Paso {step} de 2</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 py-4">
        <div className="flex gap-2">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-surface3'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-surface3'}`} />
        </div>
      </div>

      <div className="px-5">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center border border-primary/10">
                  <Car size={20} className="text-primary" />
                </div>
                <h2 className="font-display font-semibold text-text">Datos del vehículo</h2>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">Marca</label>
                  <input type="text" placeholder="Ej: Toyota" value={form.brand} onChange={e => updateForm('brand', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">Modelo</label>
                  <input type="text" placeholder="Ej: Corolla XEI" value={form.model} onChange={e => updateForm('model', e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1 block">Año</label>
                    <input type="number" placeholder="2020" value={form.year} onChange={e => updateForm('year', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1 block">Patente</label>
                    <input type="text" placeholder="AB 123 CD" value={form.plate} onChange={e => updateForm('plate', e.target.value.toUpperCase())} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1 block">Precio acordado</label>
                  <input type="number" placeholder="$18.500.000" value={form.price} onChange={e => updateForm('price', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="mt-4 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-all bg-surface2">
                <Camera size={24} className="text-gray" />
                <p className="text-xs text-gray text-center">Sacale una foto al título<br /><span className="text-primary font-medium">Autocarga de datos con IA</span></p>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20">
              Siguiente →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold mb-1 text-text">Invitar al vendedor</h2>
              <p className="text-xs text-gray mb-4">Le va a llegar un link para que siga el proceso desde su lado.</p>
              <label className="text-xs font-medium text-text2 mb-1 block">Email del vendedor</label>
              <input type="email" placeholder="vendedor@email.com" value={form.sellerEmail} onChange={e => updateForm('sellerEmail', e.target.value)} className={inputClass} />
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold mb-3 text-text">Resumen</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray">Vehículo</span><span className="font-medium text-text">{form.brand} {form.model}</span></div>
                <div className="flex justify-between"><span className="text-gray">Año</span><span className="font-medium text-text">{form.year}</span></div>
                <div className="flex justify-between"><span className="text-gray">Patente</span><span className="font-medium text-text">{form.plate}</span></div>
                <div className="border-t border-border pt-2.5 flex justify-between"><span className="text-gray">Precio</span><span className="font-display font-bold text-text">${Number(form.price || 0).toLocaleString('es-AR')}</span></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-border text-text font-semibold rounded-full hover:border-primary transition-all bg-white">
                ← Atrás
              </button>
              <button onClick={handleCreate} disabled={loading} className="flex-1 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all disabled:opacity-50 shadow-md shadow-primary/20">
                {loading ? 'Creando...' : 'Crear operación'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
