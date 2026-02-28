'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout } from '../store'
import type { TeamUser } from '../data'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Users, Lightbulb, AlertTriangle, FolderOpen, Activity,
  LogOut, Menu, X, BookOpen, Shield, StickyNote, Search, ChevronRight
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  const handleLogout = () => { logout(); router.push('/team') }

  const currentPage = NAV_ITEMS.find(item => item.href === pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen flex bg-[#f8f9fb]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between">
          <Link href="/team/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:shadow transition-shadow">🚗</div>
            <div>
              <span className="font-display text-base font-bold text-gray-900">Tramicar</span>
              <span className="block text-[10px] text-gray-400 -mt-0.5 font-medium tracking-wide">Team HQ</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors">
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
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 ${active ? 'bg-gray-900 text-white font-medium shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <item.icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
                {item.label}
                {active && (
                  <ChevronRight size={14} className="ml-auto text-gray-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm" style={{ background: `${user.color}15` }}>
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-[11px] text-gray-400">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50" title="Salir">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-8 py-3.5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors">
            <Menu size={22} />
          </button>

          <h2 className="font-display text-lg font-bold text-gray-900 hidden lg:block">{currentPage}</h2>

          <div className="flex-1" />

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-2 w-64 hover:border-gray-200 transition-colors">
            <Search size={15} className="text-gray-400" />
            <input
              placeholder="Buscar..."
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
              readOnly
            />
          </div>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm ring-2 ring-white" style={{ background: `${user.color}15` }}>
            {user.avatar}
          </div>
        </header>

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-4 lg:p-8 max-w-6xl flex-1"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
