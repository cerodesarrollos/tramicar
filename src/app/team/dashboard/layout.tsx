'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout } from '../store'
import type { TeamUser } from '../data'
import {
  LayoutDashboard, Map, Users, Lightbulb, AlertTriangle, FolderOpen, Activity,
  LogOut, Menu, X, ChevronLeft, BookOpen, Shield
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/team/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/team/dashboard/roadmap', label: 'Roadmap', icon: Map },
  { href: '/team/dashboard/decisiones', label: 'Decisiones', icon: BookOpen },
  { href: '/team/dashboard/riesgos', label: 'Riesgos', icon: Shield },
  { href: '/team/dashboard/reuniones', label: 'Reuniones', icon: Users },
  { href: '/team/dashboard/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/team/dashboard/trabas', label: 'Trabas', icon: AlertTriangle },
  { href: '/team/dashboard/recursos', label: 'Recursos', icon: FolderOpen },
  { href: '/team/dashboard/actividad', label: 'Actividad', icon: Activity },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<TeamUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const u = getUser()
    if (!u) { router.push('/team'); return }
    setUser(u)
  }, [router])

  if (!mounted || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  const handleLogout = () => { logout(); router.push('/team') }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d0d18] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between border-b border-white/5">
          <Link href="/team/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500/15 rounded-lg flex items-center justify-center text-lg">🚗</div>
            <div>
              <span className="font-display text-base font-bold text-white">Tramicar</span>
              <span className="block text-[10px] text-gray-500 -mt-0.5">Team HQ</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-indigo-500/15 text-indigo-300 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
              >
                <item.icon size={18} className={active ? 'text-indigo-400' : ''} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: `${user.color}20` }}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-[11px] text-gray-500">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors" title="Salir">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="font-display text-sm font-bold text-white">Tramicar</span>
        </div>

        <div className="p-4 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
