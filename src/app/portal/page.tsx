'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, LayoutDashboard, Globe, Smartphone, BarChart3, Eye, EyeOff } from 'lucide-react'

const USERS = [
  { id: 'matias', name: 'Matias', password: 'ceo123', role: 'CEO/CTO', avatar: '🧠' },
  { id: 'jony', name: 'Jony', password: 'com123', role: 'Comercial', avatar: '🤝' },
  { id: 'diego', name: 'Diego', password: 'adv123', role: 'Advisor', avatar: '🎯' },
]

interface Product {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  status: 'live' | 'preview' | 'dev'
  statusLabel: string
  color: string
  gradient: string
  features: string[]
}

const PRODUCTS: Product[] = [
  {
    id: 'team',
    title: 'Dashboard Operativo',
    description: 'Centro de control del equipo. Roadmap, decisiones, riesgos, reuniones, ideas y trabas. Todo conectado a Supabase en tiempo real.',
    icon: LayoutDashboard,
    href: '/team',
    status: 'live',
    statusLabel: 'Operativo',
    color: '#818cf8',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    features: ['Roadmap interactivo', 'Decision Log', 'Risk Register', '9 secciones completas'],
  },
  {
    id: 'web',
    title: 'Página Web',
    description: 'Landing page pública de Tramicar. Explica el servicio, genera confianza y captura leads. Mobile-first con PWA.',
    icon: Globe,
    href: '/',
    status: 'live',
    statusLabel: 'Online',
    color: '#34d399',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    features: ['Landing responsive', 'SEO optimizado', 'PWA instalable', 'Diseño profesional'],
  },
  {
    id: 'app',
    title: 'App de Transferencias',
    description: 'Flujo completo vendedor↔comprador: carga de vehículo, pre-diagnóstico, informes DNRPA, verificación policial, firma biométrica 08D y coordinación de pago.',
    icon: Smartphone,
    href: '/dashboard1',
    status: 'preview',
    statusLabel: 'Preview',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-500/20',
    features: ['Flujo vendedor (11 pasos)', 'Flujo comprador', 'Firma biométrica 08D', 'Informes expandibles'],
  },
  {
    id: 'analytics',
    title: 'Analytics & Métricas',
    description: 'Dashboard de datos del mercado automotor: autos más patentados, marcas más vendidas, precios por zona. Producto de datos para concesionarias.',
    icon: BarChart3,
    href: '#',
    status: 'dev',
    statusLabel: 'En desarrollo',
    color: '#f472b6',
    gradient: 'from-pink-500/20 to-rose-500/20',
    features: ['Datos DNRPA agregados', 'Reportes por zona', 'API para concesionarias', 'Trends de mercado'],
  },
]

const STATUS_STYLES = {
  live: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  preview: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-500' },
  dev: { bg: 'bg-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-600' },
}

export default function PortalPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<typeof USERS[0] | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const found = USERS.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password)
    if (found) {
      setUser(found)
      setTimeout(() => { setLoggedIn(true); setLoading(false) }, 400)
    } else {
      setError('Credenciales incorrectas')
      setLoading(false)
    }
  }

  const navigate = (product: Product) => {
    if (product.status === 'dev') return
    if (product.id === 'team') {
      // Set team auth
      localStorage.setItem('tramicar_team_user', JSON.stringify({
        id: user!.id, name: user!.name, role: user!.role,
        password: user!.password, avatar: user!.avatar, color: '#818cf8',
      }))
    }
    router.push(product.href)
  }

  // ─── Login Screen ───
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111128 50%, #0a0a0f 100%)' }}>
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <span className="text-3xl">🚗</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Trami<span className="text-indigo-400">car</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Portal interno del equipo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Nombre</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !name || !password}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={14} />
                  Ingresar
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-600 mt-4">
            Acceso restringido al equipo fundador
          </p>
        </div>
      </div>
    )
  }

  // ─── Portal (logged in) ───
  return (
    <div className="min-h-screen px-4 py-8 md:py-12" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111128 50%, #0a0a0f 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">
                {user?.avatar}
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">
                  Hola, {user?.name}
                </h1>
                <p className="text-xs text-gray-500">{user?.role} · Tramicar</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setLoggedIn(false); setUser(null); setName(''); setPassword('') }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Subtitle */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-semibold text-white mb-1">Plataforma Tramicar</h2>
          <p className="text-sm text-gray-400">Elegí a dónde querés ir. Cada módulo tiene su función específica.</p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {PRODUCTS.map(product => {
            const status = STATUS_STYLES[product.status]
            const isClickable = product.status !== 'dev'

            return (
              <button
                key={product.id}
                onClick={() => navigate(product)}
                disabled={!isClickable}
                className={`text-left bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 transition-all group ${
                  isClickable
                    ? 'hover:border-white/15 hover:bg-white/[0.05] cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} border border-white/[0.06] flex items-center justify-center`}>
                    <product.icon size={22} style={{ color: product.color }} />
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${product.status === 'live' ? 'animate-pulse' : ''}`} />
                    {product.statusLabel}
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.features.map(f => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/[0.04]">
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {isClickable && (
                  <div className="flex items-center gap-1 text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Entrar <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[11px] text-gray-600">
            Tramicar · Primera plataforma de transferencias vehiculares de Argentina
          </p>
          <p className="text-[10px] text-gray-700 mt-1">
            Built by Aidaptive · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
