'use client'
import { useEffect, useState } from 'react'
import { getBlockers, saveBlockers, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Blocker } from '../../data'
import { AlertTriangle, Plus, X, Pencil, Trash2 } from 'lucide-react'

const PRIORITY_STYLES: Record<string, { bg: string; border: string; text: string; label: string; dot: string }> = {
  alta: { bg: 'bg-red-500/[0.06]', border: 'border-red-500/15', text: 'text-red-400', label: '🔴 Alta', dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' },
  media: { bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/15', text: 'text-amber-400', label: '🟡 Media', dot: 'bg-amber-500' },
  baja: { bg: 'bg-white/[0.02]', border: 'border-white/[0.06]', text: 'text-gray-400', label: '⚪ Baja', dot: 'bg-gray-600' },
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  'abierta': { bg: 'bg-red-500/10 text-red-300', label: 'Abierta' },
  'en-progreso': { bg: 'bg-amber-500/10 text-amber-300', label: 'En progreso' },
  'resuelta': { bg: 'bg-emerald-500/10 text-emerald-300', label: 'Resuelta' },
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            Trabas
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Blockers y problemas a resolver</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Reportar
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([['all', 'Todas'], ['abierta', 'Abiertas'], ['en-progreso', 'En progreso'], ['resuelta', 'Resueltas']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-[12px] font-medium px-4 py-2 rounded-xl transition-all duration-200 ${filter === key ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)]' : 'text-gray-500 hover:text-gray-300 bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08]'}`}>
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="glass-card !border-indigo-500/15 rounded-2xl p-6 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="¿Qué está bloqueando?"
            className="premium-input w-full" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Detalle..."
            className="premium-input w-full h-20 resize-none" />
          <div className="flex gap-3">
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Blocker['priority'] })}
              className="premium-input !py-2">
              <option value="alta">🔴 Alta</option><option value="media">🟡 Media</option><option value="baja">⚪ Baja</option>
            </select>
            <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}
              className="premium-input !py-2">
              {TEAM_USERS.map(u => <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addBlocker} className="btn-primary">Reportar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition-colors">Cancelar</button>
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
            <div key={b.id} className={`${ps.bg} ${ps.border} border rounded-2xl p-5 group transition-all duration-200 hover:border-opacity-100`}>
              <div className="flex items-start gap-4">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${ps.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-[13px] font-semibold text-white">{b.title}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${ss.bg}`}>{ss.label}</span>
                  </div>
                  {b.description && <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">{b.description}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-2 text-[11px]" style={{ color: assignee?.color }}>
                      <span className="w-5 h-5 rounded-lg text-[10px] flex items-center justify-center ring-1 ring-white/[0.04]" style={{ background: `${assignee?.color}15` }}>{assignee?.avatar}</span>
                      {assignee?.name}
                    </span>
                    <span className="text-[10px] text-gray-700">{b.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value as Blocker['status'])}
                    className="text-[10px] bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-gray-400 focus:outline-none cursor-pointer hover:border-white/[0.12] transition-all">
                    <option value="abierta">Abierta</option><option value="en-progreso">En progreso</option><option value="resuelta">Resuelta</option>
                  </select>
                  <button onClick={() => deleteBlocker(b.id)} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-500/5">
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
