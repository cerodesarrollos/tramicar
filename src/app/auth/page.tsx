'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 800)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header azul */}
      <div className="bg-primary px-5 pt-14 pb-10 text-center">
        <Link href="/" className="font-display text-2xl font-bold text-white flex items-center justify-center gap-2 mb-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-base">🚗</div>
          Tramicar
        </Link>
        <p className="text-white/70 text-sm">Transferencias vehiculares inteligentes</p>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 -mt-5">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 max-w-sm mx-auto">
          {/* Tabs */}
          <div className="flex bg-surface2 rounded-full p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${isLogin ? 'bg-primary text-white shadow-sm' : 'text-gray'}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${!isLogin ? 'bg-primary text-white shadow-sm' : 'text-gray'}`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLogin && (
              <div>
                <label className="text-xs font-medium text-text2 mb-1 block">Nombre completo</label>
                <input
                  type="text" placeholder="Juan Pérez"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-text2 mb-1 block">Email</label>
              <input
                type="email" placeholder="tu@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text2 mb-1 block">Contraseña</label>
              <input
                type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface2 border border-border rounded-xl text-text text-sm placeholder:text-gray2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                required
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all disabled:opacity-50 mt-2 shadow-md shadow-primary/20"
            >
              {loading ? '...' : isLogin ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
