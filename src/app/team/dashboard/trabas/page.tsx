'use client'
import { useEffect, useState } from 'react'
import { getBlockers, saveBlockers, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Blocker } from '../../data'
import { AlertTriangle, Plus, X } from 'lucide-react'

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  alta: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: '🔴 Alta' },
  media: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: '🟡 Media' },
  baja: { bg: 'bg-gray-500/10 border-gray-500/20', text: 'text-gray-400', label: '⚪ Baja' },
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  'abierta': { bg: 'bg-red-500/15 text-red-300', label: 'Abierta' },
  'en-progreso': { bg: 'bg-amber-500/15 text-amber-300', label: 'En progreso' },
  'resuelta': { bg: 'bg-emerald-500/15 text-emerald-300', label: 'Resuelta' },
}

export default function TrabasPage() {
  const [blockers, setBlockers] = useState<Blocker[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'media' as Blocker['priority'], assignee: '' })
  const [filter, setFilter] = useState<'all' | 'abierta' | 'en-progreso' | 'resuelta'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getBlockers().then(setBlockers)
    setForm(f => ({ ...f, assignee: getUser()?.id || 'matias' }))
  }, [])

  if (!mounted) return null

  const addBlocker = () => {
    if (!form.title.trim()) return
    const user = getUser()
    const b: Blocker = {
      id: `b${Date.now()}`, title: form.title.trim(), description: form.description.trim(),
      priority: form.priority, assignee: form.assignee, status: 'abierta',
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [b, ...blockers]
    setBlockers(updated)
    saveBlockers(updated)
    addActivity(user?.id || 'unknown', 'reportó traba', form.title.trim())
    setForm({ title: '', description: '', priority: 'media', assignee: user?.id || 'matias' })
    setShowForm(false)
  }

  const updateStatus = (id: string, status: Blocker['status']) => {
    const updated = blockers.map(b => b.id === id ? { ...b, status } : b)
    setBlockers(updated)
    saveBlockers(updated)
    const b = updated.find(x => x.id === id)
    if (b) addActivity(getUser()?.id || 'unknown', status === 'resuelta' ? 'resolvió' : 'actualizó', b.title)
  }

  const deleteBlocker = (id: string) => {
    const b = blockers.find(x => x.id === id)
    const updated = blockers.filter(x => x.id !== id)
    setBlockers(updated)
    saveBlockers(updated)
    if (b) addActivity(getUser()?.id || 'unknown', 'eliminó traba', b.title)
  }

  const filtered = filter === 'all' ? blockers : blockers.filter(b => b.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle size={22} className="text-red-400" /> Trabas
          </h1>
          <p className="text-gray-400 text-sm mt-1">Blockers y problemas a resolver</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={16} /> Reportar
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([['all', 'Todas'], ['abierta', 'Abiertas'], ['en-progreso', 'En progreso'], ['resuelta', 'Resueltas']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${filter === key ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-gray-400 hover:text-gray-200 bg-white/[0.02] border border-white/[0.06]'}`}>
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="¿Qué está bloqueando?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Detalle..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-20 resize-none" />
          <div className="flex gap-3">
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Blocker['priority'] })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              <option value="alta">🔴 Alta</option><option value="media">🟡 Media</option><option value="baja">⚪ Baja</option>
            </select>
            <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              {TEAM_USERS.map(u => <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addBlocker} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl">Reportar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2">Cancelar</button>
          </div>
        </div>
      )}

      {/* Blockers list */}
      <div className="space-y-3">
        {filtered.map(b => {
          const ps = PRIORITY_STYLES[b.priority]
          const ss = STATUS_STYLES[b.status]
          const assignee = TEAM_USERS.find(u => u.id === b.assignee)
          return (
            <div key={b.id} className={`${ps.bg} border rounded-2xl p-4 group transition-all`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-white">{b.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${ss.bg}`}>{ss.label}</span>
                  </div>
                  {b.description && <p className="text-xs text-gray-400 mt-1.5">{b.description}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: assignee?.color }}>
                      <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: `${assignee?.color}20` }}>{assignee?.avatar}</span>
                      {assignee?.name}
                    </span>
                    <span className="text-[10px] text-gray-600">{b.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value as Blocker['status'])}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-400 focus:outline-none cursor-pointer">
                    <option value="abierta">Abierta</option><option value="en-progreso">En progreso</option><option value="resuelta">Resuelta</option>
                  </select>
                  <button onClick={() => deleteBlocker(b.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
