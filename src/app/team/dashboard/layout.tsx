'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getUser, logout } from '../store'
import type { TeamUser } from '../data'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="w-8 h-8 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin" />
    </div>
  )

  const handleLogout = () => { logout(); router.push('/team') }
  const currentPage = NAV_ITEMS.find(item => item.href === pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen flex bg-[#09090b]">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] bg-[#0c0c0f] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-4 py-5 flex items-center justify-between">
          <Link href="/team/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-sm font-semibold text-white/90 border border-white/[0.06]">T</div>
            <div>
              <span className="text-[14px] font-semibold text-white/90 tracking-tight">Tramicar</span>
              <span className="block text-[10px] text-white/30 -mt-0.5 font-medium">Team HQ</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>
        </div>

        <Separator className="bg-white/[0.06] mx-4" />

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-150 ${active ? 'bg-white/[0.08] text-white font-medium' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
                <item.icon size={16} strokeWidth={1.5} className={active ? 'text-white/90' : 'text-white/30'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-2 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Avatar className="h-8 w-8 border border-white/[0.08]">
              <AvatarFallback className="bg-white/[0.06] text-white/70 text-xs font-medium">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white/80 truncate">{user.name}</p>
              <p className="text-[11px] text-white/30">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}
              className="h-7 w-7 text-white/30 hover:text-red-400 hover:bg-red-500/10" title="Salir">
              <LogOut size={14} />
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 lg:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white/80 transition-colors">
            <Menu size={20} />
          </button>
          <h2 className="text-sm font-medium text-white/70 hidden lg:block">{currentPage}</h2>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-1.5 w-56 hover:border-white/[0.1] transition-colors">
            <Search size={14} className="text-white/30" />
            <input placeholder="Buscar..." className="bg-transparent text-[13px] text-white/70 placeholder:text-white/25 focus:outline-none w-full" readOnly />
          </div>
          <Avatar className="h-7 w-7 border border-white/[0.08]">
            <AvatarFallback className="bg-white/[0.06] text-white/60 text-xs">{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </header>

        <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }} className="p-4 lg:p-6 max-w-[1100px] flex-1">
          {children}
        </motion.div>
      </main>
    </div>
  )
}
