'use client'
import { useState } from 'react'
import { Camera, Check, MapPin, Calendar, Clock, Car } from 'lucide-react'

export default function Step4Verificacion() {
  const [stage, setStage] = useState<'ocr' | 'turno' | 'done'>('ocr')

  const handleOCR = () => {
    setTimeout(() => setStage('turno'), 2000)
  }

  if (stage === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-green-light border border-green/20 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={28} className="text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-text">Turno confirmado</h3>
          <p className="text-sm text-gray mt-1">Verificación policial agendada</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <Calendar size={16} className="text-primary" />
              <div>
                <p className="text-xs text-gray">Fecha</p>
                <p className="text-sm font-semibold text-text">Viernes 28/02/2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <Clock size={16} className="text-primary" />
              <div>
                <p className="text-xs text-gray">Hora</p>
                <p className="text-sm font-semibold text-text">10:30 hs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-border">
              <MapPin size={16} className="text-primary" />
              <div>
                <p className="text-xs text-gray">Planta verificadora</p>
                <p className="text-sm font-semibold text-text">VPA San Martín</p>
                <p className="text-xs text-gray">Av. San Martín 4592, CABA</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <Car size={16} className="text-primary" />
              <div>
                <p className="text-xs text-gray">Vehículo</p>
                <p className="text-sm font-semibold text-text">Toyota Corolla XEI — AB 123 CD</p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-4 bg-surface2 rounded-xl h-32 flex items-center justify-center border border-border">
            <div className="text-center">
              <MapPin size={24} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-gray">Av. San Martín 4592, CABA</p>
              <button className="text-xs text-primary font-semibold mt-1">Abrir en Maps →</button>
            </div>
          </div>
        </div>

        <div className="bg-blue-light border border-blue/10 rounded-xl p-3">
          <p className="text-xs text-text2"><strong>Recordá:</strong> Llevá el auto limpio. Tené a mano el título original y tu DNI. La verificación dura aprox. 30 minutos.</p>
        </div>
      </div>
    )
  }

  if (stage === 'turno') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-green-light border border-green/20 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={28} className="text-white" />
          </div>
          <h3 className="font-display font-bold text-text">Datos cargados automáticamente</h3>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h4 className="font-display font-semibold text-sm mb-3 text-text">Datos extraídos del título</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between bg-surface2 rounded-lg p-2.5"><span className="text-gray">Marca</span><span className="font-medium text-text">TOYOTA</span></div>
            <div className="flex justify-between bg-surface2 rounded-lg p-2.5"><span className="text-gray">Modelo</span><span className="font-medium text-text">COROLLA XEI 1.8 CVT</span></div>
            <div className="flex justify-between bg-surface2 rounded-lg p-2.5"><span className="text-gray">Año</span><span className="font-medium text-text">2020</span></div>
            <div className="flex justify-between bg-surface2 rounded-lg p-2.5"><span className="text-gray">Motor</span><span className="font-mono text-xs text-text">2NR-FE 4892751</span></div>
            <div className="flex justify-between bg-surface2 rounded-lg p-2.5"><span className="text-gray">Chasis</span><span className="font-mono text-xs text-text">MHKA5FC3200124587</span></div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h4 className="font-display font-semibold text-sm mb-3 text-text">Turnos disponibles</h4>
          <div className="space-y-2">
            {[
              { date: 'Vie 28/02', time: '10:30', place: 'VPA San Martín', available: true },
              { date: 'Lun 03/03', time: '14:00', place: 'VPA Liniers', available: true },
              { date: 'Mar 04/03', time: '09:00', place: 'VPA San Martín', available: true },
            ].map((t, i) => (
              <button
                key={i}
                onClick={() => setStage('done')}
                className={`w-full border rounded-xl p-3 flex items-center justify-between text-left transition-all ${i === 0 ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/30'}`}
              >
                <div>
                  <p className="text-sm font-semibold text-text">{t.date} — {t.time} hs</p>
                  <p className="text-xs text-gray">{t.place}</p>
                </div>
                {i === 0 && <span className="text-[10px] bg-green-light text-green border border-green/20 px-2 py-0.5 rounded-full font-semibold">Más próximo</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display font-semibold text-sm mb-1 text-text">Foto del título</h3>
        <p className="text-xs text-gray mb-4">Sacale una foto al frente del título. Extraemos los datos automáticamente.</p>

        <div
          onClick={handleOCR}
          className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary-light/50 transition-all"
        >
          <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center">
            <Camera size={32} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-primary">Tomar foto del título</p>
          <p className="text-[11px] text-gray text-center">La IA lee marca, modelo, motor y chasis automáticamente</p>
        </div>
      </div>

      <div className="bg-blue-light border border-blue/10 rounded-xl p-3 flex gap-2">
        <Camera size={16} className="text-blue shrink-0 mt-0.5" />
        <p className="text-xs text-text2">Asegurate de que la foto esté bien iluminada y se lean todos los datos del título.</p>
      </div>
    </div>
  )
}
