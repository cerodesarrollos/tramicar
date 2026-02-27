'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plus, User } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive('/dashboard') ? 'text-primary' : 'text-gray'}`}>
          <LayoutDashboard size={22} />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>
        <Link href="/operacion/nueva" className="flex flex-col items-center gap-1 px-3 py-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center -mt-6 shadow-lg shadow-primary/30">
            <Plus size={24} className="text-white" />
          </div>
          <span className="text-[10px] font-medium text-primary">Nueva</span>
        </Link>
        <Link href="/perfil" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive('/perfil') ? 'text-primary' : 'text-gray'}`}>
          <User size={22} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </div>
    </nav>
  )
}
