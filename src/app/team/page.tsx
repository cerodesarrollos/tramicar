'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from './store'
import { Lock, LogIn } from 'lucide-react'

export default function TeamLoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = login(name, password)
      if (user) {
        router.push('/team/dashboard')
      } else {
        setError('Credenciales incorrectas')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #13132a 50%, #0a0a0f 100%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <span className="text-3xl">🚗</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Tramicar</h1>
          <p className="text-sm text-gray-400 mt-1">Panel del Equipo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">
              <Lock size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                Entrar
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-[11px] text-gray-500">Acceso exclusivo equipo fundador</p>
          </div>
        </form>
      </div>
    </div>
  )
}
