'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout } from '../store'
import type { TeamUser } from '../data'
import {
  LayoutDashboard, Map, Users, Lightbulb, AlertTriangle, FolderOpen, Activity,
  LogOut, Menu, X, BookOpen, Shield, StickyNote
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
  { href: '/team/dashboard/notepad', label: 'Notepad', icon: StickyNote },
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
      <div className="relative">
        <div className="w-10 h-10 border-2 border-indigo-500/20 rounded-full animate-spin" style={{ borderTopColor: '#6366f1' }} />
        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent rounded-full animate-spin" style={{ borderRightColor: '#8b5cf6', animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
    </div>
  )

  const handleLogout = () => { logout(); router.push('/team') }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar glass background */}
        <div className="absolute inset-0 bg-[#0a0b14]/80 backdrop-blur-2xl border-r border-white/[0.04]" />
        {/* Subtle gradient accent at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="relative px-5 py-5 flex items-center justify-between">
          <Link href="/team/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-lg border border-indigo-500/10 group-hover:border-indigo-500/25 transition-all duration-300 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
              🚗
            </div>
            <div>
              <span className="font-display text-[15px] font-bold text-white tracking-tight">Tramicar</span>
              <span className="block text-[10px] text-indigo-400/50 font-medium tracking-wider uppercase">Team HQ</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="relative mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Nav */}
        <nav className="relative flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                }`}
              >
                {/* Active indicator background */}
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/[0.12] to-violet-500/[0.06] border border-indigo-500/[0.12]" />
                )}
                {/* Active left accent */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-gradient-to-b from-indigo-400 to-violet-400" />
                )}
                <item.icon size={17} className={`relative z-10 ${active ? 'text-indigo-400' : ''}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="relative mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* User */}
        <div className="relative px-3 py-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base ring-1 ring-white/[0.06] group-hover:ring-white/[0.12] transition-all" style={{ background: `${user.color}15` }}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-200 truncate">{user.name}</p>
              <p className="text-[11px] text-gray-600">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors duration-200 p-1 rounded-lg hover:bg-red-500/5" title="Salir">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 backdrop-blur-2xl border-b border-white/[0.04] px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(10,10,15,0.85)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-white transition-colors p-1">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base">🚗</span>
            <span className="font-display text-sm font-bold text-white tracking-tight">Tramicar</span>
          </div>
        </div>

        <div className="p-5 lg:p-10 max-w-[1100px]">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
