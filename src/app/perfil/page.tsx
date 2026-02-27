'use client'
import Navbar from '@/components/Navbar'
import { LogOut, User, Phone, Mail, Shield, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-10 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <User size={32} className="text-white" />
        </div>
        <h2 className="font-display font-semibold text-lg text-white">Usuario Demo</h2>
        <p className="text-xs text-white/60">demo@tramicar.com</p>
      </div>

      <div className="px-5 -mt-4 flex flex-col gap-4">
        {/* Info */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {[
            { icon: <User size={18} />, label: 'Nombre', value: 'Usuario Demo' },
            { icon: <Mail size={18} />, label: 'Email', value: 'demo@tramicar.com' },
            { icon: <Phone size={18} />, label: 'Teléfono', value: '+54 11 1234-5678' },
            { icon: <Shield size={18} />, label: 'DNI', value: '••••••••' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-4 ${i < 3 ? 'border-b border-border' : ''}`}>
              <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center text-primary">{item.icon}</div>
              <div className="flex-1">
                <p className="text-[11px] text-gray">{item.label}</p>
                <p className="text-sm text-text font-medium">{item.value}</p>
              </div>
              <ChevronRight size={16} className="text-gray2" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-semibold text-sm mb-3 text-text">Estadísticas</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-primary-light rounded-xl p-3">
              <div className="font-display text-2xl font-bold text-primary">2</div>
              <p className="text-[10px] text-gray mt-1">Operaciones</p>
            </div>
            <div className="text-center bg-green-light rounded-xl p-3">
              <div className="font-display text-2xl font-bold text-green">1</div>
              <p className="text-[10px] text-gray mt-1">Completadas</p>
            </div>
            <div className="text-center bg-amber-light rounded-xl p-3">
              <div className="font-display text-2xl font-bold text-amber">1</div>
              <p className="text-[10px] text-gray mt-1">En curso</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Link href="/auth">
          <button className="w-full py-3.5 border border-red/30 text-red font-semibold rounded-full hover:bg-red-light transition-all flex items-center justify-center gap-2 text-sm bg-white">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </Link>
      </div>

      <Navbar />
    </div>
  )
}
