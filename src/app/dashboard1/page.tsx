'use client'
import Navbar from '@/components/Navbar'
import { Car, ShoppingCart, Building2, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard1Page() {
  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-8">
        <p className="text-white/60 text-xs">Bienvenido 👋</p>
        <h1 className="font-display text-xl font-bold text-white">¿Qué querés hacer?</h1>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">
        {/* Vendo */}
        <Link href="/dashboard1/vender">
          <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-green-light border border-green/20 rounded-2xl flex items-center justify-center shrink-0">
              <Car size={28} className="text-green" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg text-text">Vendo mi auto</h2>
              <p className="text-xs text-gray mt-1">Verificá el estado, prepará la documentación e invitá al comprador</p>
            </div>
            <ChevronRight size={20} className="text-gray2 group-hover:text-primary transition-colors" />
          </div>
        </Link>

        {/* Compro */}
        <Link href="/dashboard1/comprar">
          <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-blue-light border border-blue/20 rounded-2xl flex items-center justify-center shrink-0">
              <ShoppingCart size={28} className="text-blue" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg text-text">Compro un auto</h2>
              <p className="text-xs text-gray mt-1">Ingresá con el link del vendedor o cargá la patente</p>
            </div>
            <ChevronRight size={20} className="text-gray2 group-hover:text-primary transition-colors" />
          </div>
        </Link>

        {/* Separator */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-gray2 uppercase tracking-widest">Tu perfil</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Tipo de cuenta */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-xs text-gray mb-3">Tipo de cuenta</p>
          <div className="flex gap-2">
            <button className="flex-1 py-3 px-3 bg-primary text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
              <User size={16} />
              Particular
            </button>
            <button className="flex-1 py-3 px-3 bg-surface2 text-text2 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-surface3 transition-colors">
              <Building2 size={16} />
              Agencia
            </button>
          </div>
          <p className="text-[10px] text-gray2 mt-3 text-center">
            Próximamente: ingresá con Mi Argentina para verificar tu identidad
          </p>
        </div>
      </div>

      <Navbar />
    </div>
  )
}
