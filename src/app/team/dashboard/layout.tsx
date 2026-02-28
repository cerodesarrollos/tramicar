'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout } from '../store'
import type { TeamUser } from '../data'
import {
  LayoutDashboard, Map, Users, Lightbulb, AlertTriangle, FolderOpen, Activity,
  LogOut, Menu, X, BookOpen, Shield, StickyNote, Search
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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  const handleLogout = () => { logout(); router.push('/team') }

  const currentPage = NAV_ITEMS.find(item => item.href === pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen flex bg-[#f5f7fa]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between">
          <Link href="/team/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">🚗</div>
            <div>
              <span className="font-display text-base font-bold text-gray-900">Tramicar</span>
              <span className="block text-[10px] text-gray-400 -mt-0.5 font-medium">Team HQ</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${active ? 'bg-gray-900 text-white font-medium shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <item.icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: `${user.color}15` }}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-[11px] text-gray-400">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Salir">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 lg:px-8 py-3.5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>

          <h2 className="font-display text-lg font-bold text-gray-900 hidden lg:block">{currentPage}</h2>

          <div className="flex-1" />

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100/80 rounded-xl px-3.5 py-2 w-64">
            <Search size={15} className="text-gray-400" />
            <input
              placeholder="Buscar..."
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
              readOnly
            />
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${user.color}15` }}>
            {user.avatar}
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
